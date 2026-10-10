const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeFridgeImage } = require("../services/visionService");
const PantryItem = require("../models/PantryItem");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post("/", authMiddleware, upload.single("fridgeImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No fridge image uploaded"
            });
        }

        const detectedIngredients = await analyzeFridgeImage(
                req.file.path,
                req.file.mimetype
            );

            if (!Array.isArray(detectedIngredients)) {
                throw new Error(
            "Vision service returned an invalid ingredient list."
        );
    };

        const detectedItems = detectedIngredients.map((item) => ({
            userId: req.userId,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            confidence: item.confidence
        }));

        // Replace the previous fridge inventory for current user
        await PantryItem.deleteMany({ userId: req.userId });

        // Save the new detected ingredients
        const savedItems = await PantryItem.insertMany(detectedItems);

        res.status(200).json({
            success: true,
            message: "Fridge analyzed successfully",
            image: {
                filename: req.file.filename,
                originalName: req.file.originalname
            },
            detectedItems: savedItems
        });
    } catch (error) {
        console.error("Scan route processing error:", error.message || error);

        let safeErrorMessage = "Unable to analyze the fridge image. Please try again.";
        if (error.message && error.message.includes("GEMINI_API_KEY")) {
            safeErrorMessage = "Server configuration error: Gemini API key is missing or invalid.";
        }

        res.status(500).json({
            success: false,
            message: safeErrorMessage
        });
    }
});

module.exports = router;