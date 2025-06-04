import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Badge, Accordion, Table } from "react-bootstrap";

const ResultadosADIR = () => {
  const { evaluacionID } = useParams();
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calcularTotalGeneral = () => {
    if (!resultados || !resultados.categorias) return 0;

    return Object.values(resultados.categorias).reduce(
      (total, categoria) => total + (categoria.total || 0),
      0
    );
  };

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/adir/resultados/${evaluacionID}`
        );
        setResultados(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los resultados");
        setLoading(false);
      }
    };

    fetchResultados();
  }, [evaluacionID]);

  if (loading)
    return <div className="text-center mt-5">Cargando resultados...</div>;
  if (error)
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  if (!resultados)
    return (
      <div className="alert alert-info mt-5">No se encontraron resultados</div>
    );

  // Función para determinar el color del badge según la puntuación
  const getScoreColor = (score) => {
    if (score >= 3) return "danger";
    if (score >= 1) return "warning";
    return "secondary";
  };

  // Ordenar las categorías (A, B, C, D)
  const categoriasOrdenadas = ["A", "B", "C", "D"].filter(
    (cat) => resultados.categorias[cat]
  );

  const totalGeneral = calcularTotalGeneral();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Resultados de la Evaluación ADIR</h2>

      {/* Totales por categoría */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Totales por Categoría</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {categoriasOrdenadas.map((categoria) => (
              <div key={`total-${categoria}`} className="me-4 mb-2">
                <strong>{categoria}:</strong>
                <Badge
                  bg={
                    resultados.categorias[categoria].total > 0
                      ? "primary"
                      : "secondary"
                  }
                  className="ms-2"
                >
                  {resultados.categorias[categoria].total}
                </Badge>
              </div>
            ))}
            <div className="me-4 mb-2">
              <strong>Total General:</strong>
              <Badge bg="info" className="ms-2">
                {totalGeneral}
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Detalle por categoría */}
      <Accordion defaultActiveKey="0">
        {categoriasOrdenadas.map((categoria, index) => (
          <Accordion.Item key={`cat-${categoria}`} eventKey={index.toString()}>
            <Accordion.Header>
              <strong>{resultados.categorias[categoria].titulo}</strong>
            </Accordion.Header>
            <Accordion.Body>
              {/* Para categorías A, B, C */}
              {categoria !== "D" && (
                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Ítem</th>
                      <th style={{ width: "60%" }}>Pregunta</th>
                      <th style={{ width: "10%" }}>Puntuación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resultados.categorias[categoria].items)
                      .sort(([key1], [key2]) => key1.localeCompare(key2))
                      .map(([codigo, item]) => (
                        <tr key={codigo}>
                          <td>{codigo}</td>
                          <td>{item.pregunta}</td>
                          <td className="text-center">
                            <Badge pill bg={getScoreColor(item.puntuacion)}>
                              {item.puntuacion}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}

              {/* Para categoría D (especial) */}
              {categoria === "D" &&
                Object.entries(resultados.categorias[categoria].items).map(
                  ([codigo, item]) => (
                    <div key={codigo} className="mb-4">
                      <h5 className="mb-3">
                        {codigo} - {item.pregunta}
                      </h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th style={{ width: "70%" }}>Respuesta</th>
                            <th style={{ width: "10%" }}>Puntuación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.respuestas.map((respuesta, idx) => (
                            <tr key={idx}>
                              <td>{respuesta.respuesta}</td>
                              <td className="text-center">
                                <Badge
                                  pill
                                  bg={getScoreColor(respuesta.puntuacion)}
                                >
                                  {respuesta.puntuacion}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )
                )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ResultadosADIR;
