import { useState, useEffect } from "react";
import CameraCapture from "./CameraCapture";

function FridgeUpload({ onAnalysisComplete, resetTrigger }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("upload");
    const [showCameraModal, setShowCameraModal] = useState(false);

    useEffect(() => {
        if (resetTrigger > 0) {
            setImage(null);
            setPreview(null);
        }
    }, [resetTrigger]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError("");
    };

    const handleCameraCapture = (capturedFile) => {
        setImage(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        setError("");
        setShowCameraModal(false);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === "camera") {
            setShowCameraModal(true);
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            setError("Please select or capture a fridge image first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await onAnalysisComplete(image);
        } catch (err) {
            setError(err.message || "Failed to analyze image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-section">
            {/* Upload vs Take Photo Tabs */}
            <div className="fc-upload-tabs">
                <button
                    className={`fc-tab-btn ${activeTab === "upload" ? "active" : ""}`}
                    onClick={() => handleTabClick("upload")}
                    type="button"
                >
                    📁 Upload Image
                </button>
                <button
                    className={`fc-tab-btn ${activeTab === "camera" ? "active" : ""}`}
                    onClick={() => handleTabClick("camera")}
                    type="button"
                >
                    📷 Take Photo
                </button>
            </div>

            {/* Dropzone / Preview Box */}
            <label className="fc-upload-dropzone">
                {preview ? (
                    <img
                        src={preview}
                        alt="Fridge preview"
                        className="fc-upload-preview-img"
                    />
                ) : (
                    <div>
                        <div className="fc-upload-icon-box">
                            📸
                        </div>
                        <h3 className="fc-upload-text-main">
                            Drag & drop an image here
                        </h3>
                        <p className="fc-upload-text-sub">
                            or click to browse your files
                        </p>
                        <span className="fc-btn-choose-file">
                            Choose Image
                        </span>
                        <p className="fc-upload-info-text">
                            Supports JPG, PNG (Max 10MB)
                        </p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                />
            </label>

            {image && (
                <p className="fc-file-name-text">
                    Selected: {image.name}
                </p>
            )}

            <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
                style={{ width: "100%", marginTop: "16px" }}
            >
                {loading ? "Analyzing..." : "Analyze Fridge ✨"}
            </button>

            {error && (
                <p className="error" style={{ color: "#ef4444", marginTop: "10px", fontSize: "0.85rem", fontWeight: "600" }}>
                    {error}
                </p>
            )}

            {/* Camera Live Capture Modal */}
            {showCameraModal && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => {
                        setShowCameraModal(false);
                        setActiveTab("upload");
                    }}
                />
            )}
        </div>
    );
}

export default FridgeUpload;