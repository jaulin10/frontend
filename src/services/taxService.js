// src/services/taxService.js
import { makeRequest } from "./api";

const taxService = {
  // ================== Configurations ==================

  // Récupérer toutes les configurations de taxes
  getAllConfigurations: () => makeRequest("/tax/configurations"),

  // Récupérer une configuration par ID
  getConfigurationById: (id) => makeRequest(`/tax/configurations/${id}`),

  // Créer une nouvelle configuration
  createConfiguration: (taxData) =>
    makeRequest("/tax/configurations", {
      method: "POST",
      body: JSON.stringify(taxData),
    }),

  // Mettre à jour une configuration
  updateConfiguration: (id, taxData) =>
    makeRequest(`/tax/configurations/${id}`, {
      method: "PUT",
      body: JSON.stringify(taxData),
    }),

  // Supprimer une configuration
  deleteConfiguration: (id) =>
    makeRequest(`/tax/configurations/${id}`, {
      method: "DELETE",
    }),

  // Activer/désactiver une configuration
  toggleConfiguration: (id, active) =>
    makeRequest(`/tax/configurations/${id}/toggle?active=${active}`, {
      method: "PATCH",
    }),

  // ================== Calculs ==================

  // Calculer une taxe
  calculateTax: (amount, state) =>
    makeRequest(`/tax/calculate?amount=${amount}&state=${state}`),

  // Calculer le total avec taxe
  calculateTotalWithTax: (amount, state) =>
    makeRequest(`/tax/calculate-total?amount=${amount}&state=${state}`),

  // Récupérer le taux pour un état
  getTaxRateForState: (state) => makeRequest(`/tax/rate/${state}`),

  // ================== Gestion des paniers ==================

  // Appliquer une taxe à un panier
  applyTaxToBasket: (basketId, state, subtotal) =>
    makeRequest("/tax/apply", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ basketId, state, subtotal }).toString(),
    }),

  // Récupérer les taxes d'un panier
  getBasketTaxes: (basketId) => makeRequest(`/tax/basket/${basketId}`),

  // Récupérer le total des taxes d'un panier
  getBasketTaxTotal: (basketId) => makeRequest(`/tax/basket/${basketId}/total`),

  // Supprimer les taxes d'un panier
  removeBasketTaxes: (basketId) =>
    makeRequest(`/tax/basket/${basketId}`, {
      method: "DELETE",
    }),

  // ================== Informations ==================

  // Récupérer les états disponibles
  getAvailableStates: () => makeRequest("/tax/states"),

  // Récupérer les tarifs ordonnés par taux
  getRatesOrderedByRate: () =>
    makeRequest("/tax/configurations/ordered-by-rate"),

  // Filtrer par plage de taux
  getRatesByRange: (minPercentage, maxPercentage) =>
    makeRequest(
      `/tax/configurations/rate-range?minPercentage=${minPercentage}&maxPercentage=${maxPercentage}`
    ),

  // Statistiques des taxes
  getTaxStatistics: () => makeRequest("/tax/statistics"),

  // Recherche par description
  searchByDescription: (keyword) =>
    makeRequest(`/tax/search?keyword=${keyword}`),

  // ================== Validation ==================

  // Vérifier si un état a une configuration
  hasConfigurationForState: (state) =>
    makeRequest(`/tax/configurations/exists/${state}`),

  // Valider un taux de taxe
  validateTaxRate: (percentage) =>
    makeRequest(`/tax/validate-rate?percentage=${percentage}`),

  // ================== Utilitaires pour les composants ==================

  // Formater un montant pour l'affichage
  formatAmount: (amount) => {
    if (amount == null) return "$0.00";
    return `$${parseFloat(amount).toFixed(2)}`;
  },

  // Formater un taux pour l'affichage
  formatRate: (rate) => {
    if (rate == null) return "0.00%";
    return `${parseFloat(rate).toFixed(2)}%`;
  },

  // Calculer le pourcentage de taxe depuis un taux décimal
  decimalToPercentage: (decimal) => {
    if (decimal == null) return 0;
    return parseFloat(decimal) * 100;
  },

  // Convertir un pourcentage en taux décimal
  percentageToDecimal: (percentage) => {
    if (percentage == null) return 0;
    return parseFloat(percentage) / 100;
  },
};

export default taxService;
