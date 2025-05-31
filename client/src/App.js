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
import Layout from "./components/Layout";
import PatientSelection from "./pages/PatientSelection";
import AdosModuleSelection from "./components/AdosModuleSelection.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
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
                <Layout>
                  <AdirEvaluation />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ados/:patientId"
            element={
              <PrivateRoute>
                <Layout>
                  <AdosModuleSelection />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/ados-evaluation/:patientId"
            element={
              <PrivateRoute>
                <Layout>
                  <AdosEvaluation />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/dsm5/:patientId"
            element={
              <PrivateRoute>
                <Layout>
                  <Dsm5Evaluation />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/patient-selection"
            element={
              <PrivateRoute>
                <Layout>
                  <PatientSelection />
                </Layout>
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
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
