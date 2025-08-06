import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../styles/components/ProductManager.css";

const ProductDescriptionEditor = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const watchedProductId = watch("productId");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (watchedProductId && products.length > 0) {
      const product = products.find(
        (p) => p.id === watchedProductId || p.idproduct === watchedProductId
      );
      if (product) {
        setSelectedProduct(product);
        setValue("currentDescription", product.description || "");
      }
    } else {
      setSelectedProduct(null);
      setValue("currentDescription", "");
    }
  }, [watchedProductId, products, setValue]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      setMessage("Error loading products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedProduct) {
      setMessage("Please select a product to update.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `/products/${
          selectedProduct.id || selectedProduct.idproduct
        }/description`,
        {
          description: data.newDescription,
        }
      );

      setMessage("Description updated successfully!");

      // Update the product list
      setProducts((prev) =>
        prev.map((product) =>
          (product.id || product.idproduct) ===
          (selectedProduct.id || selectedProduct.idproduct)
            ? { ...product, description: data.newDescription }
            : product
        )
      );

      // Update the currently displayed description
      setValue("currentDescription", data.newDescription);

      // Reset the new description field
      setValue("newDescription", "");
    } catch (error) {
      setMessage("Error updating description: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedProduct(null);
    setMessage("");
  };

  return (
    <div className="description-editor">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Select a Product *</label>
          {loadingProducts ? (
            <div className="loading-text">Loading products...</div>
          ) : (
            <select
              className="form-select"
              {...register("productId", {
                required: "Please select a product",
              })}
            >
              <option value="">-- Choose a product --</option>
              {products.map((product) => (
                <option
                  key={product.id || product.idproduct}
                  value={product.id || product.idproduct}
                >
                  {product.productname} (ID: {product.id || product.idproduct})
                </option>
              ))}
            </select>
          )}
          {errors.productId && (
            <span className="error-message">{errors.productId.message}</span>
          )}
        </div>

        {selectedProduct && (
          <div className="product-info">
            <div className="info-card">
              <h4>Product Information</h4>
              <div className="product-details">
                <p>
                  <strong>ID:</strong>{" "}
                  {selectedProduct.id || selectedProduct.idproduct}
                </p>
                <p>
                  <strong>Name:</strong> {selectedProduct.productname}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {parseFloat(selectedProduct.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Current Description</label>
          <textarea
            className="form-input current-description"
            rows="3"
            readOnly
            {...register("currentDescription")}
            placeholder={
              selectedProduct
                ? "Current product description..."
                : "Select a product to see its description"
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Description *</label>
          <textarea
            className="form-input"
            rows="4"
            placeholder="Enter the new product description..."
            {...register("newDescription", {
              required: "New description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              },
            })}
          />
          {errors.newDescription && (
            <span className="error-message">
              {errors.newDescription.message}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !selectedProduct}
          >
            {loading ? "🔄 Updating..." : "💾 Update Description"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary ml-2"
          >
            🗑️ Reset
          </button>
        </div>

        {message && (
          <div
            className={`alert ${
              message.includes("succès") ? "alert-success" : "alert-error"
            } mt-3`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductDescriptionEditor;
