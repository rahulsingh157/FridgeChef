function ShoppingList({ shoppingList, onToggleItem, onRemoveItem, onClearList }) {
    if (shoppingList.length === 0) {
        return (
            <div className="fc-shopping-empty">
                <div className="fc-shopping-empty-icon">🛒</div>
                <h3>Your Shopping List is Empty</h3>
                <p>Add missing ingredients from meal suggestions to build your shopping list.</p>
            </div>
        );
    }

    return (
        <section className="shopping-list-section">
            <div className="shopping-list-header">
                <div>
                    <h2>🛒 Shopping List</h2>
                    <p>
                        {shoppingList.length}{" "}
                        {shoppingList.length === 1 ? "item" : "items"} to buy
                    </p>
                </div>

                <button
                    className="clear-list-button"
                    onClick={onClearList}
                >
                    Clear List
                </button>
            </div>

            <div className="shopping-list">
                {shoppingList.map((item, index) => (
                    <div
                        className={
                            item.checked
                                ? "shopping-item checked"
                                : "shopping-item"
                        }
                        key={`${item.name}-${index}`}
                    >
                        <label className="shopping-item-left">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => onToggleItem(index)}
                            />
                            <span>
                                {item.name}
                            </span>
                        </label>

                        <div className="shopping-item-right">
                            <span className="shopping-quantity">
                                {item.quantity} {item.unit}
                            </span>

                            <button
                                className="remove-shopping-item"
                                onClick={() => onRemoveItem(index)}
                                title="Remove item"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ShoppingList;