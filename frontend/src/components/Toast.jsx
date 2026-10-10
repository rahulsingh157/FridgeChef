import { useEffect, useState } from "react";

function Toast({ toast, onClose }) {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        if (!toast) return;

        setHiding(false);
        const timer = setTimeout(() => {
            setHiding(true);
            setTimeout(() => {
                onClose();
            }, 250); // duration of slide out animation
        }, 2800); // 2.8 seconds display duration

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div className="fc-toast-container" role="status" aria-live="polite">
            <div className={`fc-toast ${hiding ? "fc-toast-hiding" : ""}`}>
                <div className="fc-toast-icon-badge">
                    ✓
                </div>
                <div className="fc-toast-content">
                    <span className="fc-toast-title">{toast.title}</span>
                    {toast.subtitle && (
                        <span className="fc-toast-sub">{toast.subtitle}</span>
                    )}
                </div>
                <button
                    className="fc-toast-close"
                    onClick={() => {
                        setHiding(true);
                        setTimeout(onClose, 250);
                    }}
                    aria-label="Close notification"
                    type="button"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default Toast;
