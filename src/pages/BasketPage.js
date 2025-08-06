import React, { useState } from "react";
import BasketManager from "../components/basket/BasketManager";
import BasketItemForm from "../components/basket/BasketItemForm";
import "../styles/pages/BasketPage.css";

const BasketPage = () => {
  const [refreshBasket, setRefreshBasket] = useState(0);

  const handleItemAdded = () => {
    setRefreshBasket((prev) => prev + 1);
  };

  return (
    <div className="basket-page fade-in">
      <h1>Gestion du Panier</h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Ajouter un Article au Panier</h3>
          </div>
          <div className="card-body">
            <BasketItemForm onItemAdded={handleItemAdded} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Contenu du Panier</h3>
          </div>
          <div className="card-body">
            <BasketManager key={refreshBasket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
