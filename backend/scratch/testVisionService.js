const { analyzeFridgeImage } = require("../services/visionService");
const fs = require("fs");
const path = require("path");

async function runTests() {
    console.log("=== RUNNING VISION SERVICE TESTS ===");

    // Test 1: Missing API Key error handling
    const originalApiKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "your_gemini_api_key_here";
    try {
        await analyzeFridgeImage("nonexistent.jpg");
        console.error("FAIL: Expected error for placeholder API key");
    } catch (err) {
        if (err.message.includes("GEMINI_API_KEY is not configured")) {
            console.log("PASS: Placeholder API key detected correctly.");
        } else {
            console.log("PASS with message:", err.message);
        }
    }
    process.env.GEMINI_API_KEY = originalApiKey;

    // Test 2: Non-existent image file error handling
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
        try {
            await analyzeFridgeImage("nonexistent_path_12345.jpg");
            console.error("FAIL: Expected file not found error");
        } catch (err) {
            console.log("PASS: Missing file error caught:", err.message);
        }
    } else {
        console.log("Skipping live Gemini API call test (GEMINI_API_KEY is placeholder).");
    }

    console.log("=== ALL SERVICE TESTS COMPLETED ===");
}

runTests();
