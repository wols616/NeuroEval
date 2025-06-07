import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import {
  Container,
  Card,
  Button,
  Form,
  ProgressBar,
  Spinner,
  Badge,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const puntuaciones = [
  {
    value: 0,
    label: "0 - Comportamiento normal o no hay problemas significativos",
  },
  { value: 1, label: "1 - Presencia leve o dudosa del comportamiento" },
  { value: 2, label: "2 - Presencia clara y anormal del comportamiento" },
  {
    value: 2,
    label: "3 - Comportamiento extremadamente anormal (raramente se usa)",
  },
  {
    value: 0,
    label: "7 - Comportamiento anormal pero no específico del autismo",
  },
  { value: 0, label: "8 - Información no disponible o inaplicable" },
  { value: 0, label: "9 - No sabe / no recuerda" },
];

export default function AdirEvaluation() {
  const { patientId } = useParams();
  const pacienteID = parseInt(patientId);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evaluacionID, setEvaluacionID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  const [diagnostico, setDiagnostico] = useState("");
  const [evaluacionCompletada, setEvaluacionCompletada] = useState(false);

  const iniciarEvaluacion = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mostrar loader mientras se crea la evaluación
      Swal.fire({
        title: "Iniciando evaluación...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Crear evaluación
      const crearRes = await fetch("http://localhost:5000/api/evaluaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          PacienteID: pacienteID,
          EspecialistaID: user.id,
          TipoEvaluacion: "ADI-R",
          Fecha: new Date().toISOString().split("T")[0],
        }),
      });

      if (!crearRes.ok) {
        const errorData = await crearRes.json();
        throw new Error(errorData.error || "Error al crear evaluación");
      }

      const crearData = await crearRes.json();
      setEvaluacionID(crearData.id);

      // Cargar preguntas
      const preguntasRes = await fetch(
        "http://localhost:5000/api/preguntas-con-respuestas",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!preguntasRes.ok) {
        throw new Error("Error al cargar las preguntas");
      }

      const preguntasData = await preguntasRes.json();
      const normalizadas = preguntasData.map((p) => ({
        ...p,
        Respuestas: p.respuestas || [],
      }));

      setPreguntas(normalizadas);

      Swal.close();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const eliminarRespuestas = async (preguntaId) => {
    try {
      const respuesta = await fetch(
        `http://localhost:5000/api/adir/${evaluacionID}/${preguntaId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al eliminar respuestas");
      }
    } catch (err) {
      console.error("Error al eliminar respuestas:", err);
      throw err;
    }
  };

  const salirEvaluacion = async () => {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea salir de la evaluación sin guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/evaluaciones/${evaluacionID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al eliminar evaluación");
        }
        navigate("/dashboard");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const manejarCambio = (respuestaID, valor) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [respuestaID]: valor,
    }));
  };

  const guardarPuntuaciones = async () => {
    if (!evaluacionID || !preguntas[indice]) return;

    try {
      const preguntaActual = preguntas[indice];
      const guardarPromesas = preguntaActual.Respuestas.map((respuesta) => {
        const puntuacion = respuestasSeleccionadas[respuesta.ID];
        if (puntuacion !== undefined) {
          return fetch("http://localhost:5000/api/adir", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              EvaluacionID: evaluacionID,
              RespuestaID: respuesta.ID,
              Puntuacion: puntuacion,
            }),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(guardarPromesas);
    } catch (err) {
      console.error("Error al guardar puntuaciones:", err);
      throw err;
    }
  };

  const siguientePregunta = async () => {
    try {
      // Verificar que todas las respuestas estén completas
      const preguntaActual = preguntas[indice];
      const todasRespondidas = preguntaActual.Respuestas.every(
        (respuesta) => respuestasSeleccionadas[respuesta.ID] !== undefined
      );

      if (!todasRespondidas) {
        Swal.fire({
          icon: "warning",
          title: "Respuestas incompletas",
          text: "Por favor responda todas las preguntas antes de continuar",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      await guardarPuntuaciones();

      if (indice < preguntas.length - 1) {
        setIndice((prev) => prev + 1);
        setRespuestasSeleccionadas({});
      } else {
        setEvaluacionCompletada(true);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Evaluación completada",
          text: "Ahora puede ingresar el diagnóstico final",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Error al avanzar:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar las respuestas",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const preguntaAnterior = async () => {
    if (indice > 0) {
      try {
        // Eliminar respuestas de la pregunta actual antes de retroceder
        const preguntaActualId = preguntas[indice - 1].ID;
        await eliminarRespuestas(preguntaActualId);

        // Retroceder
        setIndice((prev) => prev - 1);
        setRespuestasSeleccionadas({});
      } catch (err) {
        console.error("Error al retroceder:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo retroceder a la pregunta anterior",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const guardarDiagnostico = async () => {
    if (!diagnostico.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Diagnóstico vacío",
        text: "Por favor ingrese un diagnóstico antes de guardar",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Guardando diagnóstico...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`http://localhost:5000/api/reportes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          EvaluacionID: evaluacionID,
          FechaGeneracion: new Date().toISOString().split("T")[0],
          Contenido: diagnostico,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el diagnóstico");
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Diagnóstico guardado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate(`/evaluaciones/adir/${evaluacionID}`);
      });
    } catch (err) {
      console.error("Error al guardar diagnóstico:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (!evaluacionID) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title as="h2" className="mb-4 text-primary">
                  Evaluación ADI-R
                </Card.Title>
                <Card.Text className="mb-4">
                  Para comenzar la evaluación ADI-R para este paciente, haga
                  clic en el botón "Iniciar Evaluación".
                </Card.Text>
                <Button onClick={iniciarEvaluacion} variant="primary" size="lg">
                  Iniciar Evaluación
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title as="h2" className="text-danger mb-4">
                  Error
                </Card.Title>
                <Alert variant="danger">{error}</Alert>
                <Button
                  onClick={iniciarEvaluacion}
                  variant="primary"
                  className="mt-3"
                >
                  Reintentar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (evaluacionCompletada) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Diagnóstico Final</h3>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>Ingrese el diagnóstico:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    placeholder="Escriba aquí el diagnóstico..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setEvaluacionCompletada(false)}
                  >
                    Volver a las preguntas
                  </Button>
                  <Button variant="success" onClick={guardarDiagnostico}>
                    Guardar Diagnóstico
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const preguntaActual = preguntas[indice];
  const progreso = ((indice + 1) / preguntas.length) * 100;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xl={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Evaluación ADI-R</h3>
              <Button
                variant="outline-light"
                size="sm"
                onClick={salirEvaluacion}
              >
                <i className="bi bi-x-lg me-1"></i> Salir
              </Button>
            </Card.Header>

            <Card.Body>
              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Progreso:</span>
                  <span>
                    Pregunta {indice + 1} de {preguntas.length}
                  </span>
                </div>
                <ProgressBar
                  now={progreso}
                  label={`${Math.round(progreso)}%`}
                />
              </div>

              {/* Pregunta actual */}
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h4 className="mb-0">{preguntaActual.Categoria}</h4>
                </Card.Header>
                <Card.Body>
                  <h5 className="mb-4">{preguntaActual.Pregunta}</h5>

                  {/* Respuestas */}
                  <div className="space-y-4">
                    {preguntaActual.Respuestas.map((respuesta) => (
                      <div
                        key={respuesta.ID}
                        className="mb-4 pb-3 border-bottom"
                      >
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            {respuesta.Respuesta}
                          </Form.Label>
                          <Form.Select
                            className="mt-2"
                            value={respuestasSeleccionadas[respuesta.ID] ?? ""}
                            onChange={(e) =>
                              manejarCambio(
                                respuesta.ID,
                                parseInt(e.target.value)
                              )
                            }
                            required
                          >
                            <option value="">Seleccione una puntuación</option>
                            {puntuaciones.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Navegación */}
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  onClick={preguntaAnterior}
                  disabled={indice === 0}
                >
                  <i className="bi bi-arrow-left me-2"></i> Anterior
                </Button>
                <Button variant="primary" onClick={siguientePregunta}>
                  {indice === preguntas.length - 1 ? (
                    "Finalizar Evaluación"
                  ) : (
                    <>
                      Siguiente <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
