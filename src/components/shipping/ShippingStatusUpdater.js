// src/components/shipping/ShippingStatusUpdater.js
import React, { useState, useEffect } from "react";
import shippingService from "../../services/shippingService";

const ShippingStatusUpdater = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Composants simples intégrés
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

  // Statuts disponibles
  const statusOptions = [
    { value: 1, label: "En attente" },
    { value: 2, label: "En traitement" },
    { value: 3, label: "Expédié" },
    { value: 4, label: "En transit" },
    { value: 5, label: "Livré" },
    { value: 6, label: "Annulé" },
  ];

  useEffect(() => {
    loadActiveShipments();
  }, []);

  const loadActiveShipments = async () => {
    setLoading(true);
    try {
      const activeShipments = await shippingService.getActiveShipments();
      setShipments(activeShipments);
    } catch (err) {
      setError("Erreur lors du chargement des expéditions");
    } finally {
      setLoading(false);
    }
  };

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.shippingStatus?.toString() || "");
    setError(null);
    setSuccessMessage("");
  };

  const updateStatus = async () => {
    if (!selectedShipment || !newStatus) {
      setError("Veuillez sélectionner un statut");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await shippingService.updateShippingStatus(
        selectedShipment.id,
        parseInt(newStatus)
      );
      setSuccessMessage("Statut mis à jour avec succès!");

      // Recharger les expéditions
      await loadActiveShipments();

      // Mettre à jour l'expédition sélectionnée
      const updatedShipment = {
        ...selectedShipment,
        shippingStatus: parseInt(newStatus),
      };
      setSelectedShipment(updatedShipment);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const markAsShipped = async () => {
    if (!selectedShipment) return;

    setLoading(true);
    try {
      await shippingService.markAsShipped(selectedShipment.id);
      setSuccessMessage("Expédition marquée comme expédiée!");
      await loadActiveShipments();

      const updatedShipment = { ...selectedShipment, shippingStatus: 3 };
      setSelectedShipment(updatedShipment);
      setNewStatus("3");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async () => {
    if (!selectedShipment) return;

    setLoading(true);
    try {
      await shippingService.markAsDelivered(selectedShipment.id);
      setSuccessMessage("Expédition marquée comme livrée!");
      await loadActiveShipments();

      const updatedShipment = { ...selectedShipment, shippingStatus: 5 };
      setSelectedShipment(updatedShipment);
      setNewStatus("5");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const trackShipment = async () => {
    if (!trackingNumber.trim()) {
      setError("Veuillez entrer un numéro de suivi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const shipment = await shippingService.trackShipment(trackingNumber);
      setSelectedShipment(shipment);
      setNewStatus(shipment.shippingStatus?.toString() || "");
      setSuccessMessage("Expédition trouvée!");
    } catch (err) {
      setError("Expédition non trouvée ou erreur de suivi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shipping-status-updater">
      <h3>📦 Mise à jour des Statuts d'Expédition</h3>

      {/* Section de suivi */}
      <div className="tracking-section">
        <h4>🔍 Suivi par numéro</h4>
        <div className="tracking-form">
          <input
            type="text"
            placeholder="Entrez le numéro de suivi..."
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="tracking-input"
          />
          <button
            onClick={trackShipment}
            disabled={loading}
            className="btn btn-primary"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Liste des expéditions actives */}
      <div className="shipments-section">
        <h4>📋 Expéditions actives ({shipments.length})</h4>
        {loading && <LoadingSpinner />}

        {shipments.length > 0 && (
          <div className="shipments-list">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`shipment-item ${
                  selectedShipment?.id === shipment.id ? "selected" : ""
                }`}
                onClick={() => handleShipmentSelect(shipment)}
              >
                <div className="shipment-info">
                  <span className="shipment-id">ID: {shipment.id}</span>
                  <span
                    className="shipment-status"
                    style={{
                      color: shippingService.getStatusColor(
                        shipment.shippingStatus
                      ),
                    }}
                  >
                    {shippingService.getStatusDescription(
                      shipment.shippingStatus
                    )}
                  </span>
                </div>
                <div className="shipment-details">
                  {shipment.shippingMethod && (
                    <span className="method">
                      Méthode: {shipment.shippingMethod}
                    </span>
                  )}
                  {shipment.trackingNumber && (
                    <span className="tracking">
                      Suivi: {shipment.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section de mise à jour */}
      {selectedShipment && (
        <div className="update-section">
          <h4>✏️ Mettre à jour l'expédition #{selectedShipment.id}</h4>

          <div className="current-status">
            <strong>Statut actuel: </strong>
            <span
              style={{
                color: shippingService.getStatusColor(
                  selectedShipment.shippingStatus
                ),
              }}
            >
              {shippingService.getStatusDescription(
                selectedShipment.shippingStatus
              )}
            </span>
          </div>

          <div className="update-form">
            <div className="form-group">
              <label htmlFor="newStatus">Nouveau statut:</label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="">Sélectionner un statut...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="action-buttons">
              <button
                onClick={updateStatus}
                disabled={loading || !newStatus}
                className="btn btn-primary"
              >
                Mettre à jour
              </button>

              <button
                onClick={markAsShipped}
                disabled={loading || selectedShipment.shippingStatus >= 3}
                className="btn btn-success"
              >
                Marquer expédié
              </button>

              <button
                onClick={markAsDelivered}
                disabled={loading || selectedShipment.shippingStatus === 5}
                className="btn btn-success"
              >
                Marquer livré
              </button>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="shipment-details-full">
            <h5>📋 Détails de l'expédition</h5>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Méthode:</strong>{" "}
                {selectedShipment.shippingMethod || "Non définie"}
              </div>
              <div className="detail-item">
                <strong>Coût:</strong>{" "}
                {shippingService.formatPrice(selectedShipment.shipCost)}
              </div>
              <div className="detail-item">
                <strong>Date prévue:</strong>
                {shippingService.formatDate(selectedShipment.shipDateExpected)}
              </div>
              <div className="detail-item">
                <strong>Date réelle:</strong>
                {shippingService.formatDate(selectedShipment.shipDateActual)}
              </div>
              <div className="detail-item">
                <strong>Numéro de suivi:</strong>
                {selectedShipment.trackingNumber || "Non attribué"}
              </div>
              <div className="detail-item">
                <strong>Créé le:</strong>
                {shippingService.formatDate(selectedShipment.dateCreated)}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
          <button onClick={() => setSuccessMessage("")} className="close-btn">
            ×
          </button>
        </div>
      )}

      <style jsx>{`
        .shipping-status-updater {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .tracking-section,
        .shipments-section,
        .update-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .tracking-form {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .tracking-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .shipments-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .shipment-item {
          padding: 15px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .shipment-item:hover {
          background-color: #f0f8ff;
          border-color: #007bff;
        }

        .shipment-item.selected {
          background-color: #e3f2fd;
          border-color: #007bff;
          border-width: 2px;
        }

        .shipment-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .shipment-id {
          font-weight: bold;
          color: #333;
        }

        .shipment-status {
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.8);
        }

        .shipment-details {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #666;
        }

        .current-status {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
        }

        .update-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .status-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #218838;
        }

        .shipment-details-full {
          margin-top: 20px;
          padding: 15px;
          background-color: white;
          border-radius: 5px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .detail-item {
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 3px;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #155724;
        }

        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .tracking-form {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default ShippingStatusUpdater;
