import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/Navigation.css";

const Navigation = () => {
  const navItems = [
    { path: "/", label: "Accueil", icon: "🏠" },
    { path: "/products", label: "Produits", icon: "☕" },
    { path: "/basket", label: "Panier", icon: "🛒" },
    { path: "/admin", label: "Administration", icon: "⚙️" },
    { path: "/reports", label: "Rapports", icon: "📊" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h3>Navigation</h3>
      </div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
