import { useState } from "react";
import RecipeModal from "./RecipeModal";

function MealCard({ suggestion, onAddToShoppingList }) {

    const {
        recipe,
        matchedIngredients,
        missingIngredients,
        insufficientIngredients,
        matchPercentage
    } = suggestion;

    const [showRecipe, setShowRecipe] = useState(false);

    const shoppingItems = [
        ...(missingIngredients || []).map((item) => ({
            name: item.name,
            quantity: item.requiredQuantity,
            unit: item.unit
        })),

        ...(insufficientIngredients || []).map((item) => ({
            name: item.name,
            quantity: item.missingQuantity,
            unit: item.unit
        }))
    ];

    return (
        <>
            <div className="meal-card">

                <div className="meal-card-header">

                    <h3>{recipe.name}</h3>

                    <span
                        className={
                            matchPercentage === 100
                                ? "match-badge perfect"
                                : "match-badge"
                        }
                    >
                        {matchPercentage}% Match
                    </span>

                </div>

                <p className="meal-description">
                    {recipe.description}
                </p>

                <div className="meal-info">

                    <span>
                        ⏱ {recipe.cookingTime} min
                    </span>

                    <span>
                        📊 {recipe.difficulty}
                    </span>

                    <span>
                        🌍 {recipe.cuisine}
                    </span>

                </div>

                <div className="meal-ingredients">
                        
                    <strong>You have:</strong>

                    <p>
                        {matchedIngredients.join(", ")}
                    </p>

                </div>

                {missingIngredients && missingIngredients.length > 0 && (
                    <div className="missing-ingredients">

                        <strong>🛒 Missing:</strong>

                        {missingIngredients.map((item) => (
                            <p key={item.name}>
                                {item.name}: {item.requiredQuantity} {item.unit}
                            </p>
                        ))}

                    </div>
                )}

                {insufficientIngredients &&
                    insufficientIngredients.length > 0 && (

                    <div className="insufficient-ingredients">

                        <strong>Need more:</strong>

                        {insufficientIngredients.map((item) => (

                            <p key={item.name}>

                                ⚠️ {item.name}:{" "}
                                {item.missingQuantity}{" "}
                                {item.unit} more

                            </p>

                        ))}

                    </div>
                )}

                {shoppingItems.length > 0 && (
                    <button
                        className="shopping-button"
                        onClick={() => {
                            console.log("SHOPPING BUTTON CLICKED");
                            console.log("SHOPPING ITEMS:", shoppingItems);
                            console.log("RECIPE ID:", recipe._id);

                            onAddToShoppingList(
                                shoppingItems,
                                recipe._id
                            );
                        }}
                    >
                        🛒 Add Missing Ingredients
                    </button>
                )}

                <button
                    className="recipe-button"
                    onClick={() => setShowRecipe(true)}
                >
                    View Recipe
                </button>

            </div>

            {showRecipe && (
                <RecipeModal
                    recipe={recipe}
                    onClose={() => setShowRecipe(false)}
                />
            )}
        </>
    );
}

export default MealCard;