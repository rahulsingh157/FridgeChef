import { useMemo, useState } from "react";
import MealCard from "./MealCard";

function MealSuggestions({
    suggestions = [],
    loading = false,
    error = null,
    onFindMeals,
    disabled = false,
    onScanAgain,
    onAddToShoppingList
}) {
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("match");

    const filteredSuggestions = useMemo(() => {
        let result = [...suggestions];

        // Filter
        if (filter === "ready") {
            result = result.filter(
                (item) => item.matchPercentage === 100
            );
        }

        if (filter === "easy") {
            result = result.filter(
                (item) => item.recipe?.difficulty === "Easy"
            );
        }

        // Sort
        if (sortBy === "match") {
            result.sort(
                (a, b) =>
                    b.matchPercentage - a.matchPercentage
            );
        }

        if (sortBy === "time") {
            result.sort(
                (a, b) =>
                    (a.recipe?.cookingTime || 0) -
                    (b.recipe?.cookingTime || 0)
            );
        }

        return result;
    }, [suggestions, filter, sortBy]);

    return (
        <section className="meals-section">

            <div className="meals-header">

                <div>
                    <h2>
                        What can you make today? 🍽️
                    </h2>

                    <p>
                        Recipes based on what's available
                        in your fridge.
                    </p>
                </div>

                <button
                    className="find-meals-button"
                    onClick={onFindMeals}
                    disabled={loading || disabled}
                >
                    {disabled
                        ? "Confirm Ingredients First"
                        : loading
                            ? "Finding meals..."
                            : "Find Meals"
                    }
                </button>

            </div>

            {/* Loading State */}
            {loading && (
                <div className="fc-meals-loading">
                    <div className="fc-spinner"></div>
                    <h3>Generating AI Recipe Suggestions...</h3>
                    <p>Analyzing your pantry ingredients with Groq AI to build fresh recipes</p>
                </div>
            )}

            {/* Error / AI Unavailability State */}
            {!loading && error && (
                <div className="fc-meals-error-card">
                    <div className="fc-meals-error-icon">⚠️</div>
                    <h3>AI Suggestions Temporarily Unavailable</h3>
                    <p>{error || "AI meal suggestions are temporarily unavailable. Please try again."}</p>
                    <button
                        className="find-meals-button retry-button"
                        onClick={onFindMeals}
                        disabled={loading || disabled}
                    >
                        {loading ? "Retrying..." : "🔄 Try Again"}
                    </button>
                </div>
            )}

            {/* Empty State when no suggestions and no error/loading */}
            {!loading && !error && suggestions.length === 0 && (
                <div className="no-recipes">
                    <div className="no-recipes-icon">🍳</div>
                    <h3>Ready to generate meal suggestions?</h3>
                    <p>
                        {disabled
                            ? "Please confirm your pantry ingredients first to get personalized recipe suggestions."
                            : "Click 'Find Meals' above to create fresh AI recipe suggestions from your pantry."}
                    </p>
                    {!disabled && (
                        <button
                            className="find-meals-button"
                            onClick={onFindMeals}
                        >
                            Find Meals
                        </button>
                    )}
                </div>
            )}

            {/* Suggestions Grid */}
            {!loading && !error && suggestions.length > 0 && (
                <>
                    {/* Filters */}
                    <div className="recipe-controls">

                        <div className="filter-buttons">

                            <button
                                className={
                                    filter === "all"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    setFilter("all")
                                }
                            >
                                All
                            </button>

                            <button
                                className={
                                    filter === "ready"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    setFilter("ready")
                                }
                            >
                                ✓ Ready to Cook
                            </button>

                            <button
                                className={
                                    filter === "easy"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    setFilter("easy")
                                }
                            >
                                Easy
                            </button>

                        </div>

                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="match">
                                Best Match
                            </option>

                            <option value="time">
                                Quickest First
                            </option>
                        </select>

                    </div>

                    {/* Recipe count */}
                    <p className="recipe-count">
                        Showing{" "}
                        {filteredSuggestions.length}{" "}
                        {filteredSuggestions.length === 1
                            ? "recipe"
                            : "recipes"}
                    </p>

                    {/* Recipe cards */}
                    {filteredSuggestions.length > 0 ? (
                        <div className="meals-grid">

                            {filteredSuggestions.map(
                                (suggestion) => (
                                    <MealCard
                                        key={
                                            suggestion.recipe._id
                                        }
                                        suggestion={suggestion}
                                        onAddToShoppingList={onAddToShoppingList}
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="no-recipes">
                            <div className="no-recipes-icon">
                                🍳
                            </div>

                            <h3>
                                No recipes match the selected filter
                            </h3>

                            <p>
                                Try another filter or check your available ingredients.
                            </p>

                            <button
                                onClick={() =>
                                    setFilter("all")
                                }
                            >
                                Show All Recipes
                            </button>
                        </div>
                    )}

                    {/* Scan Again */}
                    <div className="scan-again-container">

                        <button
                            className="scan-again-button"
                            onClick={onScanAgain}
                        >
                            🔄 Scan Another Fridge
                        </button>

                    </div>
                </>
            )}

        </section>
    );
}

export default MealSuggestions;