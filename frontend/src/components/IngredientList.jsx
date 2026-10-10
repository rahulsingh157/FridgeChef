import IngredientCard from "./IngredientCard";

function IngredientList({
    ingredients,
    onUpdate,
    onRemove,
    onAddIngredient,
    onConfirm
}) {
    return (
        <div className="fc-ingredients-wrapper">
            {ingredients.length === 0 ? (
                <div className="fc-ingredients-empty">
                    <p style={{ fontSize: "1.2rem", marginBottom: "6px" }}>🧊 No ingredients detected yet</p>
                    <p>Upload a photo of your fridge or add your ingredients manually below.</p>
                </div>
            ) : (
                <div className="fc-ingredients-list-grid">
                    {ingredients.map((item) => (
                        <IngredientCard
                            key={item._id}
                            item={item}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            )}

            <div className="fc-ingredients-actions-row">
                <button
                    className="fc-btn-add-manual"
                    onClick={onAddIngredient}
                    type="button"
                >
                    + Add Manually
                </button>

                <button
                    className="fc-btn-confirm-ing"
                    onClick={onConfirm}
                    disabled={ingredients.length === 0}
                    type="button"
                >
                    ✓ Confirm Ingredients →
                </button>
            </div>
        </div>
    );
}

export default IngredientList;