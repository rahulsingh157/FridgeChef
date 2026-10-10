import { Link, useLocation } from "react-router-dom";

function Sidebar({ mobileOpen, onCloseMobile }) {
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", icon: "🏠", path: "/", active: location.pathname === "/" },
        { label: "My Fridge", icon: "🧊", path: "/pantry", active: location.pathname === "/pantry" },
        { label: "Meal Suggestions", icon: "🍴", path: "/meals", active: location.pathname === "/meals" },
        { label: "Recipes", icon: "📖", path: "#", active: false },
        { label: "Shopping List", icon: "🛒", path: "/shopping-list", active: location.pathname === "/shopping-list" },
        { label: "Saved Recipes", icon: "♡", path: "#", active: false },
        { label: "Profile", icon: "👤", path: "#", active: false },
        { label: "Settings", icon: "⚙", path: "#", active: false }
    ];

    return (
        <aside className={`fc-sidebar ${mobileOpen ? "fc-sidebar-open" : ""}`}>
            <div className="fc-sidebar-header">
                <div className="fc-sidebar-brand-icon">
                    🌿
                </div>
                <div className="fc-sidebar-brand-text">
                    <span className="fc-sidebar-brand-name">FridgeChef</span>
                    <span className="fc-sidebar-brand-sub">AI Fridge Meal Planner</span>
                </div>
            </div>

            <nav className="fc-sidebar-nav">
                {navItems.map((item, index) => {
                    const isRealRoute = item.path.startsWith("/");
                    return isRealRoute ? (
                        <Link
                            key={index}
                            to={item.path}
                            className={`fc-sidebar-link ${item.active ? "active" : ""}`}
                            onClick={onCloseMobile}
                        >
                            <span className="fc-sidebar-link-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ) : (
                        <div
                            key={index}
                            className="fc-sidebar-link"
                            style={{ opacity: 0.75, cursor: "default" }}
                            title="Feature coming soon"
                        >
                            <span className="fc-sidebar-link-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </nav>

            <div className="fc-sidebar-footer">
                <div className="fc-sidebar-promo-box">
                    <div className="fc-sidebar-promo-title">🌿 Zero Food Waste</div>
                    <div className="fc-sidebar-promo-desc">Cook smarter with AI</div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
