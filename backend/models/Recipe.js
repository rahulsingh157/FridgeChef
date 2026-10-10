const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        ingredients: [
            {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                unit: {
                    type: String,
                    default: "piece"
                }
            }
        ],

        instructions: [
            {
                type: String
            }
        ],

        cookingTime: {
            type: Number,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        },

        cuisine: {
            type: String,
            default: "Indian"
        }
    },
    {
        timestamps: true
    }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;