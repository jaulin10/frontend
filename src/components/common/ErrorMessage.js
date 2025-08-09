// src/components/common/ErrorMessage.js
import React from "react";

const ErrorMessage = ({ message, onClose, type = "error" }) => {
  if (!message) return null;

  const getIconForType = (type) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      default:
        return "❌";
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case "warning":
        return {
          background: "#fff3cd",
          border: "#ffeaa7",
          color: "#856404",
        };
      case "info":
        return {
          background: "#d1ecf1",
          border: "#bee5eb",
          color: "#0c5460",
        };
      case "success":
        return {
          background: "#d4edda",
          border: "#c3e6cb",
          color: "#155724",
        };
      default:
        return {
          background: "#f8d7da",
          border: "#f5c6cb",
          color: "#721c24",
        };
    }
  };

  const colors = getColorForType(type);

  return (
    <div
      className="error-message"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 15px",
        margin: "10px 0",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: "5px",
        color: colors.color,
        fontSize: "14px",
        lineHeight: "1.4",
        position: "relative",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: "18px" }}>{getIconForType(type)}</span>

      <span style={{ flex: 1 }}>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: colors.color,
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "0",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
          title="Fermer"
        >
          ×
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-message {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .error-message {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;
