import { useState, useEffect, useRef } from "react";

function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [capturedPreview, setCapturedPreview] = useState(null);
    const [capturedFile, setCapturedFile] = useState(null);
    const [cameraError, setCameraError] = useState("");
    const [loadingStream, setLoadingStream] = useState(true);

    const stopCameraStream = (mediaStream) => {
        const activeStream = mediaStream || stream;
        if (activeStream) {
            activeStream.getTracks().forEach((track) => {
                track.stop();
            });
            setStream(null);
        }
    };

    const startCamera = async () => {
        setCameraError("");
        setLoadingStream(true);
        setCapturedPreview(null);
        setCapturedFile(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("Camera access is not supported on this browser or device. Please upload an image instead.");
            setLoadingStream(false);
            return;
        }

        try {
            // Prefer rear environment camera on mobile; fall back to available webcam
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setCameraError("Camera permission was denied. Please allow camera access in your browser settings or choose an image file.");
            } else {
                setCameraError("Unable to access camera. Please make sure no other app is using it or upload an image file instead.");
            }
        } finally {
            setLoadingStream(false);
        }
    };

    useEffect(() => {
        startCamera();

        return () => {
            stopCameraStream();
        };
    }, []);

    // Capture current frame from video element onto canvas & convert to File
    const handleCapturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;

                const fileName = `fridge_photo_${Date.now()}.jpg`;
                const file = new File([blob], fileName, { type: "image/jpeg" });

                setCapturedFile(file);
                setCapturedPreview(URL.createObjectURL(file));

                // Stop camera stream after capture
                stopCameraStream();
            },
            "image/jpeg",
            0.95
        );
    };

    const handleRetake = () => {
        startCamera();
    };

    const handleUsePhoto = () => {
        if (capturedFile) {
            stopCameraStream();
            onCapture(capturedFile);
        }
    };

    const handleCancel = () => {
        stopCameraStream();
        onClose();
    };

    return (
        <div className="fc-camera-modal-overlay" onClick={handleCancel}>
            <div className="fc-camera-modal" onClick={(e) => e.stopPropagation()}>
                <div className="fc-camera-header">
                    <h3 className="fc-camera-title">
                        <span>📸</span>
                        <span>Take Fridge Photo</span>
                    </h3>
                    <button
                        className="fc-camera-close-btn"
                        onClick={handleCancel}
                        type="button"
                        aria-label="Close camera"
                    >
                        ×
                    </button>
                </div>

                {cameraError ? (
                    <div className="fc-camera-error-box">
                        <p style={{ fontSize: "1.8rem", marginBottom: "8px" }}>⚠️</p>
                        <p style={{ fontWeight: "600" }}>{cameraError}</p>
                        <button
                            className="fc-btn fc-btn-secondary"
                            onClick={handleCancel}
                            style={{ marginTop: "16px" }}
                            type="button"
                        >
                            Close & Upload File Instead
                        </button>
                    </div>
                ) : capturedPreview ? (
                    /* Captured Image Preview Mode */
                    <div className="fc-camera-captured-box">
                        <div className="fc-captured-tag">
                            <span>✓ Photo Captured</span>
                        </div>
                        <img
                            src={capturedPreview}
                            alt="Captured Fridge"
                            className="fc-captured-img"
                        />
                        <div className="fc-camera-actions">
                            <button
                                className="fc-btn fc-btn-secondary"
                                onClick={handleRetake}
                                type="button"
                            >
                                🔄 Retake
                            </button>
                            <button
                                className="fc-btn fc-btn-primary"
                                onClick={handleUsePhoto}
                                type="button"
                            >
                                ✓ Use This Photo
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Live Video Stream Mode */
                    <div className="fc-camera-preview-box">
                        {loadingStream && (
                            <div className="fc-camera-loading">
                                <p>Opening camera stream...</p>
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="fc-camera-video"
                        ></video>
                        <div className="fc-camera-frame-guide"></div>

                        <div className="fc-camera-actions">
                            <button
                                className="fc-btn fc-btn-secondary"
                                onClick={handleCancel}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="fc-btn fc-btn-primary fc-btn-capture"
                                onClick={handleCapturePhoto}
                                type="button"
                            >
                                📸 Capture Photo
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden canvas element for frame drawing */}
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
        </div>
    );
}

export default CameraCapture;
