import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/Navigation.css";

const Navigation = ({ backendConnected = false }) => {
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: "🏠",
      description: "Page d'accueil",
    },
    {
      path: "/products",
      label: "Products",
      icon: "☕",
      description: "Gestion des produits",
    },
    {
      path: "/basket",
      label: "Basket",
      icon: "🛒",
      description: "Gestion du panier",
      requiresBackend: true,
    },
    {
      path: "/admin",
      label: "Administration",
      icon: "⚙️",
      description: "Administration",
      requiresBackend: true,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "📊",
      description: "Rapports et statistiques",
      requiresBackend: true,
    },
    {
      path: "/connection-test",
      label: "API Test",
      icon: "🔗",
      description: "Test de connexion backend",
      isSpecial: true,
    },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h3>🍺 BB Brewery</h3>
        <span className="nav-subtitle">Navigation</span>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => {
                let className = `nav-link ${isActive ? "active" : ""}`;

                // Ajouter la classe disabled si backend requis mais déconnecté
                if (item.requiresBackend && !backendConnected) {
                  className += " disabled";
                }

                // Ajouter la classe special pour le test de connexion
                if (item.isSpecial) {
                  className += " special";
                }

                return className;
              }}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>

              {/* Indicateur si backend requis mais déconnecté */}
              {item.requiresBackend && !backendConnected && (
                <span
                  className="status-indicator offline"
                  title="Nécessite une connexion backend"
                >
                  ⚠️
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Section statut backend */}
      <div className="nav-footer">
        <div className="backend-status">
          <span className="status-label">Backend:</span>
          <span
            className={`status-badge ${
              backendConnected ? "online" : "offline"
            }`}
          >
            {backendConnected ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>
        <div className="app-version">
          <small>v1.0.0</small>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
