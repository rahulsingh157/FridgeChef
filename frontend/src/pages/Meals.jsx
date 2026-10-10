import MealSuggestions from "../components/MealSuggestions";
import DashboardLayout from "../components/DashboardLayout";

function Meals({
    user,
    onLogout,
    suggestions,
    loading,
    error,
    onFindMeals,
    onScanAgain,
    disabled,
    onAddToShoppingList
}) {
    return (
        <DashboardLayout user={user} onLogout={onLogout}>
            <div className="fc-meals-page-header">
                <h1 className="fc-meals-page-title">🍴 Meal Suggestions</h1>
                <p className="fc-meals-page-sub">
                    Personalized AI recipe recommendations matched to your pantry
                </p>
            </div>

            <MealSuggestions
                suggestions={suggestions}
                loading={loading}
                error={error}
                onFindMeals={onFindMeals}
                onScanAgain={onScanAgain}
                disabled={disabled}
                onAddToShoppingList={onAddToShoppingList}
            />
        </DashboardLayout>
    );
}

export default Meals;