import React from "react";
import Navbar from "./Navbar";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-5">{children}</main>
      <footer className="mt-auto py-3 bg-light">
        <Container>
          <div className="text-center">
            <small className="text-muted">
              © {new Date().getFullYear()} NeuroEval -
              <Link to="/privacy-policy" className="text-decoration-none ms-2">
                Políticas de Privacidad
              </Link>
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
