import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaArrowRight, FaSearch } from "react-icons/fa";
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
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si estamos en la página de reportes, mostrar los reportes del paciente
  if (location.pathname === "/reports") {
    const patientId = parseInt(location.pathname.split("/")[2]);
    if (patientId) {
      const patient = patients.find((p) => p.ID === patientId);
      if (patient) {
        return (
          <div className="container mt-5">
            <h2 className="mb-4">
              Reportes de {patient.Nombre} {patient.Apellido}
            </h2>
            <ReportsList patientId={patientId} />
          </div>
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
    <div className="container mt-5">
      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />

      <div className={`patient-list ${showConsentModal ? "blurred" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{currentPageTitle}</h3>
          <div className="search-bar" style={{ width: "300px" }}>
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
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="alert alert-info">
            {searchTerm.trim() === ""
              ? "No hay pacientes registrados"
              : "No se encontraron pacientes que coincidan con la búsqueda"}
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.ID}
              className={`patient-card mb-3 ${
                showConsentModal ? "hidden" : ""
              }`}
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
              <button
                className="btn btn-primary select-patient-btn"
                onClick={() => handlePatientSelect(patient.ID)}
              >
                Seleccionar <FaArrowRight className="ms-2" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientSelection;
