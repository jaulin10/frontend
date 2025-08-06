import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import "../../styles/components/ProductManager.css";

const ProductList = ({
  products: externalProducts,
  loading: externalLoading,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
    } else {
      fetchProducts();
    }
  }, [externalProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      setError("Error loading products: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (error) {
        setError("Error deleting product: " + error.message);
      }
    }
  };

  if (loading || externalLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list">
      {error && <div className="alert alert-error mb-3">{error}</div>}

      <div className="list-header flex-between mb-3">
        <h3>Products ({products.length})</h3>
        <button onClick={fetchProducts} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-data">
          <p>No products found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id || product.idproduct}>
                  <td>{product.id || product.idproduct}</td>
                  <td>
                    {product.productimage ? (
                      <img
                        src={`/images/products/${product.productimage}`}
                        alt={product.productname}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    ) : (
                      <div className="no-image">📷</div>
                    )}
                  </td>
                  <td className="font-weight-bold">{product.productname}</td>
                  <td className="description-cell" title={product.description}>
                    {product.description?.substring(0, 50)}
                    {product.description?.length > 50 ? "..." : ""}
                  </td>
                  <td className="price-cell">
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`stock-badge ${
                        product.stock < 10 ? "low-stock" : ""
                      }`}
                    >
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        product.active ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {product.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        title="Modifier"
                        onClick={() => console.log("Edit product:", product.id)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        title="Supprimer"
                        onClick={() =>
                          handleDelete(product.id || product.idproduct)
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
