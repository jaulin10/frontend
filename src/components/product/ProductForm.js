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

      setMessage("Product added successfully!");
      reset();
      if (onProductAdded) {
        onProductAdded((prev) => [...prev, response.data]);
      }
    } catch (error) {
      setMessage("Error adding product: " + error.message);
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
              required: "Description is required",
            })}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
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
          <label className="form-label">Price *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            {...register("price", { required: "Price is required", min: 0 })}
          />
          {errors.price && (
            <span className="error-message">{errors.price.message}</span>
          )}
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
              message.includes("success") ? "alert-success" : "alert-error"
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
