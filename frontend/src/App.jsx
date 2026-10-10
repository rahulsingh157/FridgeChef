import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Pantry from "./pages/Pantry";
import Meals from "./pages/Meals";
import ShoppingListPage from "./pages/ShoppingListPage";
import Toast from "./components/Toast";
import {
    scanFridge,
    getMealSuggestions,
    confirmPantry,
    getPantry
} from "./services/api";

import "./App.css";
import "./styles/index.js";

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [resetUpload, setResetUpload] = useState(0);

    const [ingredients, setIngredients] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!user) {
            setShoppingList([]);
            setIngredients([]);
            setIngredientsConfirmed(false);
            return;
        }

        const storageKey = `fridgeShoppingList_${user.id}`;
        const savedList = localStorage.getItem(storageKey);
        const loadedList = savedList ? JSON.parse(savedList) : [];

        console.log("LOADED SHOPPING LIST:", loadedList);
        setShoppingList(loadedList);

        // Fetch confirmed pantry from database for logged in user
        const fetchUserPantry = async () => {
            try {
                const data = await getPantry();
                if (data.success && Array.isArray(data.items)) {
                    setIngredients(data.items);
                    if (data.items.length > 0) {
                        setIngredientsConfirmed(true);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user pantry on app load:", err);
            }
        };

        fetchUserPantry();
    }, [user]);

    const [mealsLoading, setMealsLoading] = useState(false);
    const [mealsError, setMealsError] = useState(null);
    const [showAddIngredient, setShowAddIngredient] = useState(false);
    const [ingredientsConfirmed, setIngredientsConfirmed] = useState(false);

    const handleFridgeAnalysis = async (image) => {
        const data = await scanFridge(image);
        setIngredients(data.detectedItems);
        setSuggestions([]);
        setMealsError(null);
        setIngredientsConfirmed(false);
    };

    const handleUpdateIngredient = (id, updates) => {
        setIngredients((currentIngredients) =>
            currentIngredients.map((item) =>
                item._id === id ? { ...item, ...updates } : item
            )
        );
        setIngredientsConfirmed(false);
    };

    const handleRemoveIngredient = (id) => {
        setIngredients((currentIngredients) =>
            currentIngredients.filter((item) => item._id !== id)
        );
        setIngredientsConfirmed(false);
    };

    const handleAddIngredient = (newIngredient) => {
        const ingredient = {
            ...newIngredient,
            _id: `manual-${Date.now()}`
        };

        setIngredients((currentIngredients) => [
            ...currentIngredients,
            ingredient
        ]);
        setShowAddIngredient(false);
        setIngredientsConfirmed(false);
    };

    const handleConfirmIngredients = async () => {
        try {
            await confirmPantry(ingredients);
            setIngredientsConfirmed(true);
            setSuggestions([]);
            setMealsError(null);
            console.log("Pantry confirmed successfully:", ingredients);
        } catch (error) {
            console.error("Failed to confirm ingredients:", error);
            alert("Failed to save ingredients. Please try again.");
        }
    };

    const handleFindMeals = async () => {
        if (!ingredientsConfirmed) {
            return;
        }

        try {
            setMealsLoading(true);
            setMealsError(null);
            const data = await getMealSuggestions();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error("Failed to get meal suggestions:", error);
            setMealsError(
                error.message || "AI meal suggestions are temporarily unavailable. Please try again."
            );
            setSuggestions([]);
        } finally {
            setMealsLoading(false);
        }
    };

    const handleScanAgain = () => {
        setIngredients([]);
        setSuggestions([]);
        setMealsError(null);
        setIngredientsConfirmed(false);
        setShowAddIngredient(false);
        setResetUpload((prev) => prev + 1);
    };

    const handleAddToShoppingList = (items, recipeId) => {
        setShoppingList((currentList) => {
            const updatedList = [...currentList];

            items.forEach((item) => {
                const existingItem = updatedList.find(
                    (existing) =>
                        existing.name.toLowerCase() === item.name.toLowerCase() &&
                        existing.unit === item.unit
                );

                if (existingItem) {
                    if (existingItem.recipeIds?.includes(recipeId)) {
                        return;
                    }
                    existingItem.quantity += Number(item.quantity);
                    existingItem.recipeIds = [
                        ...(existingItem.recipeIds || []),
                        recipeId
                    ];
                } else {
                    updatedList.push({
                        name: item.name,
                        quantity: Number(item.quantity),
                        unit: item.unit,
                        checked: false,
                        recipeIds: [recipeId]
                    });
                }
            });

            if (user) {
                const storageKey = `fridgeShoppingList_${user.id}`;
                localStorage.setItem(storageKey, JSON.stringify(updatedList));
                console.log("SHOPPING LIST SAVED:", updatedList);
            }

            return updatedList;
        });

        // Trigger success toast notification
        if (items && items.length > 0) {
            if (items.length === 1) {
                const single = items[0];
                setToast({
                    title: "Added to shopping list!",
                    subtitle: `${single.name} • ${single.quantity} ${single.unit || ''}`.trim()
                });
            } else {
                const names = items.map((i) => i.name).join(", ");
                setToast({
                    title: "Added to shopping list!",
                    subtitle: names.length > 35 ? `${items.length} ingredients added` : names
                });
            }
        }
    };

    const handleToggleShoppingItem = (index) => {
        setShoppingList((currentList) =>
            currentList.map((item, itemIndex) =>
                itemIndex === index ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleRemoveShoppingItem = (index) => {
        setShoppingList((currentList) =>
            currentList.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const handleClearShoppingList = () => {
        setShoppingList([]);
    };

    const handleLogin = (userData) => {
        setIngredients([]);
        setSuggestions([]);
        setMealsError(null);
        setIngredientsConfirmed(false);
        setUser(userData);
    };

    const handleRegister = (userData) => {
        setIngredients([]);
        setSuggestions([]);
        setMealsError(null);
        setIngredientsConfirmed(false);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIngredients([]);
        setSuggestions([]);
        setMealsError(null);
        setShoppingList([]);
        setIngredientsConfirmed(false);
        setUser(null);
    };

    return (
        <>
            <Toast toast={toast} onClose={() => setToast(null)} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            user={user}
                            onLogout={handleLogout}
                            onAnalysisComplete={handleFridgeAnalysis}
                            resetTrigger={resetUpload}
                            ingredients={ingredients}
                            onUpdate={handleUpdateIngredient}
                            onRemove={handleRemoveIngredient}
                            onOpenAddIngredient={() => setShowAddIngredient(true)}
                            onAddIngredient={handleAddIngredient}
                            onConfirm={handleConfirmIngredients}
                            ingredientsConfirmed={ingredientsConfirmed}
                            showAddIngredient={showAddIngredient}
                            onCloseAddIngredient={() => setShowAddIngredient(false)}
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        !user ? (
                            <Login onLogin={handleLogin} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                <Route
                    path="/register"
                    element={
                        !user ? (
                            <Register onRegister={handleRegister} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                <Route
                    path="/pantry"
                    element={
                        user ? (
                            <Pantry
                                user={user}
                                onLogout={handleLogout}
                                ingredients={ingredients}
                                onUpdate={handleUpdateIngredient}
                                onRemove={handleRemoveIngredient}
                                onOpenAddIngredient={() => setShowAddIngredient(true)}
                                onAddIngredient={handleAddIngredient}
                                onConfirm={handleConfirmIngredients}
                                ingredientsConfirmed={ingredientsConfirmed}
                                showAddIngredient={showAddIngredient}
                                onCloseAddIngredient={() => setShowAddIngredient(false)}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/meals"
                    element={
                        user ? (
                            <Meals
                                user={user}
                                onLogout={handleLogout}
                                suggestions={suggestions}
                                loading={mealsLoading}
                                error={mealsError}
                                onFindMeals={handleFindMeals}
                                onScanAgain={handleScanAgain}
                                disabled={!ingredientsConfirmed}
                                onAddToShoppingList={handleAddToShoppingList}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/shopping-list"
                    element={
                        user ? (
                            <ShoppingListPage
                                user={user}
                                onLogout={handleLogout}
                                shoppingList={shoppingList}
                                onToggleItem={handleToggleShoppingItem}
                                onRemoveItem={handleRemoveShoppingItem}
                                onClearList={handleClearShoppingList}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}