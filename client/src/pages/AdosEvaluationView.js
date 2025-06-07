import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Accordion, Badge } from "react-bootstrap";

const AdosEvaluationView = () => {
  const { evaluacionID } = useParams();
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/ados/evaluacion/${evaluacionID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al cargar los datos");

        const data = await response.json();
        setEvaluationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [evaluacionID]);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error)
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  if (!evaluationData)
    return <div className="alert alert-info mt-5">No se encontraron datos</div>;

  const getScoreColor = (score) => {
    if (score >= 3) return "danger";
    if (score >= 1) return "warning";
    return "secondary";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Resultados de Evaluación ADOS-2</h2>

      {/* Totales por categoría */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Totales por Categoría</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {Object.entries(evaluationData.totales).map(
              ([categoria, total]) => (
                <div key={categoria} className="me-4 mb-2">
                  <strong>{categoria}:</strong>
                  <Badge
                    bg={total > 0 ? "primary" : "secondary"}
                    className="ms-2"
                  >
                    {total}
                  </Badge>
                </div>
              )
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Actividades por módulo y categoría */}
      <Accordion defaultActiveKey="0">
        {Object.entries(evaluationData.modulos || {}).map(
          ([modulo, moduloData], modIndex) => (
            <Accordion.Item
              key={`modulo-${modulo}`}
              eventKey={modIndex.toString()}
            >
              <Accordion.Header>
                <strong>Módulo {modulo}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {Object.entries(moduloData.categorias || {}).map(
                  ([categoria, categoriaData]) => (
                    <div key={`cat-${modulo}-${categoria}`} className="mb-4">
                      <h5 className="mb-3">{categoria}</h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th style={{ width: "5%" }}>#</th>
                            <th style={{ width: "30%" }}>Actividad</th>
                            <th style={{ width: "45%" }}>Descripción</th>
                            <th style={{ width: "10%" }}>Puntuación</th>
                            <th style={{ width: "10%" }}>Observación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoriaData.actividades.map(
                            (actividad, actIndex) => (
                              <tr key={actividad.id}>
                                <td>{actIndex + 1}</td>
                                <td>{actividad.nombre}</td>
                                <td>{actividad.descripcion}</td>
                                <td className="text-center">
                                  <Badge pill bg={"primary"}>
                                    {actividad.puntuacion}
                                  </Badge>
                                </td>
                                <td>{actividad.observacion}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )
                )}
              </Accordion.Body>
            </Accordion.Item>
          )
        )}
      </Accordion>
    </div>
  );
};

export default AdosEvaluationView;
