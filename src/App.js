import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import des composants de pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import BasketPage from "./pages/BasketPage";
import AdminPage from "./pages/AdminPage";
import ReportsPage from "./pages/ReportsPage";

// Import des composants communs
import Header from "./components/common/Header";
import Navigation from "./components/common/Navigation";
import Footer from "./components/common/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/basket" element={<BasketPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
