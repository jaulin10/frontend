import React from "react";
import "../../styles/components/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img
            src="/images/coffee-beans.png"
            alt="Coffee Beans"
            className="logo-icon"
          />
          <h1 className="app-title">Brewbean's Coffee Shop</h1>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span>Welcome to our shop</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
