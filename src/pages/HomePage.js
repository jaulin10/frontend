import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page fade-in">
      <div className="hero-section">
        <h1>Welcome to Brewbean's</h1>
        <p className="hero-subtitle">
          Discover our premium selection of coffees and accessories
        </p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">
            See Our Products
          </Link>
          <Link to="/basket" className="btn btn-secondary ml-2">
            My Basket
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="grid grid-3">
          <div className="feature-card card">
            <div className="card-body text-center">
              <div className="feature-icon">☕</div>
              <h3>Premium Coffee</h3>
              <p>
                Selection of high-quality coffee beans from around the world
              </p>
            </div>
          </div>
          <div className="feature-card card">
            <div className="card-body text-center">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Free shipping on orders over $50</p>
            </div>
          </div>
          <div className="feature-card card">
            <div className="card-body text-center">
              <div className="feature-icon">💝</div>
              <h3>Satisfaction Guarantee</h3>
              <p>Free returns within 30 days if you're not satisfied</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="card">
          <div className="card-body text-center">
            <h2>Ready to Order?</h2>
            <p>Explore our full range of products and accessories</p>
            <Link to="/products" className="btn btn-primary btn-lg mt-2">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
