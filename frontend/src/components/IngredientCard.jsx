function IngredientCard({ item, onUpdate, onRemove }) {
    const handleQuantityChange = (event) => {
        const quantity = Number(event.target.value);
        onUpdate(item._id, {
            quantity: quantity < 0 ? 0 : quantity
        });
    };

    const confidencePercent = item.confidence ? Math.round(item.confidence * 100) : 100;

    return (
        <div className="fc-ingredient-item-card">
            <div className="fc-ingredient-item-header">
                <span className="fc-ingredient-name">{item.name}</span>
                <button
                    className="fc-btn-remove-ing"
                    onClick={() => onRemove(item._id)}
                    title="Remove ingredient"
                    type="button"
                >
                    ×
                </button>
            </div>

            <div className="fc-ingredient-qty-row">
                <span className="fc-qty-label">Qty:</span>
                <input
                    type="number"
                    min="0"
                    className="fc-qty-input"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                />
                <span className="fc-qty-unit">{item.unit || "piece"}</span>
            </div>

            <span className="fc-confidence-badge">
                AI confidence: {confidencePercent}%
            </span>
        </div>
    );
}

export default IngredientCard;