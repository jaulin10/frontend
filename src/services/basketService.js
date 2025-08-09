// src/services/basketService.js
import { makeRequest } from "./api";

const basketService = {
  // ================== CRUD Operations ==================

  // Récupérer tous les paniers
  getAllBaskets: () => makeRequest("/baskets"),

  // Récupérer un panier par ID
  getBasketById: (id) => makeRequest(`/baskets/${id}`),

  // Créer un nouveau panier
  createBasket: (basketData) =>
    makeRequest("/baskets", {
      method: "POST",
      body: JSON.stringify(basketData),
    }),

  // Mettre à jour un panier
  updateBasket: (id, basketData) =>
    makeRequest(`/baskets/${id}`, {
      method: "PUT",
      body: JSON.stringify(basketData),
    }),

  // Supprimer un panier
  deleteBasket: (id) =>
    makeRequest(`/baskets/${id}`, {
      method: "DELETE",
    }),

  // ================== Basket Items Management ==================

  // Ajouter un article au panier
  addItemToBasket: (basketItemData) =>
    makeRequest("/basket-items", {
      method: "POST",
      body: JSON.stringify(basketItemData),
    }),

  // Récupérer les articles d'un panier
  getBasketItems: (basketId) => makeRequest(`/baskets/${basketId}/items`),

  // Mettre à jour la quantité d'un article
  updateBasketItem: (basketId, itemId, quantity) =>
    makeRequest(`/baskets/${basketId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  // Supprimer un article du panier
  removeItemFromBasket: (basketId, itemId) =>
    makeRequest(`/baskets/${basketId}/items/${itemId}`, {
      method: "DELETE",
    }),

  // Vider complètement un panier
  clearBasket: (basketId) =>
    makeRequest(`/baskets/${basketId}/clear`, {
      method: "DELETE",
    }),

  // ================== Basket Operations ==================

  // Calculer le total d'un panier
  calculateBasketTotal: (basketId) => makeRequest(`/baskets/${basketId}/total`),

  // Valider un panier (passer commande)
  checkoutBasket: (basketId, shippingInfo) =>
    makeRequest(`/baskets/${basketId}/checkout`, {
      method: "POST",
      body: JSON.stringify(shippingInfo),
    }),

  // Appliquer un code promo
  applyDiscountCode: (basketId, discountCode) =>
    makeRequest(`/baskets/${basketId}/discount`, {
      method: "POST",
      body: JSON.stringify({ discountCode }),
    }),

  // ================== Basket Status ==================

  // Récupérer les paniers par statut
  getBasketsByStatus: (status) => makeRequest(`/baskets/status/${status}`),

  // Récupérer les paniers actifs
  getActiveBaskets: () => makeRequest("/baskets/active"),

  // Récupérer les paniers abandonnés
  getAbandonedBaskets: () => makeRequest("/baskets/abandoned"),

  // ================== Search & Filter ==================

  // Rechercher des paniers par shopper
  getBasketsByShopper: (shopperId) =>
    makeRequest(`/baskets/shopper/${shopperId}`),

  // Récupérer les paniers dans une plage de dates
  getBasketsByDateRange: (startDate, endDate) =>
    makeRequest(`/baskets/date-range?start=${startDate}&end=${endDate}`),

  // Récupérer les paniers par montant minimum
  getBasketsByMinAmount: (minAmount) =>
    makeRequest(`/baskets/min-amount/${minAmount}`),

  // ================== Utility Functions ==================

  // Formater le montant du panier
  formatBasketTotal: (total) => {
    if (total == null) return "$0.00";
    return `$${parseFloat(total).toFixed(2)}`;
  },

  // Calculer le nombre d'articles dans un panier
  getBasketItemCount: (basketItems) => {
    if (!Array.isArray(basketItems)) return 0;
    return basketItems.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  // Obtenir le statut d'un panier
  getBasketStatus: (basket) => {
    if (!basket.dtcreated)
      return { status: "unknown", label: "Inconnu", color: "#6c757d" };

    const created = new Date(basket.dtcreated);
    const now = new Date();
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);

    if (basket.orderplaced) {
      return { status: "completed", label: "Commandé", color: "#28a745" };
    } else if (daysDiff > 7) {
      return { status: "abandoned", label: "Abandonné", color: "#dc3545" };
    } else if (daysDiff > 1) {
      return { status: "pending", label: "En attente", color: "#ffc107" };
    } else {
      return { status: "active", label: "Actif", color: "#007bff" };
    }
  },

  // Valider les données d'un panier
  validateBasket: (basket) => {
    const errors = [];

    if (!basket.shopperId || basket.shopperId <= 0) {
      errors.push("Un shopper valide est requis");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Valider un article de panier
  validateBasketItem: (item) => {
    const errors = [];

    if (!item.basketId || item.basketId <= 0) {
      errors.push("ID du panier requis");
    }

    if (!item.productId || item.productId <= 0) {
      errors.push("ID du produit requis");
    }

    if (!item.quantity || item.quantity <= 0) {
      errors.push("La quantité doit être supérieure à 0");
    }

    if (!item.price || item.price <= 0) {
      errors.push("Le prix doit être supérieur à 0");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Calculer le sous-total d'un article
  calculateItemSubtotal: (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return quantity * price;
  },

  // Grouper les articles par produit
  groupItemsByProduct: (basketItems) => {
    if (!Array.isArray(basketItems)) return {};

    return basketItems.reduce((groups, item) => {
      const productId = item.productId || item.idproduct;
      if (!groups[productId]) {
        groups[productId] = [];
      }
      groups[productId].push(item);
      return groups;
    }, {});
  },
};

export default basketService;
