function RecipeIngredients({ ingredients = [] }) {
    return (
        <div className="recipe-ingredients">
            <h3>Ingredients</h3>

            <ul>
                {ingredients.map((ingredient, index) => (
                    <li key={ingredient._id || ingredient.name || index}>
                        <span>✓</span>

                        {ingredient.quantity}{" "}
                        {ingredient.unit}{" "}
                        {ingredient.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecipeIngredients;