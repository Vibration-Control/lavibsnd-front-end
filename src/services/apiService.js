// src/services/apiService.js
const API_BASE_URL = "http://127.0.0.1:5000";

export const optimizeNeutralizer = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/optimizeNeutralizer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
