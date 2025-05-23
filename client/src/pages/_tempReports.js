import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la selección de pacientes
    navigate('/patient-selection', { state: { from: '/reports' } });
  }, [navigate]);

  return null;
};

export default Reports;
