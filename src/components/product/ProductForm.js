import React, { useState } from "react";
import { useForm } from "react-hook-form";
import productService from "../../services/productService";
import "../../styles/components/ProductManager.css";

const ProductForm = ({ onProductAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      // 🔍 Debug: Vérifiez les données
      console.log("Données du formulaire:", data);

      // 🛠️ Préparer les données selon le format attendu par le backend
      const productData = {
        productName: data.productName,
        description: data.description,
        imageUrl: data.productImage || null, // Correspond au champ backend
        price: parseFloat(data.price),
        stock: parseInt(data.stock) || 0, // ✅ Ajout du stock
        active: data.active || false,
        category: data.category || null,
        type: data.type || null,
      };

      console.log("Données envoyées au backend:", productData);

      // ✅ Utiliser le service au lieu d'axios direct
      const response = await productService.createProduct(productData);

      setMessage("Produit ajouté avec succès!");
      reset();

      // Notifier le parent component
      if (onProductAdded) {
        onProductAdded(response);
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'ajout du produit";
      setMessage("Erreur: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            className="form-input"
            {...register("productName", {
              required: "Product name is required",
              maxLength: {
                value: 25,
                message: "Product name cannot exceed 25 characters",
              },
            })}
          />
          {errors.productName && (
            <span className="error-message">{errors.productName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Product description (optional)"
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description cannot exceed 100 characters",
              },
            })}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Price *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            placeholder="0.00"
            {...register("price", {
              required: "Price is required",
              min: {
                value: 0.01,
                message: "Price must be greater than 0",
              },
            })}
          />
          {errors.price && (
            <span className="error-message">{errors.price.message}</span>
          )}
        </div>

        {/* ✅ NOUVEAU CHAMP: Stock */}
        <div className="form-group">
          <label className="form-label">Stock Quantity *</label>
          <input
            type="number"
            min="0"
            className="form-input"
            placeholder="0"
            {...register("stock", {
              required: "Stock quantity is required",
              min: {
                value: 0,
                message: "Stock cannot be negative",
              },
            })}
          />
          {errors.stock && (
            <span className="error-message">{errors.stock.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-input"
            placeholder="ex: Coffee, Equipment"
            {...register("category", {
              maxLength: {
                value: 20,
                message: "Category cannot exceed 20 characters",
              },
            })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-input" {...register("type")}>
            <option value="">Select type (optional)</option>
            <option value="P">Physical Product</option>
            <option value="D">Digital Product</option>
            <option value="S">Service</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Image (file name)</label>
          <input
            type="text"
            className="form-input"
            placeholder="ex: roasted.jpg"
            {...register("productImage")}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" {...register("active")} defaultChecked />
            Active Product
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>

        {message && (
          <div
            className={`alert ${
              message.includes("succès") ? "alert-success" : "alert-error"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
