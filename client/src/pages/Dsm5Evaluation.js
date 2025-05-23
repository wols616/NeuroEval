import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dsm5.css"; // Asegúrate de importar el CSS

export default function Dsm5Evaluation() {
  const { patientId } = useParams();
  const pacienteID = parseInt(patientId);
  const { user } = useAuth();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [respuestasValidas, setRespuestasValidas] = useState(true);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState("");
  const [total, setTotal] = useState(0);
  const [descripcionesVisibles, setDescripcionesVisibles] = useState({});
  const [seleccionados, setSeleccionados] = useState({
    ADI_R: false,
    ADOS_2: false,
  });

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dsm5", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener preguntas");
        }
        const data = await response.json();
        setPreguntas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPreguntas();
  }, []);

  const toggleDescripcion = (id) => {
    setDescripcionesVisibles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const manejarCambio = (id, valor) => {
    setRespuestas({
      ...respuestas,
      [id]: valor === "" ? null : parseInt(valor),
    });
  };

  const handleMostrarEleccion = () => {
    const divResultado = document.getElementById("divResultado");
    if (divResultado.style.display === "block") {
      divResultado.style.display = "none";
    } else {
      divResultado.style.display = "block";
    }
  };

  const validarRespuestas = () => {
    let esValido = true;
    for (const pregunta of preguntas) {
      if (!respuestas[pregunta.ID]) {
        esValido = false;
        break;
      }
    }
    setRespuestasValidas(esValido);

    if (!esValido) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    return esValido;
  };

  const calcularTotal = () => {
    if (!validarRespuestas()) {
      return;
    }
    const total = Object.values(respuestas).reduce(
      (acc, val) => acc + (val || 0),
      0
    );
    let interpretacion = "";

    if (total >= 7 && total <= 11) {
      interpretacion = "Bajo nivel de indicios.";
    } else if (total >= 12 && total <= 16) {
      interpretacion = "Algunos indicios. Se recomienda observar más.";
    } else if (total >= 17 && total <= 21) {
      interpretacion =
        "Nivel alto de indicios. Se sugiere evaluación profesional.";
    } else {
      interpretacion = "Puntuación fuera del rango esperado.";
    }
    setTotal(total);
    setResultado(interpretacion);
    handleMostrarEleccion();
  };

  const manejarSeleccion = (tipo) => {
    setSeleccionados((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  const finalizarEvaluacion = async () => {
    try {
      console.log("Iniciando evaluación...");

      if (!user || !user.id) {
        throw new Error("Usuario no identificado");
      }

      const dataEvaluacion = {
        PacienteID: pacienteID,
        EspecialistaID: user.id,
        Fecha: new Date().toISOString(),
        TipoEvaluacion: "DSM-5",
      };

      console.log("Enviando solicitud de evaluación...");

      const resEvaluacion = await fetch(
        "http://localhost:5000/api/evaluaciones",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataEvaluacion),
        }
      );

      if (!resEvaluacion.ok) {
        throw new Error(
          `Error al registrar evaluación: ${resEvaluacion.statusText}`
        );
      }

      const resData = await resEvaluacion.json();
      console.log("Evaluación registrada con éxito:", resData);

      if (!resData.success || !resData.id) {
        throw new Error("Evaluación no generada correctamente");
      }

      const evaluacionID = resData.id;
      const dataReporte = {
        EvaluacionID: evaluacionID,
        FechaGeneracion: new Date().toISOString(),
        Contenido: resultado,
      };

      console.log("Guardando reporte...");

      const resReportes = await fetch("http://localhost:5000/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataReporte),
      });

      if (!resReportes.ok) {
        throw new Error("Error al generar el reporte");
      }

      let apto =
        seleccionados.ADI_R && seleccionados.ADOS_2
          ? "ambos"
          : seleccionados.ADI_R
          ? "adir"
          : seleccionados.ADOS_2
          ? "ados"
          : "ninguno";

      const dataDsmt = {
        EvaluacionID: evaluacionID,
        Apto: apto,
        Puntuacion: total,
      };

      console.log("Guardando evaluación DSM-5...");

      const resDsmt = await fetch("http://localhost:5000/api/dsm5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataDsmt),
      });

      if (!resDsmt.ok) {
        throw new Error("Error al guardar la evaluación DSM-5");
      }

      console.log("Evaluación DSM-5 guardada correctamente");

      // SOLO cerrar el modal si todo fue exitoso
      setTimeout(() => {
        alert("Evaluación finalizada y enviada.");
      }, 500); // Agregar un pequeño delay para evitar que se cierre antes de actualizar la UI
    } catch (error) {
      console.error("Error en finalizarEvaluacion:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="evaluation-container">
      <h2 className="evaluation-title">Evaluación DSM-5</h2>

      {!respuestasValidas && (
        <div className="alert alert-warning mt-3" role="alert">
          <strong>¡Atención!</strong> Debes completar todas las respuestas antes
          de continuar.
        </div>
      )}
      <ul className="evaluation-list">
        {preguntas.map((pregunta) => (
          <li key={pregunta.ID} className="evaluation-item">
            <strong>{pregunta.Titulo}</strong>
            <p>{pregunta.Pregunta}</p>
            <button
              className="toggle-button btn btn-outline-primary"
              onClick={() => toggleDescripcion(pregunta.ID)}
            >
              {descripcionesVisibles[pregunta.ID] ? (
                <i class="bi bi-arrows-collapse"></i>
              ) : (
                <i class="bi bi-arrows-expand"></i>
              )}
            </button>

            {descripcionesVisibles[pregunta.ID] && (
              <p className="evaluation-description">{pregunta.Descripcion}</p>
            )}
            <select
              className="evaluation-select"
              required
              onChange={(e) => manejarCambio(pregunta.ID, e.target.value)}
              value={respuestas[pregunta.ID] || ""}
            >
              <option value="">Selecciona una opción</option>
              <option value="1">1 - A veces</option>
              <option value="2">2 - Frecuentemente</option>
              <option value="3">3 - Extremadamente anormal</option>
            </select>
          </li>
        ))}
      </ul>

      <button className="btn btn-primary" onClick={calcularTotal}>
        Calcular Sumatoria
      </button>

      <div className="mt-5 displaynone" id="divResultado">
        <div className="alert alert-warning">
          <strong>
            Advertencia, este Test es solamente para orientación no es un
            resultado final, indicar abajo las pruebas que se realizarán para
            obtener un diagnostico más detallado
          </strong>
        </div>
        <h3>Resultado de Evaluación</h3>
        <p>{resultado}</p>

        <div className="options-container">
          <div
            className={`option-box ${seleccionados.ADI_R ? "selected" : ""}`}
            onClick={() => manejarSeleccion("ADI_R")}
          >
            ADI-R
          </div>
          <div
            className={`option-box ${seleccionados.ADOS_2 ? "selected" : ""}`}
            onClick={() => manejarSeleccion("ADOS_2")}
          >
            ADOS-2
          </div>
        </div>

        <button className="finalize-button" onClick={finalizarEvaluacion}>
          Finalizar
        </button>
      </div>
    </div>
  );
}
