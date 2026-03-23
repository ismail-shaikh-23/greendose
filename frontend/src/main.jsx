import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import "./global.css";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import "react-tooltip/dist/react-tooltip.css";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          fontSize: "14px",
        },
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
