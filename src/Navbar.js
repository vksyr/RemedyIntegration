import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import NavigateNext from "@mui/icons-material/NavigateNext";

export default function RemedyNavbar(props) {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark">
      <Container style={{ marginLeft: 2 }}>
        <Navbar.Brand>
          <Nav.Link
            as={Link}
            to="/"
            style={{ display: "inline", marginRight: -8 }}
          >
            Remedy Integration
          </Nav.Link>

          {location.pathname.toLowerCase().indexOf("/incidentmanager") !=
            -1 && (
            <span>
              <NavigateNext /> Incident Manager
            </span>
          )}
          {location.pathname.toLowerCase().indexOf("/ncrprojecttracker") !=
            -1 && (
            <span>
              <NavigateNext /> NCR Project Tracker
            </span>
          )}
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
