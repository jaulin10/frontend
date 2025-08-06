import React, { useState } from "react";
import StockReport from "../components/reports/StockReport";
import PurchaseReport from "../components/reports/PurchaseReport";
import "../styles/pages/ReportsPage.css";

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState("stock");

  const reports = [
    { id: "stock", label: "Rapport de Stock", icon: "📦" },
    { id: "purchase", label: "Rapport des Achats", icon: "💳" },
  ];

  return (
    <div className="reports-page fade-in">
      <h1>Rapports et Analyses</h1>
      <p>Consultez les rapports détaillés de votre boutique</p>

      <div className="reports-container">
        <div className="report-tabs">
          {reports.map((report) => (
            <button
              key={report.id}
              className={`tab-button ${
                activeReport === report.id ? "active" : ""
              }`}
              onClick={() => setActiveReport(report.id)}
            >
              <span className="tab-icon">{report.icon}</span>
              {report.label}
            </button>
          ))}
        </div>

        <div className="report-content">
          {activeReport === "stock" && (
            <div className="report-section">
              <h2>Rapport de Vérification du Stock</h2>
              <p>Vérifiez si tous les articles d'un panier sont en stock</p>
              <StockReport />
            </div>
          )}

          {activeReport === "purchase" && (
            <div className="report-section">
              <h2>Rapport des Achats par Client</h2>
              <p>Consultez le total des dépenses de chaque client</p>
              <PurchaseReport />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
