import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
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
      const response = await axios.post("/products", {
        productName: data.productName,
        description: data.description,
        productImage: data.productImage,
        price: parseFloat(data.price),
        active: data.active ? 1 : 0,
      });

      setMessage("Produit ajouté avec succès!");
      reset();
      if (onProductAdded) {
        onProductAdded((prev) => [...prev, response.data]);
      }
    } catch (error) {
      setMessage("Erreur lors de l'ajout du produit: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Nom du Produit *</label>
          <input
            type="text"
            className="form-input"
            {...register("productName", {
              required: "Le nom du produit est requis",
            })}
          />
          {errors.productName && (
            <span className="error-message">{errors.productName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-input"
            rows="3"
            {...register("description", {
              required: "La description est requise",
            })}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Image (nom du fichier)</label>
          <input
            type="text"
            className="form-input"
            placeholder="ex: roasted.jpg"
            {...register("productImage")}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Prix *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            {...register("price", { required: "Le prix est requis", min: 0 })}
          />
          {errors.price && (
            <span className="error-message">{errors.price.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" {...register("active")} defaultChecked />
            Produit actif
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Ajout en cours..." : "Ajouter le Produit"}
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
