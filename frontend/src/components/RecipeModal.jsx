import RecipeIngredients from "./RecipeIngredients";

function RecipeModal({ recipe, onClose }) {
    if (!recipe) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div
                className="recipe-modal"
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close recipe"
                >
                    ×
                </button>

                <div className="recipe-modal-header">

                    <h2>{recipe.name}</h2>

                    <p>
                        {recipe.description}
                    </p>

                </div>

                <div className="recipe-meta">

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

                <RecipeIngredients
                    ingredients={recipe.ingredients}
                />

                <div className="recipe-instructions">

                    <h3>Cooking Instructions</h3>

                    <ol>
                        {recipe.instructions.map(
                            (instruction, index) => (
                                <li key={index}>
                                    {instruction}
                                </li>
                            )
                        )}
                    </ol>

                </div>

                <button
                    className="modal-close-button"
                    onClick={onClose}
                >
                    Close
                </button>

            </div>

        </div>
    );
}

export default RecipeModal;