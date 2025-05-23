import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          user?.role === "Administrador"
            ? `http://localhost:5000/api/administrador/${user.id}`
            : `http://localhost:5000/api/especialista/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          // Si la respuesta no es OK, lanzar error con el texto de la respuesta
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Opcional: manejar específicamente el error 403
        if (error.message.includes("403")) {
          // Podrías redirigir al login o limpiar el token
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse">
              <h1 className="text-lg font-semibold text-gray-900">
                Cargando...
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Bienvenido {userData?.Nombre || "Usuario"}
          </h1>
        </div>
        <p className="text-gray-600">
          lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quod.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
