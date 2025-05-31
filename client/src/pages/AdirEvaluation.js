import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const puntuaciones = [
  {
    value: 0,
    label: "0 - Comportamiento normal o no hay problemas significativos",
  },
  { value: 1, label: "1 - Presencia leve o dudosa del comportamiento" },
  { value: 2, label: "2 - Presencia clara y anormal del comportamiento" },
  {
    value: 3,
    label: "3 - Comportamiento extremadamente anormal (raramente se usa)",
  },
  {
    value: 7,
    label: "7 - Comportamiento anormal pero no específico del autismo",
  },
  { value: 8, label: "8 - Información no disponible o inaplicable" },
  { value: 9, label: "9 - No sabe / no recuerda" },
];

export default function AdirEvaluation() {
  const { patientId } = useParams();
  const pacienteID = parseInt(patientId);
  const { user } = useAuth();

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
      // Crear evaluación
      const crearRes = await fetch("http://localhost:5000/api/evaluaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        "http://localhost:5000/api/preguntas-con-respuestas"
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
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
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
    window.location.href = "/dashboard";
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
            headers: { "Content-Type": "application/json" },
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
      await guardarPuntuaciones();

      if (indice < preguntas.length - 1) {
        setIndice((prev) => prev + 1);
        setRespuestasSeleccionadas({});
      } else {
        setEvaluacionCompletada(true);
      }
    } catch (err) {
      console.error("Error al avanzar:", err);
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
      }
    }
  };

  const guardarDiagnostico = async () => {
    try {
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

      // Redirigir o mostrar mensaje de éxito
      alert("Evaluación completada y guardada exitosamente!");
    } catch (err) {
      console.error("Error al guardar diagnóstico:", err);
    }
  };

  if (!evaluacionID) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">ADI-R Evaluation</h2>
        <p className="text-black mb-6">
          Para comenzar la evaluación ADI-R para este paciente, haga clic en el
          botón "Iniciar Evaluación".
        </p>
        <button
          onClick={iniciarEvaluacion}
          className="px-6 py-3 btn btn-primary"
        >
          Iniciar Evaluación
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">ADI-R Evaluation</h2>
        <div className="flex justify-center items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={iniciarEvaluacion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (evaluacionCompletada) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Diagnóstico Final</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="6"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          placeholder="Escriba aquí el diagnóstico..."
        />
        <button
          onClick={guardarDiagnostico}
          className="px-4 py-2 btn btn-primary"
        >
          Guardar Diagnóstico
        </button>
      </div>
    );
  }

  const preguntaActual = preguntas[indice];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Evaluación ADI-R</h2>
      <div className="mb-4">
        <button
          onClick={salirEvaluacion}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 btn btn-outline-danger"
          style={{ color: "red" }}
        >
          Salir
        </button>
        <span className="text-sm text-gray-500">
          Pregunta {indice + 1} de {preguntas.length}
        </span>
        <h3 className="text-xl font-semibold">{preguntaActual.Categoria}</h3>
        <p className="text-lg mb-4">{preguntaActual.Pregunta}</p>
      </div>

      <div className="space-y-4 mb-6">
        {preguntaActual.Respuestas.map((respuesta) => (
          <div key={respuesta.ID} className="border-b pb-4">
            <p className="font-medium mb-2">{respuesta.Respuesta}</p>
            <select
              className="w-full p-2 border rounded"
              //ANCHOR - value={respuestasSeleccionadas[respuesta.ID] || ""}
              value={
                respuestasSeleccionadas.hasOwnProperty(respuesta.ID)
                  ? respuestasSeleccionadas[respuesta.ID]
                  : ""
              }
              onChange={(e) =>
                manejarCambio(respuesta.ID, parseInt(e.target.value))
              }
            >
              <option value="">Seleccione una puntuación</option>
              {puntuaciones.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={preguntaAnterior}
          disabled={indice === 0}
          className={`px-4 py-2 ${
            indice === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "btn btn-outline-secondary"
          }`}
        >
          Anterior
        </button>
        <button
          onClick={siguientePregunta}
          className="px-4 py-2 btn btn-outline-primary"
        >
          {indice === preguntas.length - 1 ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
