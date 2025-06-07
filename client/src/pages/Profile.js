import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialProfile, setInitialProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/${user.role.toLowerCase()}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }

      const data = await response.json();

      if (!data) {
        throw new Error("Perfil no encontrado");
      }

      setProfile(data);
      setInitialProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Preparar los datos completos para enviar
      const data = {
        nombre: profile.Nombre,
        apellido: profile.Apellido,
        email: profile.Email,
      };

      // Verificar si hay cambios
      const hasChanges =
        profile.Nombre !== initialProfile.Nombre ||
        profile.Apellido !== initialProfile.Apellido ||
        profile.Email !== initialProfile.Email;

      if (!hasChanges) {
        setError("No se han realizado cambios");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/${user.role.toLowerCase()}/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData); // Log para depuración

      if (response.ok) {
        setError("");
        // Actualizar el estado local con los datos devueltos por el servidor
        setProfile(responseData.data);
        setInitialProfile(responseData.data);
        // Mostrar mensaje de éxito
        setTimeout(() => setError("Perfil actualizado exitosamente"), 100);
      } else {
        setError(
          responseData.error ||
            responseData.details ||
            "Error al actualizar el perfil"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error al actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="d-flex flex-column align-items-center p-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Perfil de {user.role}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="my-2">
                    <label className="" style={{ fontWeight: "bold" }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={profile.Nombre}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          Nombre: e.target.value,
                        }))
                      }
                      className="input-group"
                    />
                  </div>
                  <div className="my-2">
                    <label className="" style={{ fontWeight: "bold" }}>
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={profile.Apellido}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          Apellido: e.target.value,
                        }))
                      }
                      className="input-group"
                    />
                  </div>
                  <div className="my-2">
                    <label className="" style={{ fontWeight: "bold" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.Email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          Email: e.target.value,
                        }))
                      }
                      className="input-group"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button type="submit" className="btn btn-primary">
                    Actualizar Perfil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
