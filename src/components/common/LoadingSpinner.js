// src/components/common/LoadingSpinner.js
import React from "react";

const LoadingSpinner = ({
  size = "medium",
  message = "Chargement...",
  color = "#007bff",
  overlay = false,
}) => {
  const getSizeStyles = (size) => {
    switch (size) {
      case "small":
        return { width: "20px", height: "20px", borderWidth: "2px" };
      case "large":
        return { width: "60px", height: "60px", borderWidth: "6px" };
      default:
        return { width: "40px", height: "40px", borderWidth: "4px" };
    }
  };

  const sizeStyles = getSizeStyles(size);

  const spinnerStyle = {
    ...sizeStyles,
    border: `${sizeStyles.borderWidth} solid #f3f3f3`,
    borderTop: `${sizeStyles.borderWidth} solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "20px",
    ...(overlay && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      zIndex: 9999,
      backdropFilter: "blur(2px)",
    }),
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>

      {message && (
        <div
          style={{
            color: "#666",
            fontSize:
              size === "small" ? "12px" : size === "large" ? "18px" : "14px",
            fontWeight: "500",
            textAlign: "center",
            maxWidth: "200px",
            lineHeight: "1.4",
          }}
        >
          {message}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

// Composant pour les spinners en ligne
export const InlineSpinner = ({ size = "small", color = "#007bff" }) => {
  const sizeStyles = {
    small: { width: "16px", height: "16px", borderWidth: "2px" },
    medium: { width: "20px", height: "20px", borderWidth: "2px" },
  };

  const style = sizeStyles[size] || sizeStyles.small;

  return (
    <div
      style={{
        display: "inline-block",
        ...style,
        border: `${style.borderWidth} solid #f3f3f3`,
        borderTop: `${style.borderWidth} solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        verticalAlign: "middle",
        marginRight: "8px",
      }}
    >
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
};

// Composant pour les spinners avec texte personnalisable
export const CustomSpinner = ({
  children,
  loading = true,
  size = "medium",
  color = "#007bff",
}) => {
  if (!loading) return children;

  return (
    <div
      style={{
        position: "relative",
        opacity: 0.6,
        pointerEvents: "none",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <LoadingSpinner size={size} color={color} message="" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
