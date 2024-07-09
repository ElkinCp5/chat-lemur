import React from "react";
import { createRoot } from "react-dom/client";
import { Routers } from "./pages/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";
import "./ui.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Routers />
  </React.StrictMode>
);
