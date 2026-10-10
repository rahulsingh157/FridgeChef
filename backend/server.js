const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const pantryRoutes = require("./routes/pantryRoutes");
const scanRoutes = require("./routes/scanRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Fridge Meal Planner API is running!"
    });
});

app.use("/api/pantry", pantryRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running on http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });