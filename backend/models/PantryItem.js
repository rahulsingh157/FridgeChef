const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            default: 1
        },

        unit: {
            type: String,
            default: "piece"
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1
        }
    },
    {
        timestamps: true
    }
);

const PantryItem = mongoose.model("PantryItem", pantryItemSchema);

module.exports = PantryItem;