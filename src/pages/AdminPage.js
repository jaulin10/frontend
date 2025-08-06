import React, { useState } from "react";
import TaxCalculator from "../components/tax/TaxCalculator";
import ShippingStatusUpdater from "../components/shipping/ShippingStatusUpdater";
import SaleChecker from "../components/sale/SaleChecker";
import "../styles/pages/AdminPage.css";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("tax");

  const sections = [
    { id: "tax", label: "Tax Calculation", icon: "💰" },
    { id: "shipping", label: "Delivery Status", icon: "🚚" },
    { id: "sales", label: "Promotion Verification", icon: "🏷️" },
  ];

  return (
    <div className="admin-page fade-in">
      <h1>Administration</h1>
      <p>Manage the administrative aspects of your store</p>

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
              <h2>Tax Calculation</h2>
              <TaxCalculator />
            </div>
          )}

          {activeSection === "shipping" && (
            <div className="admin-section">
              <h2>Delivery Status Update</h2>
              <ShippingStatusUpdater />
            </div>
          )}

          {activeSection === "sales" && (
            <div className="admin-section">
              <h2>Promotion Verification</h2>
              <SaleChecker />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
