import React from "react";
import "../../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Brewbean's Coffee Shop</h4>
          <p>Your trusted online coffee shop</p>
        </div>
        <div className="footer-section">
          <h5>Contact</h5>
          <p>Email: info@brewbeans.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h5>Opening Hours</h5>
          <p>Mon-Fri: 7:00 AM - 7:00 PM</p>
          <p>Sat-Sun: 8:00 AM - 6:00 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Brewbean's Coffee Shop. All rights reserved..</p>
      </div>
    </footer>
  );
};

export default Footer;
