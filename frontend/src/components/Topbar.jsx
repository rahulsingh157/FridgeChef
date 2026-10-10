function Topbar({ user, onLogout, onToggleMobile }) {
    const userName = user?.name || "Chef";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="fc-topbar">
            {/* Left: Mobile Toggle & Search Bar */}
            <div className="fc-topbar-left">
                {onToggleMobile && (
                    <button
                        className="fc-icon-btn fc-mobile-sidebar-toggle"
                        onClick={onToggleMobile}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                )}

                <div className="fc-search-box">
                    <span className="fc-search-icon">🔍</span>
                    <input
                        type="text"
                        className="fc-search-input"
                        placeholder="Search recipes, ingredients, or actions..."
                    />
                </div>
            </div>

            {/* Right: Notifications & User Profile */}
            <div className="fc-topbar-right">
                <button className="fc-icon-btn" title="Notifications" aria-label="Notifications">
                    🔔
                    <span className="fc-notification-dot"></span>
                </button>

                <div className="fc-user-profile">
                    <div className="fc-avatar">
                        {userInitial}
                    </div>
                    <div className="fc-user-details">
                        <span className="fc-user-name">{userName}</span>
                        <span className="fc-user-role">Home Chef</span>
                    </div>
                </div>

                <button
                    className="fc-btn-topbar-logout"
                    onClick={onLogout}
                    title="Logout from your account"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Topbar;
