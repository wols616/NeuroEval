import React from "react";
import { Badge, Table } from "react-bootstrap";

const PrintableReport = React.forwardRef(({ reportData, reportType }, ref) => {
  const getScoreColor = (score) => {
    if (score >= 3) return "danger";
    if (score >= 1) return "warning";
    return "secondary";
  };

  // Verificación de datos
  if (!reportData || !reportType) {
    return <div className="p-4">Cargando datos del reporte...</div>;
  }

  // Renderizado para ADI-R
  const renderADIRReport = () => {
    if (!reportData.categorias) {
      return (
        <div className="alert alert-warning">No se encontraron categorías</div>
      );
    }

    return (
      <>
        <h4>Totales por Categoría</h4>
        <div className="d-flex flex-wrap mb-4">
          {["A", "B", "C", "D"].map((cat) => {
            const categoria = reportData.categorias[cat];
            if (!categoria) return null;

            return (
              <div key={cat} className="me-4 mb-2">
                <strong>{cat}:</strong>
                <Badge
                  bg={categoria.total > 0 ? "primary" : "secondary"}
                  className="ms-2"
                >
                  {categoria.total}
                </Badge>
              </div>
            );
          })}
        </div>

        <h4>Detalle por Categoría</h4>
        {["A", "B", "C", "D"].map((cat) => {
          const categoria = reportData.categorias[cat];
          if (!categoria) return null;

          return (
            <div key={cat} className="mb-4">
              <h5>{categoria.titulo}</h5>

              {/* Manejo especial para categoría D */}
              {cat === "D" ? (
                Object.entries(categoria.items || {}).map(([codigo, item]) => (
                  <div key={codigo}>
                    <h6>
                      {codigo} - {item.pregunta}
                    </h6>
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>Respuesta</th>
                          <th>Puntuación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(item.respuestas || []).map((respuesta, idx) => (
                          <tr key={idx}>
                            <td>{respuesta.respuesta}</td>
                            <td className="text-center">
                              <Badge bg={getScoreColor(respuesta.puntuacion)}>
                                {respuesta.puntuacion}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))
              ) : (
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Pregunta</th>
                      <th>Puntuación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoria.items || {})
                      .sort(([key1], [key2]) => key1.localeCompare(key2))
                      .map(([codigo, item]) => (
                        <tr key={codigo}>
                          <td>{codigo}</td>
                          <td>{item.pregunta}</td>
                          <td className="text-center">
                            <Badge bg={getScoreColor(item.puntuacion)}>
                              {item.puntuacion}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Renderizado para ADOS-2 (mantén tu implementación actual)
  const renderADOSReport = () => (
    <>
      <h4>Totales por Categoría</h4>
      <div className="d-flex flex-wrap mb-4">
        {Object.entries(reportData.totales || {}).map(([categoria, total]) => (
          <div key={categoria} className="me-4 mb-2">
            <strong>{categoria}:</strong>
            <Badge bg={total > 0 ? "primary" : "secondary"} className="ms-2">
              {total}
            </Badge>
          </div>
        ))}
      </div>

      <h4>Detalle por Módulo</h4>
      {Object.entries(reportData.modulos || {}).map(([modulo, moduloData]) => (
        <div key={modulo} className="mb-4">
          <h5>Módulo {modulo}</h5>
          {Object.entries(moduloData.categorias || {}).map(
            ([categoria, categoriaData]) => (
              <div key={categoria} className="mb-3">
                <h6>{categoria}</h6>
                <Table bordered className="mb-4">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Actividad</th>
                      <th>Descripción</th>
                      <th>Puntuación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(categoriaData.actividades || []).map(
                      (actividad, index) => (
                        <tr key={actividad.id || index}>
                          <td>{index + 1}</td>
                          <td>{actividad.nombre || "Sin nombre"}</td>
                          <td>{actividad.descripcion || "Sin descripción"}</td>
                          <td className="text-center">
                            <Badge bg={getScoreColor(actividad.puntuacion)}>
                              {actividad.puntuacion}
                            </Badge>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            )
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="printable-report p-5" ref={ref}>
      <div
        className="w-100 mb-3"
        style={{
          background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
          padding: "0.5rem 1rem",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-white">NeuroEval</h2>
      </div>
      <h2 className="text-center mb-4">
        Reporte de Evaluación {reportType} - {reportData.pacienteNombre}
      </h2>
      <div className="mb-4">
        <p>
          <strong>Fecha:</strong> {reportData.fecha}
        </p>
        <p>
          <strong>Especialista:</strong> {reportData.especialistaNombre}
        </p>
      </div>

      {reportType === "ADOS-2" ? renderADOSReport() : renderADIRReport()}

      <div className="mt-4">
        <h4>Diagnóstico</h4>
        <p>{reportData.observaciones || "No se indicó un diagnóstico"}</p>
      </div>

      <div className="text-center mt-5 mb-5">
        <p>Reporte generado el {new Date().toLocaleDateString()}</p>
      </div>

      <div className="mt-5 d-flex align-items-center justify-content-center">
        <div className="d-flex flex-column justify-content-center align-items-center me-5">
          <p>_____________________________________</p>
          <p>Firma del especialista</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center ms-5">
          <p>_____________________________________</p>
          <p>Firma del paciente o responsable</p>
        </div>
      </div>
    </div>
  );
});

export default PrintableReport;
