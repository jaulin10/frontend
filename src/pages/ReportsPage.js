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
      <h1>Reports and Analytics</h1>
      <p>View detailed reports for your store</p>

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
              <h2>Stock Verification Report</h2>
              <p>Check if all items in a cart are in stock</p>
              <StockReport />
            </div>
          )}

          {activeReport === "purchase" && (
            <div className="report-section">
              <h2>Customer Purchase Report</h2>
              <p>View the total spending of each customer</p>
              <PurchaseReport />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
