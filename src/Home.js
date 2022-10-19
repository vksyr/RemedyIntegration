import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home(props) {
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{
          paddingTop: 41,
          paddingLeft: 31
        }}
      >
        <h3>Remedy Integration</h3>
        <p>Provides custom views for viewing incidents from Remedy.</p>
        <div style={{ marginLeft: -12 }}>
          <button
            className="btn btn-link"
            onClick={() => {
              navigate("/IncidentManager");
            }}
          >
            Incident Manager
          </button>
          <button
            className="btn btn-link"
            onClick={() => {
              navigate("/NCRProjectTracker");
            }}
          >
            Project Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
