import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaArrowRight } from 'react-icons/fa';
import ReportsList from '../components/ReportsList';
import '../styles/patient-selection.css';

const PatientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patientId) => {
    const targetPath = location.state?.from || '/dashboard';
    
    // Si la ruta es /adir o /ados, agregar el ID del paciente como parámetro
    if (targetPath === '/adir') {
      navigate(`/adir/${patientId}`);
    } else if (targetPath === '/ados') {
      navigate(`/ados/${patientId}`);
    } else if (targetPath === '/reports') {
      navigate(`/reports/${patientId}`);
    } 
    else if(targetPath == '/dsm5'){
      navigate(`/dsm5/${patientId}`);
    }
    else {
      // Para otras rutas, mantener el comportamiento anterior
      navigate(targetPath, { state: { selectedPatientId: patientId } });
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
  if (location.pathname === '/reports') {
    const patientId = parseInt(location.pathname.split('/')[2]);
    if (patientId) {
      const patient = patients.find(p => p.ID === patientId);
      if (patient) {
        return (
          <div className="container mt-5">
            <h2 className="mb-4">Reportes de {patient.Nombre} {patient.Apellido}</h2>
            <ReportsList patientId={patientId} />
          </div>
        );
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Seleccionar Paciente</h2>
      <div className="patient-list">
        {patients.map((patient) => (
          <div key={patient.ID} className="patient-card mb-3">
            <div className="patient-info">
              <FaUser className="patient-icon me-2" />
              <div>
                <h5>{patient.Nombre} {patient.Apellido}</h5>
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
        ))}
      </div>
    </div>
  );
};

export default PatientSelection;
