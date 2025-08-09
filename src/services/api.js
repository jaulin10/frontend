// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Configuration de base pour les requêtes
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Fonction utilitaire pour faire les requêtes
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Export de la fonction makeRequest pour les autres services
export { makeRequest, API_BASE_URL };

// Test de connexion au backend
export const testConnection = async () => {
  try {
    await makeRequest("/tax/configurations");
    return { success: true, message: "Backend connecté avec succès!" };
  } catch (error) {
    return { success: false, message: `Erreur de connexion: ${error.message}` };
  }
};

// Export par défaut
export default {
  makeRequest,
  testConnection,
  API_BASE_URL,
};
