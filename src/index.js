import React from "react";
import ReactDOM from "react-dom";
import RemedyNavbar from "./Navbar.js";
import Home from "./Home.js";
import IncidentManager from "./IncidentManager.js";
import NCRProjectTracker from "./NCRProjectTracker.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles.css";
import { ToastProvider } from "react-toast-notifications";

ReactDOM.render(
  <React.StrictMode>
    <div>
      <Router basename={process.env.PUBLIC_URL}>
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
  </React.StrictMode>,
  document.getElementById("root")
);
