import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Swal from "sweetalert2";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

const MySwal = Swal;

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
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos necesarios",
          confirmButtonColor: "#3085d6",
        });
      }
    };

    fetchData();
  }, [patientId, selectedModule]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAvailableActivities = () => {
    const selectedIds = selectedActivities.map((a) => parseInt(a.actividadId));
    return predefinedActivities.filter(
      (activity) => !selectedIds.includes(activity.id)
    );
  };

  const handleAddActivity = () => {
    if (!currentActivity.actividadId) {
      MySwal.fire({
        icon: "warning",
        title: "Seleccione una actividad",
        text: "Debe seleccionar una actividad para agregar",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

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

    MySwal.fire({
      position: "center",
      icon: "success",
      title: "Actividad agregada",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const handleRemoveActivity = (id) => {
    MySwal.fire({
      title: "¿Está seguro?",
      text: "Esta acción eliminará la actividad seleccionada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedActivities((prev) =>
          prev.filter((activity) => activity.id !== id)
        );
        MySwal.fire("Eliminada!", "La actividad ha sido eliminada.", "success");
      }
    });
  };

  const hasPendingActivities = () => {
    return getAvailableActivities().length > 0;
  };

  const countPendingActivities = () => {
    return getAvailableActivities().length;
  };

  const handleSubmit = async () => {
    if (selectedActivities.length === 0) {
      MySwal.fire({
        icon: "error",
        title: "Actividades requeridas",
        text: "Debe agregar al menos una actividad",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (hasPendingActivities()) {
      MySwal.fire({
        icon: "warning",
        title: "Actividades pendientes",
        html: `Todavía tiene <b>${countPendingActivities()}</b> actividades por completar`,
        confirmButtonColor: "#3085d6",
      });
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

      // Mostrar loader mientras se guarda
      MySwal.fire({
        title: "Guardando evaluación...",
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });

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

      // Mostrar mensaje de éxito
      MySwal.fire({
        icon: "success",
        title: "Éxito",
        text: "Evaluación guardada correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate(`/evaluaciones/ados/${evaluacionID}`);
      });
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar la evaluación: " + error.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title className="text-danger">
              No se pudo cargar el paciente
            </Card.Title>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 bg-light">
      <Row className="justify-content-center">
        <Col xl={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">
                Evaluación ADOS-2 - {patient.Nombre} {patient.Apellido}
                <Badge bg="light" text="primary" className="ms-2">
                  Módulo {selectedModule}
                </Badge>
              </h2>
            </Card.Header>

            <Card.Body>
              {/* Sección Nueva Actividad */}
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-light">
                  Nueva Actividad
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Actividad *</Form.Label>
                        <Form.Select
                          name="actividadId"
                          value={currentActivity.actividadId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccione una actividad</option>
                          {getAvailableActivities().map((activity) => (
                            <option key={activity.id} value={activity.id}>
                              {activity.Actividad} ({activity.NombreModulo})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="observacion"
                          value={currentActivity.observacion}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Puntuación *</Form.Label>
                        <Form.Select
                          name="puntuacion"
                          value={currentActivity.puntuacion}
                          onChange={handleInputChange}
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
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Categoría *</Form.Label>
                        <Form.Select
                          name="categoria"
                          value={currentActivity.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category.ID} value={category.ID}>
                              {category.Categoria}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="outline-primary"
                    onClick={handleAddActivity}
                    disabled={
                      !currentActivity.actividadId || !currentActivity.categoria
                    }
                  >
                    Agregar Actividad
                  </Button>
                </Card.Body>
              </Card>

              {/* Sección Actividades Registradas */}
              <Card className="mb-4">
                <Card.Header
                  as="h5"
                  className="bg-light d-flex justify-content-between align-items-center"
                >
                  <span>Actividades Registradas</span>
                  <Badge bg="primary" pill>
                    {selectedActivities.length}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  {selectedActivities.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      No hay actividades registradas
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Actividad</th>
                            <th>Módulo</th>
                            <th>Observación</th>
                            <th>Puntuación</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedActivities.map((activity) => (
                            <tr key={activity.id}>
                              <td>
                                {activity.actividadNombre}
                                {activity.descripcion && (
                                  <small className="d-block text-muted">
                                    {activity.descripcion}
                                  </small>
                                )}
                              </td>
                              <td>{selectedModule}</td>
                              <td>{activity.observacion || "-"}</td>
                              <td>{activity.puntuacion}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveActivity(activity.id)
                                  }
                                >
                                  Eliminar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Sección Diagnóstico */}
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-light">
                  Diagnóstico *
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={4}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Botones de acción */}
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/dashboard`)}
                >
                  Cancelar
                </Button>
                <div className="d-flex align-items-center">
                  {hasPendingActivities() && (
                    <div className="me-3 text-danger">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      Faltan {countPendingActivities()} actividades
                    </div>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={
                      selectedActivities.length === 0 ||
                      !diagnosis ||
                      hasPendingActivities()
                    }
                  >
                    Guardar Evaluación
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdosEvaluation;
