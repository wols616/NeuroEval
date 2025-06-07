import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Swal from "sweetalert2";
import "../styles/dashboard.css";
import dashboardImage from "../images/imgDashboard.png";
import EvaluationCharts from "../components/EvaluationCharts";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  // Controles para las animaciones
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.1, 0.25, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "backOut",
      },
    },
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userResponse = await fetch(
          user?.role === "Administrador"
            ? `http://localhost:5000/api/administrador/${user.id}`
            : `http://localhost:5000/api/especialista/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Error: ${errorText}`);
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Obtener estadísticas
        const statsResponse = await fetch(
          "http://localhost:5000/api/evaluations/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        await Swal.fire({
          title: "Error",
          text: error.message.includes("403")
            ? "Sesión expirada, por favor ingrese nuevamente"
            : error.message,
          icon: "error",
          confirmButtonText: "Entendido",
        });

        if (error.message.includes("403")) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user, navigate, logout]);

  if (loading) {
    return (
      <motion.div
        className="dashboard-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header con animación */}
      <motion.div
        className="dashboard-header"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="welcome-title">
            Bienvenido/a,{" "}
            <span>
              {userData?.Nombre || "Usuario"} {userData?.Apellido}
            </span>
          </h1>
          <p className="welcome-subtitle">
            {user?.role === "Administrador"
              ? "Panel de administración"
              : "Panel de evaluaciones"}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="user-badge">
          <div className="user-avatar">
            {userData?.Nombre?.charAt(0)}
            {userData?.Apellido?.charAt(0)}
          </div>
          <div className="user-info">
            <p className="user-role">{user?.role}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Imagen principal con animación */}
      <motion.div
        className="dashboard-hero"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <img
          src={dashboardImage}
          alt="Dashboard ilustration"
          className="hero-image"
        />
        <div className="hero-text">
          <h2>Sistema de Evaluación TEA</h2>
          <p>
            {user?.role === "Administrador"
              ? "Gestión completa de especialistas y pacientes"
              : "Herramientas profesionales para evaluación diagnóstica"}
          </p>
        </div>
      </motion.div>

      {/* Sección de estadísticas con animación al scroll */}
      <motion.div
        ref={ref}
        className="dashboard-stats-section"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {stats && (
          <motion.div className="stats-grid" variants={containerVariants}>
            <motion.div variants={itemVariants} className="stat-card">
              <h3>Total evaluaciones</h3>
              <p className="stat-value">{stats.totalEvaluations || 0}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card">
              <h3>Evaluaciones este mes</h3>
              <p className="stat-value">{stats.monthlyEvaluations || 0}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card">
              <h3>Pacientes registrados</h3>
              <p className="stat-value">{stats.totalPatients || 0}</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Gráficas con animación escalonada */}
      <motion.div
        className="charts-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      >
        <motion.h2 variants={itemVariants} className="section-title">
          Estadísticas de Evaluaciones
        </motion.h2>

        <motion.div variants={itemVariants}>
          <EvaluationCharts />
        </motion.div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="quick-actions"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants} className="section-title">
          Acciones Rápidas
        </motion.h2>

        <motion.div className="actions-grid" variants={containerVariants}>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-card"
            onClick={() => navigate("/patients")}
          >
            <i className="bi bi-people-fill"></i>
            <span>Gestión de Pacientes</span>
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-card"
            onClick={() =>
              navigate("/patient-selection", { state: { from: "/reports" } })
            }
          >
            <i className="bi bi-clipboard-data"></i>
            <span>Reportes</span>
          </motion.button>

          {user?.role === "Administrador" && (
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="action-card"
              onClick={() => navigate("/users")}
            >
              <i className="bi bi-person-badge"></i>
              <span>Gestión de Usuarios</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
