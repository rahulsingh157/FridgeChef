const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

const recipes = [
    {
        name: "Aloo Masala",
        description: "A simple and spicy potato-based Indian dish.",
        ingredients: [
            { name: "Potato", quantity: 4, unit: "piece" },
            { name: "Onion", quantity: 1, unit: "piece" },
            { name: "Tomato", quantity: 2, unit: "piece" }
        ],
        instructions: [
            "Boil the potatoes.",
            "Heat oil in a pan.",
            "Add chopped onion and cook until golden.",
            "Add chopped tomatoes and spices.",
            "Add boiled potatoes and mix well.",
            "Cook for 5 minutes and serve."
        ],
        cookingTime: 25,
        difficulty: "Easy",
        cuisine: "Indian"
    },

    {
        name: "Vegetable Curry",
        description: "A simple mixed vegetable curry.",
        ingredients: [
            { name: "Potato", quantity: 2, unit: "piece" },
            { name: "Carrot", quantity: 2, unit: "piece" },
            { name: "Onion", quantity: 1, unit: "piece" },
            { name: "Tomato", quantity: 2, unit: "piece" }
        ],
        instructions: [
            "Chop all vegetables.",
            "Heat oil and cook the onion.",
            "Add tomatoes and spices.",
            "Add potato and carrot.",
            "Add water and cook until the vegetables are soft.",
            "Serve hot."
        ],
        cookingTime: 30,
        difficulty: "Easy",
        cuisine: "Indian"
    },

    {
        name: "Masala Omelette",
        description: "A quick omelette with vegetables.",
        ingredients: [
            { name: "Egg", quantity: 2, unit: "piece" },
            { name: "Onion", quantity: 1, unit: "piece" },
            { name: "Tomato", quantity: 1, unit: "piece" }
        ],
        instructions: [
            "Beat the eggs in a bowl.",
            "Add chopped onion and tomato.",
            "Add salt and spices.",
            "Heat a pan and add the egg mixture.",
            "Cook both sides until done."
        ],
        cookingTime: 15,
        difficulty: "Easy",
        cuisine: "Indian"
    },

    {
        name: "Carrot Potato Stir Fry",
        description: "A quick vegetable stir fry.",
        ingredients: [
            { name: "Carrot", quantity: 2, unit: "piece" },
            { name: "Potato", quantity: 2, unit: "piece" },
            { name: "Onion", quantity: 1, unit: "piece" }
        ],
        instructions: [
            "Cut the vegetables into small pieces.",
            "Heat oil in a pan.",
            "Add onion and cook for two minutes.",
            "Add potato and carrot.",
            "Add salt and spices.",
            "Cook until the vegetables become tender."
        ],
        cookingTime: 20,
        difficulty: "Easy",
        cuisine: "Indian"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        await Recipe.deleteMany();

        await Recipe.insertMany(recipes);

        console.log("Recipes inserted successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedDatabase();