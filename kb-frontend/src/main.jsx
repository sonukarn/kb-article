import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import "react-quill-new/dist/quill.snow.css"; // ✅ correct

import "./index.css";
import store from "./app/store";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" richColors closeButton duration={3000} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
