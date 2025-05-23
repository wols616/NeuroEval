import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaFileMedical,
  FaChartLine,
  FaUserPlus,
} from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <span className="logo-text">NeuroEval</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbarDiv collapse navbar-collapse" id="navbarContent">
          {/* Enlaces principales - izquierda */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <FaHome className="me-1" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/patients">
                <FaUsers className="me-1" />
                Pacientes
              </Link>
            </li>
            {user?.role === "Especialista" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/patient-selection"
                    state={{ from: "/adir" }}
                  >
                    <FaFileMedical className="me-1" />
                    ADI-R
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/patient-selection"
                    state={{ from: "/ados" }}
                  >
                    <FaChartLine className="me-1" />
                    ADOS-2
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/patient-selection"
                    state={{ from: "/dsm5" }}
                  >
                    <FaChartLine className="me-1" />
                    DSM-5
                  </Link>
                </li>
              </>
            )}
            {user?.role === "Administrador" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    <FaUserPlus className="me-1" />
                    Usuarios
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/patient-selection"
                state={{ from: "/reports" }}
              >
                <FaChartLine className="me-1" />
                Reportes
              </Link>
            </li>
          </ul>

          {/* Perfil y logout - derecha */}
          <div className="d-flex align-items-center ms-auto">
            <Link
              className="nav-link d-flex align-items-center me-3"
              to="/profile"
            >
              <FaUserCircle className="me-1" />
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-logout d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaSignOutAlt className="me-1" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
