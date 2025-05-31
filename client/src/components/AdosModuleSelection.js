import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdosModuleSelection = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState("T");
  const [loading, setLoading] = useState(false);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const handleContinue = () => {
    navigate(`/ados-evaluation/${patientId}`, {
      state: {
        selectedModule,
        from: location.state?.from || "/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Seleccionar Módulo ADOS-2
          </h2>

          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Por favor seleccione el módulo ADOS-2 que corresponde al paciente:
            </p>

            <div className="grid grid-cols-2 gap-4">
              {["T", "1", "2", "3", "4"].map((module) => (
                <button
                  key={module}
                  onClick={() => handleModuleSelect(module)}
                  className={`py-3 px-4 border rounded-lg text-center transition-colors ${
                    selectedModule === module
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Módulo {module}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleContinue}
                className="w-full btn btn-primary py-2 px-4"
              >
                Continuar a la Evaluación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdosModuleSelection;
