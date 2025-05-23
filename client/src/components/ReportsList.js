import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaCalendar, FaUserMd, FaUser } from 'react-icons/fa';
import '../styles/reports.css';

const ReportsList = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reportes/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted">No se encontraron reportes para este paciente.</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
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
            <div className="report-patient">
              <FaUser className="me-2" />
              {report.pacienteNombre} {report.pacienteApellido}
            </div>
            <div className="report-doctor">
              <FaUserMd className="me-2" />
              {report.especialistaNombre} {report.especialistaApellido}
            </div>
          </div>
          <div className="report-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleViewReport(report)}
            >
              Ver Reporte
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const handleViewReport = (report) => {
    // Aquí puedes implementar la lógica para ver el reporte completo
    // Por ejemplo, podrías abrir un modal o navegar a una página de vista de reporte
    console.log('Ver reporte:', report);
  };
};

export default ReportsList;
