import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import productService from "../../services/productService";
import basketService from "../../services/basketService";
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
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setFetchingData(true);
    await Promise.all([fetchProducts(), fetchBaskets()]);
    setFetchingData(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      console.log("Products loaded:", response);
      setProducts(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    }
  };

  const fetchBaskets = async () => {
    try {
      const response = await basketService.getAllBaskets();
      console.log("Baskets loaded:", response);
      setBaskets(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error loading baskets:", error);
      setBaskets([]);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const basketItemData = {
        basketId: parseInt(data.basketId),
        productId: parseInt(data.productId),
        quantity: parseInt(data.quantity),
        price: parseFloat(data.price),
        sizeCode: parseInt(data.sizeCode),
        formCode: parseInt(data.formCode),
      };

      console.log("Sending basket item data:", basketItemData);

      await basketService.addItemToBasket(basketItemData);

      setMessage("Article ajouté au panier avec succès!");
      reset();
      if (onItemAdded) onItemAdded();
    } catch (error) {
      console.error("Error adding item:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'ajout";
      setMessage("Erreur: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill price when product is selected
  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find(
      (p) => (p.id || p.idproduct).toString() === productId
    );

    if (selectedProduct) {
      // Auto-fill price from selected product
      const priceInput = document.querySelector('input[name="price"]');
      if (priceInput) {
        priceInput.value = selectedProduct.price || 0;
      }
    }
  };

  if (fetchingData) {
    return (
      <div className="basket-item-form">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="basket-item-form">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Basket *</label>
          <select
            className="form-select"
            {...register("basketId", { required: "Select a basket" })}
          >
            <option value="">-- Choose a basket --</option>
            {Array.isArray(baskets) && baskets.length > 0 ? (
              baskets.map((basket) => (
                <option key={basket.id} value={basket.id}>
                  Basket #{basket.id} - ${(basket.total || 0).toFixed(2)}
                  {basket.shopperId && ` (Shopper ${basket.shopperId})`}
                </option>
              ))
            ) : (
              <option disabled>No baskets available</option>
            )}
          </select>
          {errors.basketId && (
            <span className="error-message">{errors.basketId.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Product *</label>
          <select
            className="form-select"
            {...register("productId", { required: "Sélectionnez un produit" })}
            onChange={handleProductChange}
          >
            <option value="">-- Choose a product --</option>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <option
                  key={product.id || product.idproduct}
                  value={product.id || product.idproduct}
                >
                  {product.productName ||
                    product.productname ||
                    "Produit sans nom"}{" "}
                  - ${product.price || 0}
                </option>
              ))
            ) : (
              <option disabled>No products available</option>
            )}
          </select>
          {errors.productId && (
            <span className="error-message">{errors.productId.message}</span>
          )}
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              min="1"
              className="form-input"
              {...register("quantity", {
                required: "Quantité requise",
                min: { value: 1, message: "Minimum 1" },
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
              {...register("price", {
                required: "Prix requis",
                min: { value: 0.01, message: "Prix doit être > 0" },
              })}
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
              {...register("sizeCode", { required: "select size" })}
            >
              <option value="">-- Size --</option>
              <option value="1">Small (1)</option>
              <option value="2">Large (2)</option>
            </select>
            {errors.sizeCode && (
              <span className="error-message">{errors.sizeCode.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Format *</label>
            <select
              className="form-select"
              {...register("formCode", { required: "select format" })}
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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || fetchingData}
        >
          {loading ? "Adding in progress..." : "Add Item to Basket"}
        </button>

        {message && (
          <div
            className={`alert ${
              message.includes("success") ? "alert-success" : "alert-error"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      {/* Status indicator */}
      <div
        style={{
          marginTop: "10px",
          padding: "8px",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#155724",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>✅ API connectée</span>
        <span>
          {products.length} produits • {baskets.length} paniers
        </span>
      </div>
    </div>
  );
};

export default BasketItemForm;
