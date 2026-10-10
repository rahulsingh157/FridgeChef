import ShoppingList from "../components/ShoppingList";
import DashboardLayout from "../components/DashboardLayout";

function ShoppingListPage({
    user,
    onLogout,
    shoppingList,
    onToggleItem,
    onRemoveItem,
    onClearList
}) {
    return (
        <DashboardLayout user={user} onLogout={onLogout}>
            <div className="fc-shopping-container">
                <ShoppingList
                    shoppingList={shoppingList}
                    onToggleItem={onToggleItem}
                    onRemoveItem={onRemoveItem}
                    onClearList={onClearList}
                />
            </div>
        </DashboardLayout>
    );
}

export default ShoppingListPage;