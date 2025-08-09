// src/services/shippingService.js
import { makeRequest } from "./api";

const shippingService = {
  // ================== CRUD Tarifs ==================

  // Récupérer tous les tarifs
  getAllRates: () => makeRequest("/shipping/rates"),

  // Récupérer un tarif par ID
  getRateById: (id) => makeRequest(`/shipping/rates/${id}`),

  // Créer un nouveau tarif
  createRate: (rateData) =>
    makeRequest("/shipping/rates", {
      method: "POST",
      body: JSON.stringify(rateData),
    }),

  // Mettre à jour un tarif
  updateRate: (id, rateData) =>
    makeRequest(`/shipping/rates/${id}`, {
      method: "PUT",
      body: JSON.stringify(rateData),
    }),

  // Supprimer un tarif
  deleteRate: (id) =>
    makeRequest(`/shipping/rates/${id}`, {
      method: "DELETE",
    }),

  // ================== Calculs ==================

  // Calculer le coût d'expédition
  calculateShippingCost: (weight, method = "standard") =>
    makeRequest(`/shipping/calculate?weight=${weight}&method=${method}`),

  // Récupérer les tarifs applicables pour un poids
  getApplicableRates: (weight) =>
    makeRequest(`/shipping/applicable?weight=${weight}`),

  // ================== Informations ==================

  // Récupérer les méthodes d'expédition disponibles
  getAvailableMethods: () => makeRequest("/shipping/methods"),

  // Récupérer les tarifs ordonnés par poids
  getRatesOrderedByWeight: () =>
    makeRequest("/shipping/rates/ordered-by-weight"),

  // Récupérer les tarifs ordonnés par prix
  getRatesOrderedByPrice: () => makeRequest("/shipping/rates/ordered-by-price"),

  // Filtrer par plage de prix
  getRatesByPriceRange: (minPrice, maxPrice) =>
    makeRequest(
      `/shipping/rates/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
    ),

  // ================== Suivi ==================

  // Suivi d'expédition par numéro
  trackShipment: (trackingNumber) =>
    makeRequest(`/shipping/tracking/${trackingNumber}`),

  // Mettre à jour le statut d'expédition
  updateShippingStatus: (id, status) =>
    makeRequest(`/shipping/${id}/status?status=${status}`, {
      method: "PATCH",
    }),

  // Marquer comme expédié
  markAsShipped: (id) =>
    makeRequest(`/shipping/${id}/ship`, {
      method: "PATCH",
    }),

  // Marquer comme livré
  markAsDelivered: (id) =>
    makeRequest(`/shipping/${id}/deliver`, {
      method: "PATCH",
    }),

  // Récupérer les expéditions actives
  getActiveShipments: () => makeRequest("/shipping/active"),

  // ================== Validation ==================

  // Valider une plage de poids
  validateWeightRange: (low, high) =>
    makeRequest(`/shipping/validate-range?low=${low}&high=${high}`),

  // ================== Utilitaires pour les composants ==================

  // Obtenir la description du statut
  getStatusDescription: (status) => {
    const statusMap = {
      1: "En attente",
      2: "En traitement",
      3: "Expédié",
      4: "En transit",
      5: "Livré",
      6: "Annulé",
    };
    return statusMap[status] || "Statut inconnu";
  },

  // Obtenir la couleur du statut pour l'UI
  getStatusColor: (status) => {
    const colorMap = {
      1: "#ffc107", // Jaune - En attente
      2: "#17a2b8", // Bleu - En traitement
      3: "#007bff", // Bleu foncé - Expédié
      4: "#6f42c1", // Violet - En transit
      5: "#28a745", // Vert - Livré
      6: "#dc3545", // Rouge - Annulé
    };
    return colorMap[status] || "#6c757d";
  },

  // Calculer les jours estimés de livraison
  calculateEstimatedDeliveryDays: (method) => {
    const deliveryDays = {
      standard: 7,
      express: 3,
      overnight: 1,
      priority: 2,
    };
    return deliveryDays[method?.toLowerCase()] || 5;
  },

  // Formater un poids pour l'affichage
  formatWeight: (weight) => {
    if (weight == null) return "0 kg";
    return `${weight} kg`;
  },

  // Formater un prix pour l'affichage
  formatPrice: (price) => {
    if (price == null) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Vérifier si une expédition est en cours
  isInProgress: (status) => {
    return status >= 2 && status <= 4; // En traitement, expédié, ou en transit
  },

  // Vérifier si une expédition est terminée
  isCompleted: (status) => {
    return status === 5 || status === 6; // Livré ou annulé
  },

  // Calculer la date estimée de livraison
  calculateEstimatedDeliveryDate: (shippedDate, method) => {
    if (!shippedDate) return null;

    const days = shippingService.calculateEstimatedDeliveryDays(method);
    const estimatedDate = new Date(shippedDate);
    estimatedDate.setDate(estimatedDate.getDate() + days);

    return estimatedDate;
  },

  // Formater une date pour l'affichage
  formatDate: (date) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

export default shippingService;
