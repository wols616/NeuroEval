import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useAuth } from "../contexts/AuthContext";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import "../styles/patiens.css";

const MySwal = withReactContent(Swal);

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
  const [searchTerm, setSearchTerm] = useState("");

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
    } catch (error) {
      console.error("Error fetching patients:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar los pacientes",
        confirmButtonColor: "#3085d6",
      });
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

  const handleAddPatient = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPatient.email)) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Ingrese un correo electrónico válido.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const telefonoValido = /^\d{4}-\d{4}$/.test(newPatient.telefono);
    if (!telefonoValido) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "El número de teléfono debe tener el formato 1234-5678.",
        confirmButtonColor: "#3085d6",
      });
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

        MySwal.fire({
          icon: "success",
          title: "Éxito",
          text: "Paciente agregado correctamente",
          confirmButtonColor: "#3085d6",
        });

        fetchPatients();
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al agregar el paciente",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar el paciente",
        confirmButtonColor: "#3085d6",
      });
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
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Ingrese un correo electrónico válido.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const telefonoValido = /^\d{4}-\d{4}$/.test(newPatient.telefono);
    if (!telefonoValido) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "El número de teléfono debe tener el formato 1234-5678.",
        confirmButtonColor: "#3085d6",
      });
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

        MySwal.fire({
          icon: "success",
          title: "Éxito",
          text: "Paciente actualizado correctamente",
          confirmButtonColor: "#3085d6",
        });

        fetchPatients();
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Error al actualizar el paciente",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el paciente",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleDeletePatient = async (patientId) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
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
          MySwal.fire({
            icon: "success",
            title: "Eliminado",
            text: "Paciente eliminado correctamente",
            confirmButtonColor: "#3085d6",
          });
          fetchPatients();
        } else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Error al eliminar el paciente",
            confirmButtonColor: "#3085d6",
          });
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Error al eliminar el paciente",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.Nombre} ${patient.Apellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

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
            <div
              className="card-header text-white"
              style={{ backgroundColor: "#3682D9" }}
            >
              <h2 className="h4 mb-0">Gestión de Pacientes</h2>
            </div>
            <div className="card-body">
              <div className="mb-5">
                <h2 className="mb-3 text-center">Nuevo Paciente</h2>
                <Form>
                  <div className="row text-center">
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
                            .slice(0, 8);
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
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-primary"
                      onClick={handleAddPatient}
                      className="mt-2 w-50"
                    >
                      Agregar Paciente
                    </Button>
                  </div>
                </Form>
              </div>

              <div className="mt-4">
                <h3 className="text-center mb-3">Pacientes Registrados</h3>
                <div className="search-box w-100" style={{}}>
                  <Form.Control
                    type="text"
                    placeholder="Buscar pacientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="table-responsive text-center">
                  <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
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
        className="modal-custom modal-backdrop-custom"
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
