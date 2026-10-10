import { useNavigate } from "react-router-dom";
import IngredientList from "../components/IngredientList";
import AddIngredient from "../components/AddIngredient";
import DashboardLayout from "../components/DashboardLayout";

function Pantry({
    user,
    onLogout,
    ingredients,
    onUpdate,
    onRemove,
    onOpenAddIngredient,
    onAddIngredient,
    onConfirm,
    ingredientsConfirmed,
    showAddIngredient,
    onCloseAddIngredient
}) {
    const navigate = useNavigate();

    const handleConfirm = async () => {
        await onConfirm();
        navigate("/meals");
    };

    return (
        <DashboardLayout user={user} onLogout={onLogout}>
            <div className="fc-card" style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div className="fc-card-header">
                    <div>
                        <h2 className="fc-card-title">
                            <span>🧊</span>
                            <span>My Pantry</span>
                        </h2>
                        <p className="fc-card-subtitle">
                            Verify and manage your ingredients before generating recipes
                        </p>
                    </div>

                    <span className="fc-count-badge">
                        {ingredients.length} items
                    </span>
                </div>

                <IngredientList
                    ingredients={ingredients}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    onAddIngredient={onOpenAddIngredient}
                    onConfirm={handleConfirm}
                />

                {showAddIngredient && (
                    <AddIngredient
                        onAdd={onAddIngredient}
                        onClose={onCloseAddIngredient}
                    />
                )}

                {ingredientsConfirmed && (
                    <p
                        style={{
                            color: "var(--primary-green)",
                            textAlign: "center",
                            marginTop: "20px",
                            fontWeight: "700"
                        }}
                    >
                        ✓ Ingredients confirmed successfully!
                    </p>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Pantry;