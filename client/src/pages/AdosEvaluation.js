import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdosEvaluation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    actividad: '',
    observacion: '',
    puntuacion: 0,
    modulo: 'T',
    categoria: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchPatient();
    fetchCategories();
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddActivity = () => {
    setActivities(prev => [...prev, { ...newActivity, id: Date.now() }]);
    setNewActivity({
      actividad: '',
      observacion: '',
      puntuacion: 0,
      modulo: 'T',
      categoria: ''
    });
  };

  const handleRemoveActivity = (id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const evaluationData = {
        PacienteID: patientId,
        EspecialistaID: user.id,
        Fecha: new Date().toISOString(),
        TipoEvaluacion: 'ADOS-2',
        Actividades: activities.map(activity => ({
          Actividad: activity.actividad,
          Observacion: activity.observacion,
          Puntuacion: activity.puntuacion,
          Modulo: activity.modulo,
          CategoriaID: activity.categoria
        })),
        Diagnostico: diagnosis
      };

      const response = await fetch('http://localhost:5000/api/evaluaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(evaluationData)
      });

      if (!response.ok) {
        throw new Error('Error al crear evaluación');
      }

      const data = await response.json();
      const evaluacionID = data.id;

      // Guardar cada actividad
      for (const activity of activities) {
        const activityResponse = await fetch('http://localhost:5000/api/ados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            EvaluacionID: evaluacionID,
            Actividad: activity.actividad,
            Observacion: activity.observacion,
            Puntuacion: activity.puntuacion,
            Modulo: activity.modulo,
            CategoriaID: activity.categoria
          })
        });

        if (!activityResponse.ok) {
          throw new Error('Error al guardar actividad');
        }
      }

      // Guardar el reporte
      const reportResponse = await fetch('http://localhost:5000/api/reportes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          EvaluacionID: evaluacionID,
          FechaGeneracion: new Date().toISOString().split('T')[0],
          Contenido: diagnosis
        })
      });

      if (!reportResponse.ok) {
        throw new Error('Error al guardar reporte');
      }

      // Mostrar mensaje de éxito
      alert('Evaluación guardada exitosamente');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      alert('Error al guardar la evaluación: ' + error.message);
    }
  };

  useEffect(() => {
    // Actualizar el estado de carga cuando se cargue el paciente
    if (patient) {
      setLoading(false);
    }
  }, [patient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">No se pudo cargar el paciente</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Evaluación ADOS-2 - {patient.Nombre} {patient.Apellido}
              </h2>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Nueva Actividad
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actividad
                    </label>
                    <textarea
                      name="actividad"
                      value={newActivity.actividad}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observación
                    </label>
                    <textarea
                      name="observacion"
                      value={newActivity.observacion}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntuación
                    </label>
                    <select
                      name="puntuacion"
                      value={newActivity.puntuacion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="0">0 - No hay anormalidad</option>
                      <option value="1">1 - Comportamiento levemente anormal</option>
                      <option value="2">2 - Claramente anormal</option>
                      <option value="3">3 - Comportamiento severamente anormal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Módulo
                    </label>
                    <select
                      name="modulo"
                      value={newActivity.modulo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="T">Módulo T</option>
                      <option value="1">Módulo 1</option>
                      <option value="2">Módulo 2</option>
                      <option value="3">Módulo 3</option>
                      <option value="4">Módulo 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      name="categoria"
                      value={newActivity.categoria}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.ID} value={category.ID}>
                          {category.Categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddActivity}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Agregar Actividad
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Actividades Registradas
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actividad
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Observación
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntuación
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Módulo
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activities.map((activity) => (
                        <tr key={activity.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.actividad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.observacion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.puntuacion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.modulo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemoveActivity(activity.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Guardar Evaluación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdosEvaluation;
