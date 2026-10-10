const express = require("express");
const PantryItem = require("../models/PantryItem");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET current user's pantry
router.get("/", authMiddleware, async (req, res) => {
    try {
        const items = await PantryItem.find({
            userId: req.userId
        });

        res.status(200).json({
            success: true,
            items
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch pantry items",
            error: error.message
        });
    }
});


// POST a pantry item
router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            name,
            quantity,
            unit,
            confidence
        } = req.body;

        if (!name || quantity === undefined || !unit) {
            return res.status(400).json({
                success: false,
                message: "Name, quantity and unit are required"
            });
        }

        const item = await PantryItem.create({
            userId: req.userId,
            name,
            quantity,
            unit,
            confidence: confidence ?? 1
        });

        res.status(201).json({
            success: true,
            item
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add pantry item",
            error: error.message
        });
    }
});


// Confirm user's final pantry
router.put(
    "/confirm",
    authMiddleware,
    async (req, res) => {
        try {

            const { ingredients } = req.body;

            if (!Array.isArray(ingredients)) {
                return res.status(400).json({
                    success: false,
                    message: "Ingredients must be an array"
                });
            }

            // Remove only the current user's pantry
            await PantryItem.deleteMany({
                userId: req.userId
            });

            // Add userId to every confirmed ingredient
            const cleanedIngredients = ingredients.map((item) => ({
                userId: req.userId,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                confidence: item.confidence ?? 1
            }));

            // Save confirmed ingredients
            const savedItems = await PantryItem.insertMany(
                cleanedIngredients
            );

            res.status(200).json({
                success: true,
                message: "Pantry ingredients confirmed successfully",
                items: savedItems
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to confirm pantry ingredients",
                error: error.message
            });
        }
    }
);


module.exports = router;