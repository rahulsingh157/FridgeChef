const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const PantryItem = require("../models/PantryItem");
const {
    generateRecipesWithGroq,
    calculateRecipeMatches
} = require("../services/recipeService");

const router = express.Router();

router.get("/suggestions", authMiddleware, async (req, res) => {
    try {
        // Get all confirmed pantry items for authenticated user
        const pantryItems = await PantryItem.find({ userId: req.userId });

        if (!pantryItems || pantryItems.length === 0) {
            return res.status(200).json({
                success: true,
                availableIngredients: [],
                suggestions: [],
                message: "No pantry items found. Please add or scan ingredients first."
            });
        }

        // Generate recipes using Groq AI
        const rawRecipes = await generateRecipesWithGroq(pantryItems);

        // Compute match percentages deterministically
        const suggestions = calculateRecipeMatches(rawRecipes, pantryItems);

        return res.status(200).json({
            success: true,
            availableIngredients: pantryItems,
            suggestions
        });

    } catch (error) {
        console.error("Recipe suggestion error:", error?.message || error);

        return res.status(503).json({
            success: false,
            error: "AI_SERVICE_UNAVAILABLE",
            message: "AI meal suggestions are temporarily unavailable. Please try again."
        });
    }
});

module.exports = router;