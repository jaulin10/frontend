// src/services/productService.js
import { makeRequest } from "./api";

const productService = {
  // ================== CRUD Operations ==================

  // Récupérer tous les produits
  getAllProducts: () => makeRequest("/products"),

  // Récupérer un produit par ID
  getProductById: (id) => makeRequest(`/products/${id}`),

  // Créer un nouveau produit
  createProduct: (productData) =>
    makeRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  // Mettre à jour un produit
  updateProduct: (id, productData) =>
    makeRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  // Supprimer un produit
  deleteProduct: (id) =>
    makeRequest(`/products/${id}`, {
      method: "DELETE",
    }),

  // ================== Search & Filter ==================

  // Recherche de produits
  searchProducts: (searchTerm) =>
    makeRequest(
      `/products/search/global?keyword=${encodeURIComponent(searchTerm)}`
    ),

  // Filtrer par catégorie
  getProductsByCategory: (categoryId) =>
    makeRequest(`/products/category/${categoryId}`),

  // Filtrer par plage de prix
  getProductsByPriceRange: (minPrice, maxPrice) =>
    makeRequest(`/products/price-range?min=${minPrice}&max=${maxPrice}`),

  // Produits actifs seulement
  getActiveProducts: () => makeRequest("/products/active"),

  // Produits en stock faible
  getLowStockProducts: () => makeRequest("/products/low-stock"),

  // ================== Stock Management ==================

  // Mettre à jour le stock
  updateStock: (id, quantity) =>
    makeRequest(`/products/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ quantity }).toString(),
    }),

  // Vérifier la disponibilité
  checkAvailability: (id, quantity) =>
    makeRequest(`/products/${id}/availability?quantity=${quantity}`),

  // ================== Categories ==================

  // Récupérer toutes les catégories
  getCategories: () => makeRequest("/products/categories"),

  // Statistiques des produits
  getProductStats: () => makeRequest("/products/stats"),

  // ================== Utility Functions ==================

  // Formater le prix pour l'affichage
  formatPrice: (price) => {
    if (price == null) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Formater le stock avec badge
  formatStock: (stock) => {
    const stockNum = parseInt(stock) || 0;
    return {
      value: stockNum,
      isLow: stockNum < 10,
      isEmpty: stockNum === 0,
      display: stockNum.toString(),
    };
  },

  // Obtenir l'URL de l'image
  getImageUrl: (imageName) => {
    if (!imageName) return "/images/placeholder.jpg";
    return `/images/products/${imageName}`;
  },

  // Tronquer la description
  truncateDescription: (description, maxLength = 50) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  },

  // Valider les données de produit
  validateProduct: (product) => {
    const errors = [];

    if (!product.productname || product.productname.trim() === "") {
      errors.push("Product name is required");
    }

    if (!product.price || parseFloat(product.price) <= 0) {
      errors.push("Price must be greater than 0");
    }

    if (product.stock !== undefined && parseInt(product.stock) < 0) {
      errors.push("Stock cannot be negative");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Calculer le statut du produit
  getProductStatus: (product) => {
    if (!product.active)
      return { status: "inactive", label: "Inactif", color: "#dc3545" };
    if ((product.stock || 0) === 0)
      return { status: "outofstock", label: "Rupture", color: "#fd7e14" };
    if ((product.stock || 0) < 10)
      return { status: "lowstock", label: "Stock faible", color: "#ffc107" };
    return { status: "active", label: "Actif", color: "#28a745" };
  },
};

export default productService;
