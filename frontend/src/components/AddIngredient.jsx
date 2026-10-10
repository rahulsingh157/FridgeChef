import { useState } from "react";

function AddIngredient({ onAdd, onClose }) {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState("piece");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        onAdd({
            name: name.trim(),
            quantity: Number(quantity),
            unit,
            confidence: 1
        });

        setName("");
        setQuantity(1);
        setUnit("piece");
    };

    return (
        <div
            className="add-ingredient-overlay"
            onClick={onClose}
        >

            <div
                className="add-ingredient-modal"
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>Add Ingredient</h2>

                <p>
                    Add anything the AI missed.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>
                        Ingredient
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Egg"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <label>
                        Quantity
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) =>
                            setQuantity(event.target.value)
                        }
                    />

                    <label>
                        Unit
                    </label>

                    <select
                        value={unit}
                        onChange={(event) =>
                            setUnit(event.target.value)
                        }
                    >
                        <option value="piece">
                            Piece
                        </option>

                        <option value="gram">
                            Gram
                        </option>

                        <option value="kg">
                            Kilogram
                        </option>

                        <option value="ml">
                            Milliliter
                        </option>

                        <option value="liter">
                            Liter
                        </option>

                        <option value="carton">
                            Carton
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="add-submit-button"
                    >
                        Add Ingredient
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddIngredient;