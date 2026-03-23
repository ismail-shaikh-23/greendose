// components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red" }}>Error: {this.state.error.message}</div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
