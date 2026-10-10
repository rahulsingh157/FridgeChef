const Groq = require("groq-sdk");

/**
 * Normalize ingredient name for comparison:
 * - lowercase & trim
 * - remove non-alphanumeric chars (except spaces)
 * - basic singularization for common plurals (tomatoes -> tomato, etc.)
 */
const normalizeIngredientName = (name) => {
    if (!name || typeof name !== "string") return "";
    let clean = name.toLowerCase().trim();
    clean = clean.replace(/[^\w\s]/g, "");
    clean = clean.replace(/\s+/g, " ");

    if (clean.endsWith("es")) {
        if (clean.endsWith("tomatoes")) clean = clean.slice(0, -2);
        else if (clean.endsWith("potatoes")) clean = clean.slice(0, -2);
        else if (clean.endsWith("berries")) clean = clean.slice(0, -3) + "y";
        else if (clean.endsWith("busses") || clean.endsWith("glasses")) clean = clean.slice(0, -2);
        else clean = clean.slice(0, -1);
    } else if (clean.endsWith("s") && !clean.endsWith("ss") && !clean.endsWith("is") && !clean.endsWith("us")) {
        clean = clean.slice(0, -1);
    }
    return clean;
};

/**
 * Safe ingredient matching check between a pantry item name and a recipe ingredient name.
 */
const isIngredientMatch = (pantryName, recipeIngName) => {
    const normPantry = normalizeIngredientName(pantryName);
    const normRecipe = normalizeIngredientName(recipeIngName);

    if (!normPantry || !normRecipe) return false;
    if (normPantry === normRecipe) return true;

    const pantryWords = normPantry.split(" ");
    const recipeWords = normRecipe.split(" ");

    const isSubset =
        recipeWords.every((w) => pantryWords.includes(w)) ||
        pantryWords.every((w) => recipeWords.includes(w));

    return isSubset;
};

/**
 * Validate and clean recipes returned by Groq AI.
 */
const validateAndCleanRecipes = (parsedJson) => {
    if (!parsedJson || typeof parsedJson !== "object") return null;

    const recipes = parsedJson.recipes;
    if (!Array.isArray(recipes) || recipes.length === 0) return null;

    const cleaned = [];

    recipes.forEach((r) => {
        if (!r.name || typeof r.name !== "string" || !r.name.trim()) return;
        if (!r.description || typeof r.description !== "string") return;
        if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) return;
        if (!Array.isArray(r.instructions) || r.instructions.length === 0) return;

        let cookingTime = Number(r.cookingTime);
        if (!Number.isFinite(cookingTime) || cookingTime <= 0) {
            cookingTime = 20;
        }

        const difficulty = ["Easy", "Medium", "Hard"].includes(r.difficulty)
            ? r.difficulty
            : "Easy";

        const validIngredients = [];
        r.ingredients.forEach((ing) => {
            if (!ing || !ing.name || typeof ing.name !== "string" || !ing.name.trim()) return;
            let qty = Number(ing.quantity);
            if (!Number.isFinite(qty) || qty <= 0) {
                qty = 1;
            }
            validIngredients.push({
                name: ing.name.trim(),
                quantity: qty,
                unit: typeof ing.unit === "string" && ing.unit.trim() ? ing.unit.trim().toLowerCase() : "piece"
            });
        });

        if (validIngredients.length === 0) return;

        const validInstructions = r.instructions
            .filter((inst) => typeof inst === "string" && inst.trim().length > 0)
            .map((inst) => inst.trim());

        if (validInstructions.length === 0) return;

        cleaned.push({
            name: r.name.trim(),
            description: r.description.trim(),
            cookingTime,
            difficulty,
            cuisine: typeof r.cuisine === "string" && r.cuisine.trim() ? r.cuisine.trim() : "General",
            ingredients: validIngredients,
            instructions: validInstructions
        });
    });

    return cleaned.length > 0 ? cleaned : null;
};

/**
 * Call Groq API to generate recipes dynamically based on pantry items.
 */
const generateRecipesWithGroq = async (pantryItems) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
        throw new Error("GROQ_API_KEY is missing from backend environment.");
    }

    const groq = new Groq({ apiKey });
    const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    const formattedPantry = pantryItems
        .map((item) => `- ${item.name}: ${item.quantity} ${item.unit}`)
        .join("\n");

    const prompt = `
You are an expert chef creating recipes for a smart fridge meal planner.

The user has the following confirmed pantry ingredients:
${formattedPantry}

Task:
Generate 4 to 6 distinct, delicious, and realistic recipes primarily utilizing the user's available pantry ingredients.

Rules:
1. Prioritize recipes that maximize the use of available pantry items.
2. You MAY include additional common ingredients (spices, oil, salt, garlic, water, etc.) as missing items, but keep missing ingredients practical.
3. DO NOT invent or assume unlisted items exist in the user's pantry.
4. DO NOT create unsafe or nonsensical ingredient combinations.
5. Cooking time must be a positive integer representing minutes.
6. Difficulty must be one of: "Easy", "Medium", "Hard".
7. Cuisine must be a standard food cuisine (e.g. "Indian", "Italian", "Mexican", "Asian", "American", "Mediterranean").
8. Ingredient units must be standard (e.g. "piece", "gram", "kg", "ml", "liter", "carton", "tbsp", "tsp", "cup", "clove").

Return a JSON object with this EXACT structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Short appetizing description of the dish.",
      "cookingTime": 20,
      "difficulty": "Easy",
      "cuisine": "Indian",
      "ingredients": [
        {
          "name": "Ingredient Name",
          "quantity": 2,
          "unit": "piece"
        }
      ],
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction"
      ]
    }
  ]
}

Return valid JSON ONLY without any markdown wrappers or commentary.
`;

    const MAX_RETRIES = 2;
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(
                `Groq recipe generation request: model=${model}, attempt=${attempt + 1}`
            );

            const completion = await groq.chat.completions.create({
                model,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_completion_tokens: 3500,
                response_format: {
                    type: "json_object"
                }
            });

            const rawText = completion.choices?.[0]?.message?.content;
            if (!rawText) {
                throw new Error("Groq returned an empty response.");
            }

            const parsed = JSON.parse(rawText);
            const cleanedRecipes = validateAndCleanRecipes(parsed);

            if (!cleanedRecipes) {
                throw new Error("Groq returned invalid recipe data structure.");
            }

            console.log(`Groq generated ${cleanedRecipes.length} valid recipes.`);
            return cleanedRecipes;

        } catch (error) {
            lastError = error;
            const status = error.status || error.statusCode;
            const retryable =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504;

            if (!retryable || attempt === MAX_RETRIES) {
                break;
            }

            const delay = 1000 * (2 ** attempt);
            console.warn(
                `Groq recipe generation failed (${status || "error"}). Retrying in ${delay / 1000}s.`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    console.error("Groq Recipe Generation Error:", lastError?.message || lastError);
    throw lastError || new Error("Failed to generate recipes from Groq AI.");
};

/**
 * Calculate match metrics deterministically for each recipe against user's pantry.
 */
const calculateRecipeMatches = (recipes, pantryItems) => {
    return recipes.map((recipe, index) => {
        const matchedIngredients = [];
        const missingIngredients = [];
        const insufficientIngredients = [];

        recipe.ingredients.forEach((recipeIngredient) => {
            const pantryItem = pantryItems.find((item) =>
                isIngredientMatch(item.name, recipeIngredient.name)
            );

            if (!pantryItem) {
                missingIngredients.push({
                    name: recipeIngredient.name,
                    requiredQuantity: recipeIngredient.quantity,
                    unit: recipeIngredient.unit
                });
            } else if (pantryItem.quantity >= recipeIngredient.quantity) {
                matchedIngredients.push(recipeIngredient.name);
            } else {
                const missingQuantity =
                    recipeIngredient.quantity - pantryItem.quantity;
                insufficientIngredients.push({
                    name: recipeIngredient.name,
                    availableQuantity: pantryItem.quantity,
                    requiredQuantity: recipeIngredient.quantity,
                    missingQuantity,
                    unit: recipeIngredient.unit
                });
            }
        });

        const totalIngredients = recipe.ingredients.length;
        const fullyMatched = matchedIngredients.length;
        const matchPercentage =
            totalIngredients > 0
                ? Math.round((fullyMatched / totalIngredients) * 100)
                : 0;

        const recipeId = `ai-recipe-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`;

        return {
            matchPercentage,
            matchedIngredients,
            missingIngredients,
            insufficientIngredients,
            recipe: {
                _id: recipeId,
                name: recipe.name,
                description: recipe.description,
                cookingTime: recipe.cookingTime,
                difficulty: recipe.difficulty,
                cuisine: recipe.cuisine,
                ingredients: recipe.ingredients.map((ing, idx) => ({
                    _id: `ing-${recipeId}-${idx}`,
                    name: ing.name,
                    quantity: ing.quantity,
                    unit: ing.unit
                })),
                instructions: recipe.instructions
            }
        };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

module.exports = {
    generateRecipesWithGroq,
    calculateRecipeMatches,
    normalizeIngredientName
};