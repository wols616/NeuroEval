import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaFilePdf, FaCalendar, FaUserMd, FaUser } from "react-icons/fa";
import "../styles/reports.css";

const PatientReports = () => {
  const { patientId } = useParams();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reportes/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      }
    };

    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/patients/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error al cargar paciente:", error);
      }
    };

    fetchReports();
    fetchPatient();
    setLoading(false);
  }, [patientId]);

  if (loading || !patient) {
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

  const handleViewReport = (report) => {
    // Aquí puedes implementar la lógica para ver el reporte completo
    console.log("Ver reporte:", report);
  };

  if (reports.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">
          Reportes de {patient.Nombre} {patient.Apellido}
        </h2>
        <div className="text-center">
          <p className="text-muted">
            No se encontraron reportes para este paciente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="reports-container">
        <h2 className="mb-4">
          Reportes de {patient.Nombre} {patient.Apellido}
        </h2>
        {reports.map((report) => (
          <div key={report.ID} className="report-card mb-3">
            <div className="report-header">
              <div className="report-date">
                <FaCalendar className="me-2" />
                {report.fecha}
              </div>
              <div className="report-type">
                <FaFilePdf className="me-2" />
                {report.tipoEvaluacion}
              </div>
            </div>
            <div className="report-content">
              <div className="report-doctor">
                <FaUserMd className="me-2" />
                {report.especialistaNombre} {report.especialistaApellido}
              </div>
              <div className="report-diagnosis mt-3">
                <h5>Diagnóstico:</h5>
                <p>{report.Contenido}</p>
              </div>
            </div>
            <div className="report-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleViewReport(report)}
              >
                Algo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientReports;
