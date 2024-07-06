import React from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./pages/routes";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
