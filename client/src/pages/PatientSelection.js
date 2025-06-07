import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaArrowRight, FaSearch } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReportsList from "../components/ReportsList";
import ConsentModal from "../components/ConsentModal";
import "../styles/patient-selection.css";

const PatientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

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
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/patients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data); // Inicialmente mostrar todos los pacientes
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    // Filtrar pacientes cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${patient.Nombre} ${patient.Apellido}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const handleAcceptConsent = () => {
    setShowConsentModal(false);
    if (selectedPatientId) {
      proceedWithEvaluation(selectedPatientId);
    }
  };

  const handleDeclineConsent = () => {
    setShowConsentModal(false);
    alert("Debes aceptar el consentimiento para proceder con la evaluación.");
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);

    // Verificar si la ruta destino es /reports
    const targetPath = location.state?.from || "/dashboard";

    if (targetPath === "/reports") {
      // Si es para reportes, proceder directamente sin mostrar consentimiento
      proceedWithEvaluation(patientId);
    } else {
      // Para otras rutas, mostrar el modal de consentimiento
      setShowConsentModal(true);
    }
  };

  const proceedWithEvaluation = async (patientId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/evaluacionesApto/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const targetPathh = location.state?.from || "/dashboard";
      if (response.status === 404 && targetPathh !== "/dsm5") {
        // Si no ha hecho la evaluación, sugerimos que la haga
        alert(
          "Este paciente aún no ha realizado ninguna evaluación DSM-5. Por favor, realice una antes de continuar."
        );
        navigate(`/dsm5/${patientId}`); // Redirigir al test DSM-5
        return;
      }

      const data = await response.json();

      if (targetPathh === "/reports") {
        navigate(`/reports/${patientId}`);
        return;
      }

      // Si hay un error o la evaluación no existe, se considera como "ninguno"
      const apto = data.Apto;

      if (apto === "ninguno" && targetPathh !== "/dsm5") {
        alert(
          "El especialista determino que este paciente no requiere ninguna evaluación adicional."
        );
        return; // No redirige si no es apto
      }

      const targetPath = location.state?.from || "/dashboard";

      if (apto === "adir" && targetPath === "/adir") {
        navigate(`/adir/${patientId}`);
      } else if (apto === "ados" && targetPath === "/ados") {
        navigate(`/ados/${patientId}`, { state: { from: targetPath } });
      } else if (apto === "adir" && targetPath === "/ados") {
        alert(
          "Este paciente no puede realizar la evaluación ADOS. Pero si puede realizar la evaluación ADIR."
        );
      } else if (apto === "ados" && targetPath === "/adir") {
        alert(
          "Este paciente no puede realizar la evaluación ADIR. Pero si puede realizar la evaluación ADOS."
        );
      } else if (
        apto === "ambos" &&
        (targetPath === "/adir" || targetPath === "/ados")
      ) {
        navigate(`${targetPath}/${patientId}`);
      } else if (targetPath === "/dsm5") {
        navigate(`/dsm5/${patientId}`);
      } else {
        navigate(targetPath, { state: { selectedPatientId: patientId } });
      }
    } catch (error) {
      console.error("Error al verificar evaluación:", error);
      alert("Hubo un error al verificar la aptitud del paciente.");
    }
  };

  const calculateAge = (fechaNacimiento) => {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <motion.div
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </motion.div>
    );
  }

  // Si estamos en la página de reportes, mostrar los reportes del paciente
  if (location.pathname === "/reports") {
    const patientId = parseInt(location.pathname.split("/")[2]);
    if (patientId) {
      const patient = patients.find((p) => p.ID === patientId);
      if (patient) {
        return (
          <motion.div
            className="container mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Reportes de {patient.Nombre} {patient.Apellido}
            </motion.h2>
            <ReportsList patientId={patientId} />
          </motion.div>
        );
      }
    }
  }

  const titleMap = {
    "/adir": "Seleccionar Paciente para ADI-R",
    "/ados": "Seleccionar Paciente para ADOS-2",
    "/dsm5": "Seleccionar Paciente para DSM-5",
    "/reports": "Seleccionar Paciente para Reportes",
  };

  const currentPageTitle =
    titleMap[location.state?.from] || "Seleccionar Paciente";

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />

      <motion.div
        className={`patient-list ${showConsentModal ? "blurred" : ""}`}
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div
          className="d-flex justify-content-between align-items-center mb-4"
          variants={itemVariants}
        >
          <motion.h3 variants={itemVariants}>{currentPageTitle}</motion.h3>
          <motion.div
            className="search-bar"
            style={{ width: "300px" }}
            variants={itemVariants}
          >
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>

        {filteredPatients.length === 0 ? (
          <motion.div
            className="alert alert-info"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {searchTerm.trim() === ""
              ? "No hay pacientes registrados"
              : "No se encontraron pacientes que coincidan con la búsqueda"}
          </motion.div>
        ) : (
          filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.ID}
              className={`patient-card mb-3 ${
                showConsentModal ? "hidden" : ""
              }`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              custom={index}
              transition={{ delay: index * 0.05 }}
            >
              <div className="patient-info">
                <FaUser className="patient-icon me-2" />
                <div>
                  <h5>
                    {patient.Nombre} {patient.Apellido}
                  </h5>
                  <p className="text-muted">
                    Edad {calculateAge(patient.FechaNacimiento)} años
                  </p>
                </div>
              </div>
              <motion.button
                className="btn btn-primary select-patient-btn"
                onClick={() => handlePatientSelect(patient.ID)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar <FaArrowRight className="ms-2" />
              </motion.button>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default PatientSelection;
