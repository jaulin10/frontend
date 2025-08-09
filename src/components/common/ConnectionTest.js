// src/components/common/ConnectionTest.js
import React, { useState, useEffect } from "react";
import { testConnection } from "../../services/api";
import taxService from "../../services/taxService";
import shippingService from "../../services/shippingService";

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus("checking");
    try {
      const result = await testConnection();
      setConnectionStatus(result.success ? "connected" : "error");
    } catch (error) {
      setConnectionStatus("error");
    }
  };

  const runTest = async (testName, testFunction) => {
    setTestResults((prev) => ({ ...prev, [testName]: { status: "running" } }));

    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;

      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: "success",
          duration,
          data: result,
          message: "Test réussi !",
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: "error",
          error: error.message,
          message: `Erreur: ${error.message}`,
        },
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    const tests = [
      {
        name: "connection",
        label: "Connexion Backend",
        test: () => testConnection(),
      },
      {
        name: "tax-configs",
        label: "API Tax - Configurations",
        test: () => taxService.getAllConfigurations(),
      },
      {
        name: "tax-states",
        label: "API Tax - États",
        test: () => taxService.getAvailableStates(),
      },
      {
        name: "tax-calc",
        label: "API Tax - Calcul",
        test: () => taxService.calculateTax(100, "VA"),
      },
      {
        name: "shipping-rates",
        label: "API Shipping - Tarifs",
        test: () => shippingService.getAllRates(),
      },
      {
        name: "shipping-methods",
        label: "API Shipping - Méthodes",
        test: () => shippingService.getAvailableMethods(),
      },
      {
        name: "shipping-calc",
        label: "API Shipping - Calcul",
        test: () => shippingService.calculateShippingCost(5, "standard"),
      },
    ];

    for (const test of tests) {
      await runTest(test.name, test.test);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "running":
        return "⏳";
      default:
        return "⚪";
    }
  };

  const getConnectionBadge = () => {
    const styles = {
      connected: { backgroundColor: "#28a745", color: "white" },
      error: { backgroundColor: "#dc3545", color: "white" },
      checking: { backgroundColor: "#ffc107", color: "black" },
    };

    return (
      <span
        style={{
          padding: "5px 10px",
          borderRadius: "15px",
          fontSize: "12px",
          fontWeight: "bold",
          ...styles[connectionStatus],
        }}
      >
        {connectionStatus === "connected" && "🟢 CONNECTÉ"}
        {connectionStatus === "error" && "🔴 DÉCONNECTÉ"}
        {connectionStatus === "checking" && "🟡 VÉRIFICATION..."}
      </span>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>🔗 Test de Connexion Backend</h2>
          <p style={{ margin: "5px 0 0 0", color: "#6c757d" }}>
            URL: {process.env.REACT_APP_API_BASE_URL}
          </p>
        </div>
        {getConnectionBadge()}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={checkConnection}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔄 Tester Connexion
        </button>

        <button
          onClick={runAllTests}
          disabled={isRunningTests}
          style={{
            padding: "10px 20px",
            backgroundColor: isRunningTests ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isRunningTests ? "not-allowed" : "pointer",
          }}
        >
          {isRunningTests ? "⏳ Tests en cours..." : "🚀 Lancer tous les tests"}
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          <h3
            style={{
              margin: 0,
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #ddd",
            }}
          >
            📊 Résultats des Tests
          </h3>

          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              style={{
                padding: "15px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {getStatusIcon(result.status)} {testName}
                  {result.duration && (
                    <span style={{ color: "#6c757d", fontWeight: "normal" }}>
                      {" "}
                      ({result.duration}ms)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  {result.message}
                </div>
              </div>

              {result.data && (
                <details style={{ marginLeft: "15px" }}>
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      fontSize: "12px",
                    }}
                  >
                    Voir données
                  </summary>
                  <pre
                    style={{
                      background: "#f8f9fa",
                      padding: "10px",
                      borderRadius: "3px",
                      fontSize: "11px",
                      overflow: "auto",
                      maxHeight: "150px",
                      maxWidth: "300px",
                      marginTop: "5px",
                    }}
                  >
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#e9ecef",
          borderRadius: "5px",
        }}
      >
        <h4>💡 Instructions d'utilisation</h4>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          <li>
            Assurez-vous que votre backend Spring Boot fonctionne sur le port
            8080
          </li>
          <li>Vérifiez que les configurations CORS sont correctes</li>
          <li>
            Les tests vous aideront à identifier les problèmes de connectivité
          </li>
          <li>
            Consultez la console du navigateur (F12) pour plus de détails sur
            les erreurs
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTest;
