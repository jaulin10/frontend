import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import "../../styles/components/BasketManager.css";

const BasketManager = () => {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBaskets();
  }, []);

  const fetchBaskets = async () => {
    try {
      const response = await axios.get("/baskets");
      setBaskets(response.data);
    } catch (error) {
      setError("Error loading carts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="basket-manager">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="baskets-list">
        {baskets.length === 0 ? (
          <p>No baskets found</p>
        ) : (
          baskets.map((basket) => (
            <div key={basket.id} className="basket-item card">
              <div className="card-body">
                <h4>Basket #{basket.id}</h4>
                <p>Total: ${basket.total || 0}</p>
                <p>Items: {basket.quantity || 0}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BasketManager;
