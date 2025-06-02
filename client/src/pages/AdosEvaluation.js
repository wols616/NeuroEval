import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdosEvaluation = () => {
  const { patientId } = useParams();
  const { state } = useLocation();
  const selectedModule = state?.selectedModule || "T";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [predefinedActivities, setPredefinedActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState({
    actividadId: "",
    observacion: "",
    puntuacion: 0,
    modulo: selectedModule,
    categoria: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch patient data
        const patientResponse = await fetch(
          `http://localhost:5000/api/patients/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Fetch categories
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch predefined activities
        const activitiesResponse = await fetch(
          `http://localhost:5000/api/activities?module=${selectedModule}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const activitiesData = await activitiesResponse.json();
        setPredefinedActivities(activitiesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAvailableActivities = () => {
    // Obtener IDs de actividades ya seleccionadas
    const selectedIds = selectedActivities.map((a) => parseInt(a.actividadId));

    // Filtrar actividades predefinidas excluyendo las ya seleccionadas
    return predefinedActivities.filter(
      (activity) => !selectedIds.includes(activity.id)
    );
  };

  const handleAddActivity = () => {
    if (!currentActivity.actividadId) return;

    const selectedActivity = predefinedActivities.find(
      (a) => a.id === parseInt(currentActivity.actividadId)
    );

    if (!selectedActivity) return;

    setSelectedActivities((prev) => [
      ...prev,
      {
        ...currentActivity,
        id: Date.now(),
        actividadNombre: selectedActivity.Actividad,
        moduloNombre: selectedActivity.NombreModulo,
        descripcion: selectedActivity.Descripcion,
      },
    ]);

    setCurrentActivity({
      actividadId: "",
      observacion: "",
      puntuacion: 0,
      modulo: selectedModule,
      categoria: "",
    });
  };

  const handleRemoveActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.filter((activity) => activity.id !== id)
    );
  };

  const handleSubmit = async () => {
    if (selectedActivities.length === 0) {
      alert("Debe agregar al menos una actividad");
      return;
    }

    try {
      const evaluationData = {
        PacienteID: patientId,
        EspecialistaID: user.id,
        Fecha: new Date().toISOString(),
        TipoEvaluacion: "ADOS-2",
        Actividades: selectedActivities.map((activity) => ({
          ActividadID: activity.actividadId,
          Observacion: activity.observacion,
          Puntuacion: activity.puntuacion,
          Modulo: selectedModule,
          CategoriaID: activity.categoria,
        })),
        Diagnostico: diagnosis,
      };

      // Create evaluation
      const response = await fetch("http://localhost:5000/api/evaluaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        throw new Error("Error al crear evaluación");
      }

      const data = await response.json();
      const evaluacionID = data.id;

      // Save each activity
      const saveActivities = selectedActivities.map((activity) =>
        fetch("http://localhost:5000/api/ados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            EvaluacionID: evaluacionID,
            ActividadID: activity.actividadId,
            Observacion: activity.observacion,
            Puntuacion: activity.puntuacion,
            Modulo: selectedModule,
            CategoriaID: activity.categoria,
          }),
        })
      );

      await Promise.all(saveActivities);

      // Save report
      const reportResponse = await fetch("http://localhost:5000/api/reportes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          EvaluacionID: evaluacionID,
          FechaGeneracion: new Date().toISOString().split("T")[0],
          Contenido: diagnosis,
        }),
      });

      if (!reportResponse.ok) {
        throw new Error("Error al guardar reporte");
      }

      alert("Evaluación guardada exitosamente");
      navigate(`/evaluaciones/ados/${evaluacionID}`);
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      alert("Error al guardar la evaluación: " + error.message);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="d-flex flex-column p-5">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
                Evaluación ADOS-2 - {patient.Nombre} {patient.Apellido}
              </h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Nueva Actividad
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actividad *
                    </label>
                    <select
                      name="actividadId"
                      value={currentActivity.actividadId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Seleccione una actividad</option>
                      {getAvailableActivities().map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.Actividad} ({activity.NombreModulo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observación
                    </label>
                    <textarea
                      name="observacion"
                      value={currentActivity.observacion}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntuación *
                    </label>
                    <select
                      name="puntuacion"
                      value={currentActivity.puntuacion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      required
                    >
                      <option value="0">0 - No hay anormalidad</option>
                      <option value="1">
                        1 - Comportamiento levemente anormal
                      </option>
                      <option value="2">2 - Claramente anormal</option>
                      <option value="3">
                        3 - Comportamiento severamente anormal
                      </option>
                    </select>
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Módulo *
                    </label> */}
                    {/* <select
                      name="modulo"
                      value={currentActivity.modulo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      required
                    >
                      <option value="T">Módulo T</option>
                      <option value="1">Módulo 1</option>
                      <option value="2">Módulo 2</option>
                      <option value="3">Módulo 3</option>
                      <option value="4">Módulo 4</option>
                    </select> */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      name="categoria"
                      value={currentActivity.categoria}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      required
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
                  disabled={
                    !currentActivity.actividadId || !currentActivity.categoria
                  }
                  className="my-4 btn btn-outline-primary"
                >
                  Agregar Actividad
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Actividades Registradas ({selectedActivities.length})
                </h3>
                {selectedActivities.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No hay actividades registradas
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actividad
                          </th>
                          <th className="px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Módulo
                          </th>
                          <th className="px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Observación
                          </th>
                          <th className="px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Puntuación
                          </th>
                          <th className="px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedActivities.map((activity) => (
                          <tr key={activity.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {activity.actividadNombre}
                              {activity.descripcion && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {activity.descripcion}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {selectedModule}
                            </td>
                            <td className="px-6 py-4">
                              {activity.observacion || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {activity.puntuacion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() =>
                                  handleRemoveActivity(activity.id)
                                }
                                className="btn btn-outline-danger"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico *
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate(`/patient/${patientId}`)}
                  className="btn btn-outline-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedActivities.length === 0 || !diagnosis}
                  className="btn btn-primary"
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
