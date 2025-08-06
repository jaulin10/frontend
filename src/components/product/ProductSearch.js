import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ProductList from "./ProductList";
import LoadingSpinner from "../common/LoadingSpinner";
import "../../styles/components/ProductManager.css";

const ProductSearch = () => {
  const { register, handleSubmit, reset } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setHasSearched(true);
    setSearchTerm(data.searchTerm);

    try {
      const response = await axios.get(`/products/search`, {
        params: {
          name: data.searchTerm,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      setError("Error while searching: " + error.message);
      setSearchResults([]);
      console.error("Error while searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setSearchResults([]);
    setHasSearched(false);
    setError("");
    setSearchTerm("");
  };

  return (
    <div className="product-search">
      <div className="search-form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Enter the name of the product to search for..."
              {...register("searchTerm", { required: true })}
            />
            <button
              type="submit"
              className="btn btn-primary search-button"
              disabled={loading}
            >
              {loading ? "🔍 Searching..." : "🔍 Search"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary clear-button"
            >
              🗑️ Effacer
            </button>
          </div>
        </form>

        {error && <div className="alert alert-error mt-3">{error}</div>}
      </div>

      <div className="search-results">
        {loading && <LoadingSpinner />}

        {hasSearched && !loading && (
          <div className="results-section">
            <div className="results-header">
              <h3>
                Search results
                {searchTerm && ` for "${searchTerm}"`}({searchResults.length}{" "}
                product{searchResults.length > 1 ? "s" : ""} found
                {searchResults.length > 1 ? "s" : ""})
              </h3>
            </div>

            {searchResults.length > 0 ? (
              <ProductList products={searchResults} loading={false} />
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h4>No products found</h4>
                <p>Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="search-placeholder">
            <div className="search-placeholder-icon">☕</div>
            <h4>Product Search</h4>
            <p>Enter a product name to start searching</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
