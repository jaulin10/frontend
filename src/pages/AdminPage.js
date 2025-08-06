import React, { useState } from "react";
import TaxCalculator from "../components/tax/TaxCalculator";
import ShippingStatusUpdater from "../components/shipping/ShippingStatusUpdater";
import SaleChecker from "../components/sale/SaleChecker";
import "../styles/pages/AdminPage.css";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("tax");

  const sections = [
    { id: "tax", label: "Calcul des Taxes", icon: "💰" },
    { id: "shipping", label: "Statut Livraison", icon: "🚚" },
    { id: "sales", label: "Vérification Promotions", icon: "🏷️" },
  ];

  return (
    <div className="admin-page fade-in">
      <h1>Administration</h1>
      <p>Gérez les aspects administratifs de votre boutique</p>

      <div className="admin-sections">
        <div className="section-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`tab-button ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="tab-icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        <div className="section-content">
          {activeSection === "tax" && (
            <div className="admin-section">
              <h2>Calcul des Taxes</h2>
              <TaxCalculator />
            </div>
          )}

          {activeSection === "shipping" && (
            <div className="admin-section">
              <h2>Mise à jour du Statut de Livraison</h2>
              <ShippingStatusUpdater />
            </div>
          )}

          {activeSection === "sales" && (
            <div className="admin-section">
              <h2>Vérification des Promotions</h2>
              <SaleChecker />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
