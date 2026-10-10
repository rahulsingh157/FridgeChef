
const Groq = require("groq-sdk");
const fs = require("fs");

const ALLOWED_UNITS = [
    "piece",
    "gram",
    "kg",
    "ml",
    "liter",
    "carton"
];

const normalizeIngredient = (item) => {
    if (!item || typeof item !== "object") return null;

    const rawName =
        typeof item.name === "string"
            ? item.name.trim()
            : "";

    if (!rawName) return null;

    const name = rawName
        .split(/\s+/)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");

    let quantity = Number(item.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        quantity = 1;
    }

    let confidence = Number(item.confidence);

    if (!Number.isFinite(confidence)) {
        confidence = 0.7;
    }

    confidence = Math.min(1, Math.max(0, confidence));

    let unit =
        typeof item.unit === "string"
            ? item.unit.trim().toLowerCase()
            : "piece";

    if (!ALLOWED_UNITS.includes(unit)) {
        unit = "piece";
    }

    return {
        name,
        quantity,
        unit,
        confidence: Number(confidence.toFixed(2))
    };
};

const analyzeFridgeImage = async (
    imagePath,
    mimeType = "image/jpeg"
) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
        throw new Error(
            "GROQ_API_KEY is missing from backend environment."
        );
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error("Uploaded image file was not found.");
    }

    const supportedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    if (!supportedMimeTypes.includes(mimeType)) {
        throw new Error(
            `Unsupported image type: ${mimeType}`
        );
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const groq = new Groq({ apiKey });

    const model =
        process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    const prompt = `
You are an ingredient detection system for a fridge meal planner.

Identify distinct food ingredients that are clearly visible
in the supplied refrigerator image.

Rules:
- Only report ingredients supported by visible evidence.
- Do not invent hidden foods or infer contents of opaque containers.
- Do not count packaging, shelves, or appliances as food.
- Merge duplicate observations of the same ingredient.
- Estimate quantity conservatively.
- If an exact quantity cannot be determined, use 1
  and lower the confidence.
- Confidence must be between 0 and 1.
- Use only these units: piece, gram, kg, ml, liter, carton.
- Use "piece" for countable items when appropriate.
- Return an empty ingredients array if no food is identifiable.

Return a JSON object with this exact structure:
{
  "ingredients": [
    {
      "name": "Tomato",
      "quantity": 4,
      "unit": "piece",
      "confidence": 0.9
    }
  ]
}

Return valid JSON only, without markdown or explanations.
`;

    const MAX_RETRIES = 2;
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(
                `Groq vision request: model=${model}, attempt=${attempt + 1}`
            );

            const completion =
                await groq.chat.completions.create({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: prompt
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:${mimeType};base64,${base64Image}`
                                    }
                                }
                            ]
                        }
                    ],
                    temperature: 0,
                    max_completion_tokens: 2048,
                    stream: false,
                    response_format: {
                        type: "json_object"
                    }
                });

            const rawText =
                completion.choices?.[0]?.message?.content;

            if (!rawText) {
                throw new Error(
                    "Groq returned an empty response."
                );
            }

            const parsed = JSON.parse(rawText);

            if (!Array.isArray(parsed.ingredients)) {
                throw new Error(
                    "Groq response did not contain an ingredients array."
                );
            }

            const ingredients = parsed.ingredients
                .map(normalizeIngredient)
                .filter(Boolean);

            // Empty results are valid: the image may contain no
            // clearly identifiable food. Do not invent ingredients.
            console.log(
                `Groq detected ${ingredients.length} ingredients.`
            );

            return ingredients;

        } catch (error) {
            lastError = error;

            const status =
                error.status ||
                error.statusCode;

            const retryable =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504;

            if (!retryable || attempt === MAX_RETRIES) {
                break;
            }

            const delay = 1000 * (2 ** attempt);

            console.warn(
                `Groq request failed (${status || "unknown"}). ` +
                `Retrying in ${delay / 1000}s.`
            );

            await new Promise(
                (resolve) => setTimeout(resolve, delay)
            );
        }
    }

    console.error(
        "Groq Vision Service Error:",
        lastError?.message || lastError
    );

    throw lastError || new Error(
        "Unable to analyze fridge image."
    );
};

module.exports = {
    analyzeFridgeImage
};
