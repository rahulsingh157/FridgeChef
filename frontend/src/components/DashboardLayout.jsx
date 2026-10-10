import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ user, onLogout, children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="fc-dashboard-wrapper">
            <Sidebar
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className="fc-dashboard-main">
                <Topbar
                    user={user}
                    onLogout={onLogout}
                    onToggleMobile={() => setMobileOpen(!mobileOpen)}
                />

                <main className="fc-dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
