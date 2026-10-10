const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};
};

export const scanFridge = async (image) => {
    const formData = new FormData();

    formData.append("fridgeImage", image);

    const response = await fetch(
        `${API_URL}/scan`,
        {
            method: "POST",
            headers: {
                ...getAuthHeaders()
            },
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to analyze fridge"
        );
    }

    return data;
};

export const getMealSuggestions = async () => {
    const response = await fetch(
        `${API_URL}/recipes/suggestions`,
        {
            headers: {
                ...getAuthHeaders()
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to get meal suggestions"
        );
    }

    return data;
};

export const confirmPantry = async (ingredients) => {
    const response = await fetch(
        `${API_URL}/pantry/confirm`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                ingredients
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to confirm ingredients"
        );
    }

    return data;
};

export const getPantry = async () => {
    const response = await fetch(
        `${API_URL}/pantry`,
        {
            headers: {
                ...getAuthHeaders()
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch pantry items"
        );
    }

    return data;
};