import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FridgeUpload from "../components/FridgeUpload";
import IngredientList from "../components/IngredientList";
import AddIngredient from "../components/AddIngredient";
import DashboardLayout from "../components/DashboardLayout";

import heroFridgeImg from "../assets/hero_fridge.jpg";
import recipePastaImg from "../assets/recipe_pasta.jpg";
import recipeStirFryImg from "../assets/recipe_stir_fry.jpg";

function Home({
    user,
    onLogout,
    onAnalysisComplete,
    resetTrigger,
    ingredients = [],
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

    const handleAnalysisComplete = async (image) => {
        if (!user) {
            navigate("/login");
            return;
        }
        await onAnalysisComplete(image);
    };

    const handleConfirmPantry = async () => {
        if (onConfirm) {
            await onConfirm();
        }
        navigate("/meals");
    };

    const scrollToUpload = () => {
        const uploadElement = document.getElementById("scan-upload");
        if (uploadElement) {
            uploadElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // ==================================================
    // AUTHENTICATED DASHBOARD VIEW
    // ==================================================
    if (user) {
        const userName = user.name || "Chef";

        return (
            <DashboardLayout user={user} onLogout={onLogout}>
                {/* Welcome Row */}
                <div className="fc-welcome-row">
                    <div>
                        <h1 className="fc-welcome-title">Hello, {userName}! 👋</h1>
                        <p className="fc-welcome-sub">
                            Scan your fridge and let AI help you turn your ingredients into delicious meals.
                        </p>
                    </div>

                    <div className="fc-welcome-card-promo">
                        <span className="fc-welcome-promo-icon">🌱</span>
                        <div className="fc-welcome-promo-text">
                            Less Food Waste,<br />
                            More Great Meals.
                        </div>
                    </div>
                </div>

                {/* Main Two-Column Grid */}
                <div className="fc-dashboard-grid">
                    {/* Left Card: Scan Your Fridge */}
                    <div className="fc-card">
                        <div className="fc-card-header">
                            <div>
                                <h2 className="fc-card-title">
                                    <span>📷</span>
                                    <span>Scan Your Fridge</span>
                                </h2>
                                <p className="fc-card-subtitle">
                                    Upload a photo or take a picture to detect ingredients
                                </p>
                            </div>
                        </div>

                        <FridgeUpload
                            onAnalysisComplete={handleAnalysisComplete}
                            resetTrigger={resetTrigger}
                        />
                    </div>

                    {/* Right Card: Detected Ingredients */}
                    <div className="fc-card">
                        <div className="fc-card-header">
                            <div>
                                <h2 className="fc-card-title">
                                    <span>🌿</span>
                                    <span>Detected Ingredients</span>
                                </h2>
                                <p className="fc-card-subtitle">
                                    Verify items detected from your fridge scan
                                </p>
                            </div>

                            <span className="fc-count-badge">
                                {ingredients.length} items found
                            </span>
                        </div>

                        <IngredientList
                            ingredients={ingredients}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                            onAddIngredient={onOpenAddIngredient}
                            onConfirm={handleConfirmPantry}
                        />
                    </div>
                </div>

                {/* Bottom Row (Ready to Cook + Impact) */}
                <div className="fc-bottom-grid">
                    {/* Ready to Cook Card */}
                    <div className="fc-ready-cook-card">
                        <div>
                            <h3 className="fc-ready-cook-title">Ready to Cook?</h3>
                            <p className="fc-ready-cook-desc">
                                Get personalized meal suggestions based on your available ingredients.
                            </p>
                        </div>
                        <button
                            className="fc-btn-cook"
                            onClick={() => navigate("/meals")}
                        >
                            Get Meal Suggestions →
                        </button>
                    </div>

                    {/* Impact Card */}
                    <div className="fc-impact-card">
                        <div className="fc-card-title">
                            <span>🌿</span>
                            <span>Your Impact</span>
                        </div>
                        <div className="fc-impact-metrics">
                            <div className="fc-impact-metric-row">
                                <span className="fc-impact-label">Food waste avoided</span>
                                <span className="fc-impact-value">—</span>
                            </div>
                            <div className="fc-impact-metric-row">
                                <span className="fc-impact-label">Meals cooked</span>
                                <span className="fc-impact-value">—</span>
                            </div>
                            <div className="fc-impact-metric-row">
                                <span className="fc-impact-label">Ingredients used</span>
                                <span className="fc-impact-value">{ingredients.length} items</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Ingredient Modal */}
                {showAddIngredient && (
                    <AddIngredient
                        onAdd={onAddIngredient}
                        onClose={onCloseAddIngredient}
                    />
                )}
            </DashboardLayout>
        );
    }

    // ==================================================
    // LANDING PAGE FOR LOGGED-OUT VISITORS
    // ==================================================
    return (
        <div className="fc-app-container">
            <Header user={user} onLogout={onLogout} />

            <main>
                {/* HERO SECTION */}
                <section className="fc-section fc-hero-section">
                    <div className="fc-container">
                        <div className="fc-hero-grid">
                            <div className="fc-hero-content">
                                <div className="fc-badge">
                                    <span className="fc-badge-icon">🌿</span>
                                    <span>Turn your ingredients into delicious meals</span>
                                </div>

                                <h1 className="fc-hero-title">
                                    Good Food <br />
                                    <span className="fc-text-green">Starts at Home</span>
                                </h1>

                                <p className="fc-hero-subtitle">
                                    Scan your fridge, get AI-powered meal suggestions, reduce food waste, and make cooking easier than ever.
                                </p>

                                <div className="fc-hero-actions">
                                    <button
                                        className="fc-btn fc-btn-primary"
                                        onClick={scrollToUpload}
                                    >
                                        <span>Scan Your Fridge</span>
                                        <span>📷</span>
                                    </button>

                                    <button
                                        className="fc-btn fc-btn-secondary"
                                        onClick={() => scrollToSection("how-it-works")}
                                    >
                                        Learn More →
                                    </button>
                                </div>

                                <div className="fc-stats-row">
                                    <div className="fc-stat-item">
                                        <span className="fc-stat-number">10K+</span>
                                        <span className="fc-stat-label">Meals Suggested</span>
                                    </div>
                                    <div className="fc-stat-item">
                                        <span className="fc-stat-number">30%</span>
                                        <span className="fc-stat-label">Less Food Waste</span>
                                    </div>
                                    <div className="fc-stat-item">
                                        <span className="fc-stat-number">Happy</span>
                                        <span className="fc-stat-label">Home Cooks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="fc-hero-visual-wrapper">
                                <div className="fc-hero-card-frame">
                                    <div className="fc-floating-card fc-float-top-left">
                                        <div className="fc-float-icon">📸</div>
                                        <div>
                                            <div className="fc-float-text-bold">Scan your fridge</div>
                                            <div className="fc-float-text-sub">Upload a photo</div>
                                        </div>
                                    </div>

                                    <div className="fc-floating-card fc-float-bottom-right">
                                        <div className="fc-float-text-bold">AI Suggests ✨</div>
                                        <div className="fc-float-pills">
                                            <span className="fc-mini-pill">Vegetable Pasta</span>
                                            <span className="fc-mini-pill">Paneer Stir Fry</span>
                                            <span className="fc-mini-pill">Tomato Soup</span>
                                        </div>
                                    </div>

                                    <div className="fc-fridge-image-container">
                                        <img
                                            src={heroFridgeImg}
                                            alt="Organized Fresh Refrigerator"
                                            className="fc-fridge-img"
                                        />
                                    </div>

                                    <div id="scan-upload" className="fc-upload-area">
                                        <FridgeUpload
                                            onAnalysisComplete={handleAnalysisComplete}
                                            resetTrigger={resetTrigger}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="features" className="fc-benefits-strip">
                            <div className="fc-benefit-item">
                                <div className="fc-benefit-icon">🥗</div>
                                <div>
                                    <h4 className="fc-benefit-title">Use What You Have</h4>
                                    <p className="fc-benefit-desc">Turn ingredients into tasty meals</p>
                                </div>
                            </div>

                            <div className="fc-benefit-item">
                                <div className="fc-benefit-icon">♻️</div>
                                <div>
                                    <h4 className="fc-benefit-title">Reduce Food Waste</h4>
                                    <p className="fc-benefit-desc">Good for you, good for the planet</p>
                                </div>
                            </div>

                            <div className="fc-benefit-item">
                                <div className="fc-benefit-icon">⚡</div>
                                <div>
                                    <h4 className="fc-benefit-title">Save Time</h4>
                                    <p className="fc-benefit-desc">Get quick & easy meal ideas</p>
                                </div>
                            </div>

                            <div className="fc-benefit-item">
                                <div className="fc-benefit-icon">🍎</div>
                                <div>
                                    <h4 className="fc-benefit-title">Eat Healthier</h4>
                                    <p className="fc-benefit-desc">Nutritious meals, smarter choices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how-it-works" className="fc-section">
                    <div className="fc-container">
                        <div className="fc-section-header">
                            <div className="fc-badge">
                                <span>Simple 4-Step Process</span>
                            </div>
                            <h2 className="fc-section-title">How It Works</h2>
                            <p className="fc-section-subtitle">
                                From your fridge to a delicious meal in just a few steps
                            </p>
                        </div>

                        <div className="fc-how-it-works-grid">
                            <div className="fc-step-card">
                                <div className="fc-step-number">1</div>
                                <div className="fc-step-icon-box">📷</div>
                                <h3 className="fc-step-title">Scan</h3>
                                <p className="fc-step-desc">
                                    Upload a photo of your fridge or add ingredients manually.
                                </p>
                                <span className="fc-step-arrow">➔</span>
                            </div>

                            <div className="fc-step-card">
                                <div className="fc-step-number">2</div>
                                <div className="fc-step-icon-box">🤖</div>
                                <h3 className="fc-step-title">Analyze</h3>
                                <p className="fc-step-desc">
                                    AI detects ingredients and finds the best recipe matches.
                                </p>
                                <span className="fc-step-arrow">➔</span>
                            </div>

                            <div className="fc-step-card">
                                <div className="fc-step-number">3</div>
                                <div className="fc-step-icon-box">💡</div>
                                <h3 className="fc-step-title">Get Suggestions</h3>
                                <p className="fc-step-desc">
                                    Receive personalized meal ideas tailored to what you have.
                                </p>
                                <span className="fc-step-arrow">➔</span>
                            </div>

                            <div className="fc-step-card">
                                <div className="fc-step-number">4</div>
                                <div className="fc-step-icon-box">🍳</div>
                                <h3 className="fc-step-title">Cook & Enjoy</h3>
                                <p className="fc-step-desc">
                                    Follow simple step-by-step recipes and enjoy delicious meals.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MEALS PREVIEW SECTION */}
                <section id="recipes" className="fc-section" style={{ backgroundColor: "var(--bg-surface)" }}>
                    <div className="fc-container">
                        <div className="fc-section-header">
                            <div className="fc-badge">
                                <span>Chef Curated & AI Matched</span>
                            </div>
                            <h2 className="fc-section-title">Meals You Can Make</h2>
                            <p className="fc-section-subtitle">
                                FridgeChef finds delicious recipes based on your available ingredients.
                            </p>
                        </div>

                        <div className="fc-meals-grid">
                            <div className="fc-recipe-card">
                                <div className="fc-recipe-img-box">
                                    <img src={recipePastaImg} alt="Vegetable Pasta" className="fc-recipe-img" />
                                    <span className="fc-recipe-match-badge">98% Match</span>
                                </div>
                                <div className="fc-recipe-content">
                                    <div className="fc-recipe-meta">
                                        <span className="fc-recipe-tag">Italian</span>
                                        <span>⏱️ 20 mins</span>
                                    </div>
                                    <h3 className="fc-recipe-title">Vegetable Pasta</h3>
                                    <p className="fc-recipe-desc">
                                        Savory tender pasta tossed with cherry tomatoes, roasted garlic, fresh basil, and virgin olive oil.
                                    </p>
                                    <div className="fc-recipe-footer">
                                        <span className="fc-recipe-ingredients-count">6 Ingredients</span>
                                        <span className="fc-recipe-view-btn">View Recipe →</span>
                                    </div>
                                </div>
                            </div>

                            <div className="fc-recipe-card">
                                <div className="fc-recipe-img-box">
                                    <img src={recipeStirFryImg} alt="Paneer Stir Fry" className="fc-recipe-img" />
                                    <span className="fc-recipe-match-badge">94% Match</span>
                                </div>
                                <div className="fc-recipe-content">
                                    <div className="fc-recipe-meta">
                                        <span className="fc-recipe-tag">High Protein</span>
                                        <span>⏱️ 15 mins</span>
                                    </div>
                                    <h3 className="fc-recipe-title">Paneer Stir Fry</h3>
                                    <p className="fc-recipe-desc">
                                        Crispy paneer cubes sautéed with colorful bell peppers, crunchy broccoli, and savory soy seasoning.
                                    </p>
                                    <div className="fc-recipe-footer">
                                        <span className="fc-recipe-ingredients-count">5 Ingredients</span>
                                        <span className="fc-recipe-view-btn">View Recipe →</span>
                                    </div>
                                </div>
                            </div>

                            <div className="fc-recipe-card">
                                <div className="fc-recipe-img-box">
                                    <img src={recipePastaImg} alt="Tomato Soup" className="fc-recipe-img" style={{ filter: "hue-rotate(-30deg) saturate(1.2)" }} />
                                    <span className="fc-recipe-match-badge">90% Match</span>
                                </div>
                                <div className="fc-recipe-content">
                                    <div className="fc-recipe-meta">
                                        <span className="fc-recipe-tag">Comfort Food</span>
                                        <span>⏱️ 25 mins</span>
                                    </div>
                                    <h3 className="fc-recipe-title">Tomato Basil Soup</h3>
                                    <p className="fc-recipe-desc">
                                        Rich and velvety roasted tomato soup infused with herbs, perfect paired with crunchy grilled toast.
                                    </p>
                                    <div className="fc-recipe-footer">
                                        <span className="fc-recipe-ingredients-count">4 Ingredients</span>
                                        <span className="fc-recipe-view-btn">View Recipe →</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA SECTION */}
                <section id="about" className="fc-section">
                    <div className="fc-container">
                        <div className="fc-cta-card">
                            <h2 className="fc-cta-title">Ready to Cook Smarter?</h2>
                            <p className="fc-cta-subtitle">
                                Turn what's already in your fridge into something delicious today.
                            </p>
                            <button className="fc-btn fc-btn-primary" onClick={scrollToUpload}>
                                <span>Scan Your Fridge</span>
                                <span>🚀</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fc-footer">
                <div className="fc-container">
                    <div className="fc-footer-grid">
                        <div>
                            <div className="fc-header-brand">
                                <div className="fc-brand-icon-wrapper">🥕</div>
                                <div className="fc-brand-text">
                                    <span className="fc-brand-title">FridgeChef</span>
                                    <span className="fc-brand-subtitle">AI Fridge Meal Planner</span>
                                </div>
                            </div>
                            <p className="fc-footer-brand-desc">
                                Reduce food waste and discover amazing recipes using ingredients you already have in your kitchen.
                            </p>
                        </div>

                        <div>
                            <h4 className="fc-footer-heading">Navigation</h4>
                            <ul className="fc-footer-links">
                                <li><a href="#" className="fc-footer-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
                                <li><a href="#features" className="fc-footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                                <li><a href="#how-it-works" className="fc-footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a></li>
                                <li><a href="#recipes" className="fc-footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('recipes'); }}>Recipes</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="fc-footer-heading">App</h4>
                            <ul className="fc-footer-links">
                                <li><button className="fc-footer-link" onClick={() => navigate('/login')}>Login</button></li>
                                <li><button className="fc-footer-link" onClick={() => navigate('/register')}>Register</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="fc-footer-heading">About</h4>
                            <ul className="fc-footer-links">
                                <li><span className="fc-footer-link">Privacy Policy</span></li>
                                <li><span className="fc-footer-link">Terms of Service</span></li>
                                <li><span className="fc-footer-link">Contact Us</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="fc-footer-bottom">
                        <p>© 2026 FridgeChef. AI Fridge Meal Planner. All rights reserved.</p>
                        <p>Built for smart & sustainable home cooking.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;