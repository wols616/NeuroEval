import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaFilePdf,
  FaCalendar,
  FaUserMd,
  FaUser,
  FaPrint,
} from "react-icons/fa";
import PrintableReport from "../components/PrintableReport";
import { useReactToPrint } from "react-to-print";
import "../styles/reports.css";

const PatientReports = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [printableData, setPrintableData] = useState(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Use useRef instead of React.useRef
  const printableRef = useRef();

  // Updated hook for printing with new API
  const handlePrint = useReactToPrint({
    contentRef: printableRef, // Use contentRef instead of content
    onAfterPrint: () => {
      setShowPrintDialog(false);
      setPrintableData(null); // Clean up data after printing
    },
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Error al imprimir el reporte");
    },
  });

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

  const handlePrintReport = async (report) => {
    try {
      let response;
      if (report.tipoEvaluacion === "ADOS-2") {
        response = await fetch(
          `http://localhost:5000/api/ados/evaluacion/${report.EvaluacionID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else if (report.tipoEvaluacion === "ADI-R") {
        response = await fetch(
          `http://localhost:5000/api/adir/resultados/${report.EvaluacionID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const observacionResponse = await fetch(
        `http://localhost:5000/api/reporte-by-evaluacionID/${report.EvaluacionID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      const dataObservacion = await observacionResponse.json();

      const reportData = {
        ...data,
        tipoEvaluacion: report.tipoEvaluacion,
        pacienteNombre: `${patient.Nombre} ${patient.Apellido}`,
        fecha: report.fecha,
        especialistaNombre: `${report.especialistaNombre} ${report.especialistaApellido}`,
        observaciones: dataObservacion[0].Contenido || "No hay observaciones",
      };

      setPrintableData(reportData);
      setShowPrintDialog(true);

      // Wait a bit for the modal to fully render before allowing print
      setTimeout(() => {
        // The print button in the modal will trigger the actual print
      }, 100);
    } catch (error) {
      console.error("Error al cargar datos para imprimir:", error);
      alert("Error al preparar el reporte para imprimir");
    }
  };

  // Function to trigger print with validation
  const triggerPrint = () => {
    if (!printableRef.current) {
      console.error("Print ref not ready");
      alert("El reporte no está listo para imprimir. Inténtalo de nuevo.");
      return;
    }

    if (!printableData) {
      console.error("No printable data available");
      alert("No hay datos para imprimir.");
      return;
    }

    handlePrint();
  };

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

  const handleGoToDetails = (report) => {
    if (report.tipoEvaluacion === "ADOS-2") {
      navigate(`/evaluaciones/ados/${report.EvaluacionID}`);
    }
    if (report.tipoEvaluacion === "ADI-R") {
      navigate(`/evaluaciones/adir/${report.EvaluacionID}`);
    } else if (report.tipoEvaluacion !== "ADOS-2") {
      alert("ADIR y DSM5 reportes no están implementados aún.");
      //navigate(`/adir/${report.EvaluacionID}`);
    }
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
      {/* Diálogo de impresión */}
      {showPrintDialog && printableData && (
        <div className="modal-print">
          <div className="modal-content-print">
            <PrintableReport
              ref={printableRef}
              reportData={printableData}
              reportType={printableData?.tipoEvaluacion}
            />
            <div className="modal-actions-print">
              <button className="btn btn-primary me-2" onClick={triggerPrint}>
                <FaPrint className="me-2" />
                Imprimir
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowPrintDialog(false);
                  setPrintableData(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="reports-container">
        <h2 className="mb-4">
          Reportes de {patient.Nombre} {patient.Apellido}
        </h2>
        {reports
          .filter((report) => report.tipoEvaluacion !== "DSM-5")
          .map((report) => (
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
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleGoToDetails(report)}
                >
                  Detalles
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handlePrintReport(report)}
                >
                  <FaPrint className="me-1" />
                  Imprimir
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientReports;
