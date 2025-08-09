import React, { useState, useEffect } from "react";
import ProductForm from "../components/product/ProductForm";
import ProductList from "../components/product/ProductList";
import ProductSearch from "../components/product/ProductSearch";
import ProductDescriptionEditor from "../components/product/ProductDescriptionEditor";
import productService from "../services/productService";
import "../styles/pages/ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add");

  const tabs = [
    { id: "add", label: "Add Product", icon: "➕" },
    { id: "edit", label: "Edit Description", icon: "✏️" },
    { id: "search", label: "Search", icon: "🔍" },
    { id: "list", label: "Product List", icon: "📋" },
  ];

  // Fonction pour charger les produits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      setProducts(response || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonction appelée quand un produit est ajouté
  const handleProductAdded = (newProduct) => {
    // Recharger la liste des produits après ajout
    fetchProducts();
  };

  // Fonction appelée quand un produit est supprimé
  const handleProductDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Fonction appelée quand un produit est modifié
  const handleProductEdited = (updatedProduct) => {
    fetchProducts(); // Recharger la liste après modification
  };

  return (
    <div className="products-page fade-in">
      <h1>Product Management</h1>
      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === "add" && (
            <div className="tab-panel">
              <h2>Add New Product</h2>
              <ProductForm onProductAdded={handleProductAdded} />
            </div>
          )}
          {activeTab === "edit" && (
            <div className="tab-panel">
              <h2>Edit Product Description</h2>
              <ProductDescriptionEditor
                onProductUpdated={handleProductEdited}
              />
            </div>
          )}
          {activeTab === "search" && (
            <div className="tab-panel">
              <h2>Search Products</h2>
              <ProductSearch />
            </div>
          )}
          {activeTab === "list" && (
            <div className="tab-panel">
              <h2>Product List</h2>
              <ProductList
                products={products}
                loading={loading}
                onEdit={handleProductEdited}
                onDelete={handleProductDeleted}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
