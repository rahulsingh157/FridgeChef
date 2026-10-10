import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ user, onLogout }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("fc-theme") || "light";
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("fc-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const handleNavClick = (anchorId) => {
        setMobileMenuOpen(false);
        if (location.pathname !== "/") {
            navigate("/#" + anchorId);
            setTimeout(() => {
                const element = document.getElementById(anchorId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            const element = document.getElementById(anchorId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <header className="fc-header">
            <div className="fc-container fc-header-container">
                {/* Brand Logo */}
                <Link to="/" className="fc-header-brand">
                    <div className="fc-brand-icon-wrapper">
                        🥕
                    </div>
                    <div className="fc-brand-text">
                        <span className="fc-brand-title">FridgeChef</span>
                        <span className="fc-brand-subtitle">AI Fridge Meal Planner</span>
                    </div>
                </Link>

                {/* Center Navigation Links */}
                <nav className={`fc-header-nav ${mobileMenuOpen ? "fc-mobile-active" : ""}`}>
                    <Link
                        to="/"
                        className={`fc-nav-link ${location.pathname === "/" ? "active" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <a
                        href="#features"
                        className="fc-nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("features");
                        }}
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="fc-nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("how-it-works");
                        }}
                    >
                        How It Works
                    </a>
                    <a
                        href="#recipes"
                        className="fc-nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("recipes");
                        }}
                    >
                        Recipes
                    </a>
                    <a
                        href="#about"
                        className="fc-nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("about");
                        }}
                    >
                        About
                    </a>
                    {user && (
                        <>
                            <Link
                                to="/pantry"
                                className={`fc-nav-link ${location.pathname === "/pantry" ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pantry
                            </Link>
                            <Link
                                to="/meals"
                                className={`fc-nav-link ${location.pathname === "/meals" ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Meals
                            </Link>
                            <Link
                                to="/shopping-list"
                                className={`fc-nav-link ${location.pathname === "/shopping-list" ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shopping List
                            </Link>
                        </>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="fc-header-actions">
                    <button
                        className="fc-theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {user ? (
                        <div className="fc-user-info-badge">
                            <span className="fc-user-greeting">
                                Hi, {user.name ? user.name.split(' ')[0] : 'Chef'} 👋
                            </span>
                            <button
                                className="fc-btn-logout"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="fc-btn-nav-login">
                                Login
                            </Link>
                            <Link to="/register" className="fc-btn fc-btn-primary fc-btn-nav-start">
                                Get Started
                            </Link>
                        </>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="fc-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;