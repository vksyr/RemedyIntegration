import React from "react";
import RemedyNavbar from "./Navbar.js";
import Home from "./Home.js";
import IncidentManager from "./IncidentManager.js";
import NCRProjectTracker from "./NCRProjectTracker.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ToastProvider } from "react-toast-notifications";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <div>
    <Router basename="/">
      <RemedyNavbar />
      <ToastProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/IncidentManager" element={<IncidentManager />} />
          <Route path="/NCRProjectTracker" element={<NCRProjectTracker />} />
        </Routes>
      </ToastProvider>
    </Router>
  </div>
);
