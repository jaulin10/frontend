import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../styles/components/Forms.css";

const BasketItemForm = ({ onItemAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [baskets, setBaskets] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchBaskets();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }
  };

  const fetchBaskets = async () => {
    try {
      const response = await axios.get("/baskets");
      setBaskets(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des paniers:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/basket-items", {
        basketId: parseInt(data.basketId),
        productId: parseInt(data.productId),
        quantity: parseInt(data.quantity),
        price: parseFloat(data.price),
        sizeCode: parseInt(data.sizeCode),
        formCode: parseInt(data.formCode),
      });

      setMessage("Article ajouté au panier avec succès!");
      reset();
      if (onItemAdded) onItemAdded();
    } catch (error) {
      setMessage("Erreur lors de l'ajout: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basket-item-form">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Panier *</label>
          <select
            className="form-select"
            {...register("basketId", { required: "Sélectionnez un panier" })}
          >
            <option value="">-- Choisir un panier --</option>
            {baskets.map((basket) => (
              <option key={basket.id} value={basket.id}>
                Panier #{basket.id} - ${basket.total || 0}
              </option>
            ))}
          </select>
          {errors.basketId && (
            <span className="error-message">{errors.basketId.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Produit *</label>
          <select
            className="form-select"
            {...register("productId", { required: "Sélectionnez un produit" })}
          >
            <option value="">-- Choisir un produit --</option>
            {products.map((product) => (
              <option
                key={product.id || product.idproduct}
                value={product.id || product.idproduct}
              >
                {product.productname} - ${product.price}
              </option>
            ))}
          </select>
          {errors.productId && (
            <span className="error-message">{errors.productId.message}</span>
          )}
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Quantité *</label>
            <input
              type="number"
              min="1"
              className="form-input"
              {...register("quantity", {
                required: "Quantité requise",
                min: 1,
              })}
              defaultValue={1}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Prix *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              {...register("price", { required: "Prix requis", min: 0 })}
            />
            {errors.price && (
              <span className="error-message">{errors.price.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Taille *</label>
            <select
              className="form-select"
              {...register("sizeCode", { required: "Sélectionnez une taille" })}
            >
              <option value="">-- Taille --</option>
              <option value="1">Petit (1)</option>
              <option value="2">Grand (2)</option>
            </select>
            {errors.sizeCode && (
              <span className="error-message">{errors.sizeCode.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Format *</label>
            <select
              className="form-select"
              {...register("formCode", { required: "Sélectionnez un format" })}
            >
              <option value="">-- Format --</option>
              <option value="3">Moulu (3)</option>
              <option value="4">Grains entiers (4)</option>
            </select>
            {errors.formCode && (
              <span className="error-message">{errors.formCode.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Ajout..." : "Ajouter au Panier"}
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

export default BasketItemForm;
