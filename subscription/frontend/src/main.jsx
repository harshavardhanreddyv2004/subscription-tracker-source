import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#e2e8f0", fontFamily: "sans-serif" }}>
          <h1>Something went wrong</h1>
          <pre style={{ background: "#1e293b", padding: 16, borderRadius: 8, overflow: "auto" }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
