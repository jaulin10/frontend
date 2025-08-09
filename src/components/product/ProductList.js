import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import "../../styles/components/ProductManager.css";

const ProductList = ({
  products: externalProducts,
  loading: externalLoading,
  onEdit,
  onDelete: externalOnDelete,
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
      const response = await productService.getAllProducts();
      console.log("Produits récupérés:", response);
      setProducts(response || []);
    } catch (error) {
      const errorMessage = error.message || "Error loading products";
      setError(errorMessage);
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId);
        setProducts((prev) =>
          prev.filter((p) => (p.id || p.idproduct) !== productId)
        );

        // Appeler la fonction de suppression externe si fournie
        if (externalOnDelete) {
          externalOnDelete(productId);
        }
      } catch (error) {
        setError("Error deleting product: " + error.message);
      }
    }
  };

  const handleEdit = (product) => {
    if (onEdit) {
      onEdit(product);
    } else {
      console.log("Edit product:", product);
      // You can add your edit logic here
    }
  };

  // Simple ErrorMessage component if not available
  const SimpleErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 15px",
          margin: "10px 0",
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
          borderLeft: "4px solid #dc3545",
          borderRadius: "5px",
          color: "#721c24",
          fontSize: "14px",
        }}
      >
        <span>❌</span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#721c24",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ×
          </button>
        )}
      </div>
    );
  };

  // Composant LoadingSpinner simple si pas disponible
  const SimpleLoadingSpinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  if (loading || externalLoading) {
    return LoadingSpinner ? <LoadingSpinner /> : <SimpleLoadingSpinner />;
  }

  return (
    <div className="product-list">
      {error &&
        (ErrorMessage ? (
          <ErrorMessage message={error} onClose={() => setError("")} />
        ) : (
          <SimpleErrorMessage message={error} onClose={() => setError("")} />
        ))}

      <div
        className="list-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Products ({products.length})</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchProducts}
            className="btn btn-secondary"
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <p style={{ fontSize: "18px", color: "#6c757d", margin: 0 }}>
            😕 No products found
          </p>
          <button
            onClick={fetchProducts}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Recharger
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Image
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Stock
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const productId = product.id || product.idproduct;
                const stockInfo = productService.formatStock(product.stock);
                const statusInfo = productService.getProductStatus(product);

                return (
                  <tr
                    key={productId || index}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "12px" }}>{productId}</td>
                    <td style={{ padding: "12px" }}>
                      {product.productimage ? (
                        <img
                          src={productService.getImageUrl(product.productimage)}
                          alt={product.productName}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #dee2e6",
                          }}
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                          }}
                        >
                          📷
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>
                      {product.productName}
                    </td>
                    <td
                      style={{ padding: "12px", maxWidth: "200px" }}
                      title={product.description}
                    >
                      {productService.truncateDescription(
                        product.description,
                        50
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        color: "#28a745",
                      }}
                    >
                      {productService.formatPrice(product.price)}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: stockInfo.isLow
                            ? "#fff3cd"
                            : "#d4edda",
                          color: stockInfo.isLow ? "#856404" : "#155724",
                          border: `1px solid ${
                            stockInfo.isLow ? "#ffeaa7" : "#c3e6cb"
                          }`,
                        }}
                      >
                        {stockInfo.display}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            statusInfo.status === "active"
                              ? "#d4edda"
                              : "#f8d7da",
                          color: statusInfo.color,
                          border: `1px solid ${
                            statusInfo.status === "active"
                              ? "#c3e6cb"
                              : "#f5c6cb"
                          }`,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(product)}
                          title="Modifier"
                          style={{
                            background: "none",
                            border: "1px solid #007bff",
                            borderRadius: "4px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          title="Supprimer"
                          style={{
                            background: "none",
                            border: "1px solid #dc3545",
                            borderRadius: "4px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
