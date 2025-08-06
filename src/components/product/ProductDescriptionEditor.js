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
      console.error("Erreur lors du chargement des produits:", error);
      setMessage("Erreur lors du chargement des produits");
    } finally {
      setLoadingProducts(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedProduct) {
      setMessage("Veuillez sélectionner un produit");
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

      setMessage("Description mise à jour avec succès!");

      // Mettre à jour la liste des produits
      setProducts((prev) =>
        prev.map((product) =>
          (product.id || product.idproduct) ===
          (selectedProduct.id || selectedProduct.idproduct)
            ? { ...product, description: data.newDescription }
            : product
        )
      );

      // Mettre à jour la description courante affichée
      setValue("currentDescription", data.newDescription);

      // Réinitialiser le champ nouvelle description
      setValue("newDescription", "");
    } catch (error) {
      setMessage("Erreur lors de la mise à jour: " + error.message);
      console.error("Erreur:", error);
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
          <label className="form-label">Sélectionner un Produit *</label>
          {loadingProducts ? (
            <div className="loading-text">Chargement des produits...</div>
          ) : (
            <select
              className="form-select"
              {...register("productId", {
                required: "Veuillez sélectionner un produit",
              })}
            >
              <option value="">-- Choisir un produit --</option>
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
              <h4>Informations du Produit</h4>
              <div className="product-details">
                <p>
                  <strong>ID:</strong>{" "}
                  {selectedProduct.id || selectedProduct.idproduct}
                </p>
                <p>
                  <strong>Nom:</strong> {selectedProduct.productname}
                </p>
                <p>
                  <strong>Prix:</strong> $
                  {parseFloat(selectedProduct.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Description Actuelle</label>
          <textarea
            className="form-input current-description"
            rows="3"
            readOnly
            {...register("currentDescription")}
            placeholder={
              selectedProduct
                ? "Description actuelle du produit..."
                : "Sélectionnez un produit pour voir sa description"
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nouvelle Description *</label>
          <textarea
            className="form-input"
            rows="4"
            placeholder="Entrez la nouvelle description du produit..."
            {...register("newDescription", {
              required: "La nouvelle description est requise",
              minLength: {
                value: 10,
                message: "La description doit contenir au moins 10 caractères",
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
            {loading ? "🔄 Mise à jour..." : "💾 Mettre à jour la Description"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary ml-2"
          >
            🗑️ Réinitialiser
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
