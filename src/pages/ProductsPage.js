import React, { useState, useEffect } from "react";
import ProductForm from "../components/product/ProductForm";
import ProductList from "../components/product/ProductList";
import ProductSearch from "../components/product/ProductSearch";
import ProductDescriptionEditor from "../components/product/ProductDescriptionEditor";
import "../styles/pages/ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add");

  const tabs = [
    { id: "add", label: "Ajouter Produit", icon: "➕" },
    { id: "edit", label: "Modifier Description", icon: "✏️" },
    { id: "search", label: "Rechercher", icon: "🔍" },
    { id: "list", label: "Liste Produits", icon: "📋" },
  ];

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
              <ProductForm onProductAdded={setProducts} />
            </div>
          )}

          {activeTab === "edit" && (
            <div className="tab-panel">
              <h2>Edit Product Description</h2>
              <ProductDescriptionEditor />
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
              <ProductList products={products} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
