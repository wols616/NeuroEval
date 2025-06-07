import React from "react";
import Navbar from "./Navbar";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-gray-100">
      <Navbar />
      <main className="flex-grow-1 p-5">{children}</main>
      <footer className="py-3 bg-light mt-auto">
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
