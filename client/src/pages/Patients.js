import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { Spinner, Modal, Button, Form, Alert } from "react-bootstrap";
import "../styles/patiens.css";

const Patients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setPatients(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Error al cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  const handleAddPatient = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newPatient),
    });

    const data = await response.json(); // Parseamos el json de respuesta

    if (response.ok) {
      setNewPatient({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        direccion: "",
        telefono: "",
        email: "",
      });
      setSuccess("Paciente agregado correctamente");
      fetchPatients();
      setError(null); // limpiamos cualquier error anterior
    } else {
      setError(data.error || "Error al agregar el paciente"); // Mostrar el mensaje que viene del backend
    }
  } catch (error) {
    console.error("Error adding patient:", error);
    setError("Error al agregar el paciente");
  }
};
*/

  const handleAddPatient = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPatient.email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    const telefonoValido = /^\d{4}-\d{4}$/.test(newPatient.telefono);
    if (!telefonoValido) {
      setError("El número de teléfono debe tener el formato 1234-5678.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPatient),
      });

      const data = await response.json();

      if (response.ok) {
        setNewPatient({
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          direccion: "",
          telefono: "",
          email: "",
        });
        setSuccess("Paciente agregado correctamente");
        fetchPatients();
        setError(null);
      } else {
        setError(data.error || "Error al agregar el paciente");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      setError("Error al agregar el paciente");
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient({
      nombre: patient.Nombre,
      apellido: patient.Apellido,
      fechaNacimiento: patient.FechaNacimiento.split("T")[0],
      direccion: patient.Direccion,
      telefono: patient.Telefono,
      email: patient.Email,
    });
    setShowModal(true);
  };

  const handleUpdatePatient = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPatient.email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    const telefonoValido = /^\d{4}-\d{4}$/.test(newPatient.telefono);
    if (!telefonoValido) {
      setError("El número de teléfono debe tener el formato 1234-5678.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${editingPatient.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newPatient),
        }
      );

      if (response.ok) {
        setShowModal(false);
        setEditingPatient(null);
        setNewPatient({
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          direccion: "",
          telefono: "",
          email: "",
        });
        setSuccess("Paciente actualizado correctamente");
        fetchPatients();
      } else {
        setError("Error al actualizar el paciente");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      setError("Error al actualizar el paciente");
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/patients/${patientId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setSuccess("Paciente eliminado correctamente");
          fetchPatients();
        } else {
          setError("Error al eliminar el paciente");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        setError("Error al eliminar el paciente");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Gestión de Pacientes</h2>
            </div>
            <div className="card-body">
              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                  <Button
                    variant="outline-danger"
                    onClick={() => setError("")}
                    className="position-absolute top-0 end-0 p-1"
                    style={{ border: "none", background: "transparent" }}
                  >
                    ×
                  </Button>
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  {success}
                  <Button
                    variant="outline-success"
                    onClick={() => setSuccess("")}
                    className="position-absolute top-0 end-0 p-1"
                    style={{ border: "none", background: "transparent" }}
                  >
                    ×
                  </Button>
                </Alert>
              )}

              <div className="mb-5">
                <h3 className="h5 mb-3">Nuevo Paciente</h3>
                <Form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={newPatient.nombre}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={newPatient.apellido}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={newPatient.fechaNacimiento}
                        onChange={handleInputChange}
                        min="1925-01-01"
                        max={
                          new Date(Date.now() - 86400000)
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={newPatient.direccion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={newPatient.telefono}
                        onChange={(e) => {
                          let val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 8); // solo números max 8
                          if (val.length > 4) {
                            val = val.slice(0, 4) + "-" + val.slice(4);
                          }
                          setNewPatient((prev) => ({ ...prev, telefono: val }));
                        }}
                        pattern="\d{4}-\d{4}"
                        maxLength={9}
                        inputMode="numeric"
                        placeholder="####-####"
                        title="El teléfono debe tener el formato 1234-5678"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={newPatient.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ejemplo@correo.com"
                        title="Ingrese un correo electrónico válido"
                      />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleAddPatient}
                    className="mt-2"
                  >
                    Agregar Paciente
                  </Button>
                </Form>
              </div>

              <div className="mt-4">
                <h3 className="h5 mb-3">Pacientes Registrados</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.ID}>
                          <td>
                            {patient.Nombre} {patient.Apellido}
                          </td>
                          <td>
                            {new Date(
                              patient.FechaNacimiento
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditPatient(patient)}
                              className="me-2"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeletePatient(patient.ID)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para edición */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="modal-dialog"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newPatient.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={newPatient.apellido}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={newPatient.fechaNacimiento}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={newPatient.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={newPatient.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newPatient.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdatePatient}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Patients;
