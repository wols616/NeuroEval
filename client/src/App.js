import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AdirEvaluation from "./pages/AdirEvaluation";
import AdosEvaluation from "./pages/AdosEvaluation";
import Dsm5Evaluation from "./pages/Dsm5Evaluation";
import Reports from "./pages/Reports";
import PatientReports from "./pages/PatientReports";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute.js";
import RoleProtectedRoute from "./components/RoleProtectedRoute.js";
import Layout from "./components/Layout";
import PatientSelection from "./pages/PatientSelection";
import AdosModuleSelection from "./components/AdosModuleSelection.js";
import AdosEvaluationView from "./pages/AdosEvaluationView.js";
import ResultadosADIR from "./pages/ResultadosADIR.js";
import PrivacyPolicy from "./pages/PrivacyPolicy.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute>
                <Layout>
                  <Patients />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/adir/:patientId"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <AdirEvaluation />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/evaluaciones/adir/:evaluacionID"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <ResultadosADIR />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/ados/:patientId"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <AdosModuleSelection />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/ados-evaluation/:patientId"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <AdosEvaluation />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/evaluaciones/ados/:evaluacionID"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <AdosEvaluationView />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/dsm5/:patientId"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <Dsm5Evaluation />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/patient-selection"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoles={["Especialista"]}>
                  <Layout>
                    <PatientSelection />
                  </Layout>
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports/:patientId"
            element={
              <PrivateRoute>
                <Layout>
                  <PatientReports />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["Administrador"]}>
                  <Layout>
                    <Users />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
