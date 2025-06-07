// components/EvaluationCharts.js
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EvaluationCharts = () => {
  const [evaluationTypes, setEvaluationTypes] = useState(null);
  const [adosScores, setAdosScores] = useState(null);
  const [adirDistribution, setAdirDistribution] = useState(null);
  const [dsm5Results, setDsm5Results] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, adosRes, adirRes, dsm5Res] = await Promise.all([
          axios.get("http://localhost:5000/api/evaluations/count-by-type"),
          axios.get("http://localhost:5000/api/ados/average-scores"),
          axios.get("http://localhost:5000/api/adir/score-distribution"),
          axios.get("http://localhost:5000/api/dsm5/results"),
        ]);

        setEvaluationTypes(typesRes.data);
        setAdosScores(adosRes.data);
        setAdirDistribution(adirRes.data);
        setDsm5Results(dsm5Res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando gráficas...</div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Distribución por Tipo de Evaluación</h5>
            </div>
            <div className="card-body">
              {evaluationTypes && (
                <Pie
                  data={{
                    labels: evaluationTypes.map((item) => item.TipoEvaluacion),
                    datasets: [
                      {
                        data: evaluationTypes.map((item) => item.count),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.7)",
                          "rgba(54, 162, 235, 0.7)",
                          "rgba(255, 206, 86, 0.7)",
                          "rgba(75, 192, 192, 0.7)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Evaluaciones por Tipo",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Resultados DSM-5</h5>
            </div>
            <div className="card-body">
              {dsm5Results && (
                <Pie
                  data={{
                    labels: dsm5Results.map((item) => item.Apto),
                    datasets: [
                      {
                        data: dsm5Results.map((item) => item.count),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.7)",
                          "rgba(54, 162, 235, 0.7)",
                          "rgba(255, 206, 86, 0.7)",
                          "rgba(75, 192, 192, 0.7)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Resultados DSM-5",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Puntuaciones Promedio ADOS por Categoría</h5>
            </div>
            <div className="card-body">
              {adosScores && (
                <Bar
                  data={{
                    labels: adosScores.map((item) => item.Categoria),
                    datasets: [
                      {
                        label: "Puntuación Promedio",
                        data: adosScores.map((item) => item.average),
                        backgroundColor: "rgba(54, 162, 235, 0.7)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Puntuación Promedio",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Categoría",
                        },
                      },
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: "ADOS - Puntuaciones por Categoría",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Distribución de Puntuaciones ADI-R</h5>
            </div>
            <div className="card-body">
              {adirDistribution && (
                <Bar
                  data={{
                    labels: adirDistribution.map((item) => item.score_range),
                    datasets: [
                      {
                        label: "Número de Evaluaciones",
                        data: adirDistribution.map((item) => item.count),
                        backgroundColor: "rgba(255, 159, 64, 0.7)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Número de Evaluaciones",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Rango de Puntuación",
                        },
                      },
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: "Distribución ADI-R",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationCharts;
