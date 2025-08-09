// src/components/tax/TaxCalculator.js
import React, { useState, useEffect } from "react";
import taxService from "../../services/taxService";

const TaxCalculator = () => {
  const [formData, setFormData] = useState({
    amount: "",
    state: "",
  });
  const [result, setResult] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les états disponibles au montage du composant
  useEffect(() => {
    loadAvailableStates();
  }, []);

  const loadAvailableStates = async () => {
    try {
      const states = await taxService.getAvailableStates();
      setAvailableStates(states);
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to load available states");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Réinitialiser le résultat si on change les valeurs
    if (result) {
      setResult(null);
    }
  };

  const calculateTax = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.state) {
      setError("Please fill in all fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const calculationResult = await taxService.calculateTotalWithTax(
        amount,
        formData.state
      );
      setResult(calculationResult);
    } catch (err) {
      setError(err.message || "Error calculating tax");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ amount: "", state: "" });
    setResult(null);
    setError(null);
  };

  // Composant LoadingSpinner simple intégré
  const LoadingSpinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  // Composant ErrorMessage simple intégré
  const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 15px",
          margin: "10px 0",
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
          borderLeft: "4px solid #dc3545",
          borderRadius: "5px",
          color: "#721c24",
          fontSize: "14px",
        }}
      >
        <span>❌</span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#721c24",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="tax-calculator">
      <h3>🧮 Taxes Calculator</h3>

      <form onSubmit={calculateTax} className="tax-form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount..."
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">État:</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a state...</option>
            {availableStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Calcul en cours..." : "Calculate"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {result && (
        <div className="tax-result">
          <h4>📊 Calculation Result</h4>
          <div className="result-details">
            <div className="result-row">
              <span className="label">Subtotal:</span>
              <span className="value">
                {taxService.formatAmount(result.subtotal)}
              </span>
            </div>
            <div className="result-row">
              <span className="label">Tax Rate:</span>
              <span className="value">
                {taxService.formatRate(result.taxRate)}
              </span>
            </div>
            <div className="result-row">
              <span className="label">Tax Amount:</span>
              <span className="value">
                {taxService.formatAmount(result.taxAmount)}
              </span>
            </div>
            <div className="result-row total">
              <span className="label">Total with Tax:</span>
              <span className="value">
                {taxService.formatAmount(result.total)}
              </span>
            </div>
            <div className="result-row">
              <span className="label">State:</span>
              <span className="value">{result.state}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tax-calculator {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .tax-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #545b62;
        }

        .tax-result {
          background-color: white;
          border: 1px solid #28a745;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }

        .tax-result h4 {
          margin-top: 0;
          color: #28a745;
        }

        .result-details {
          margin-top: 15px;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .result-row.total {
          border-bottom: 2px solid #28a745;
          font-weight: bold;
          font-size: 1.1em;
          color: #28a745;
        }

        .result-row .label {
          color: #666;
        }

        .result-row .value {
          font-weight: bold;
          color: #333;
        }

        .result-row.total .value {
          color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default TaxCalculator;
