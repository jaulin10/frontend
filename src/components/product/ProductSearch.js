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
      setError("Erreur lors de la recherche: " + error.message);
      setSearchResults([]);
      console.error("Erreur de recherche:", error);
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
              placeholder="Entrez le nom du produit à rechercher..."
              {...register("searchTerm", { required: true })}
            />
            <button
              type="submit"
              className="btn btn-primary search-button"
              disabled={loading}
            >
              {loading ? "🔍 Recherche..." : "🔍 Rechercher"}
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
                Résultats de recherche
                {searchTerm && ` pour "${searchTerm}"`}({searchResults.length}{" "}
                produit{searchResults.length > 1 ? "s" : ""} trouvé
                {searchResults.length > 1 ? "s" : ""})
              </h3>
            </div>

            {searchResults.length > 0 ? (
              <ProductList products={searchResults} loading={false} />
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h4>Aucun produit trouvé</h4>
                <p>Essayez avec un autre terme de recherche</p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="search-placeholder">
            <div className="search-placeholder-icon">☕</div>
            <h4>Recherche de Produits</h4>
            <p>Entrez un nom de produit pour commencer la recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
