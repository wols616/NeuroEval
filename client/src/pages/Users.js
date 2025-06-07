import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Table,
  Tab,
  Tabs,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import {
  FaUserPlus,
  FaUserMd,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaKey,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "../styles/users.css";

const Users = () => {
  const [activeTab, setActiveTab] = useState("especialistas");
  const [users, setUsers] = useState({
    Administrador: [],
    Especialista: [],
  });
  const [loading, setLoading] = useState({
    Administrador: false,
    Especialista: false,
  });
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    rol: "Especialista",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers("Administrador");
    fetchUsers("Especialista");
  }, []);

  const fetchUsers = async (type) => {
    try {
      setLoading((prev) => ({ ...prev, [type]: true }));
      setError(null);

      const response = await fetch(`http://localhost:5000/api/users/${type}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar ${type}s`);
      }

      const data = await response.json();
      setUsers((prev) => ({ ...prev, [type]: data }));
    } catch (err) {
      console.error(`Error fetching ${type}s:`, err);
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/${formData.rol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario agregado correctamente",
          confirmButtonColor: "#3085d6",
        });
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          contrasena: "",
          rol: "Especialista",
        });
        fetchUsers(formData.rol);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${currentUser.type}/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            nombre: currentUser.nombre,
            apellido: currentUser.apellido,
            email: currentUser.email,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario actualizado correctamente",
          confirmButtonColor: "#3085d6",
        });
        setShowEditModal(false);
        fetchUsers(currentUser.type);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userType: currentUser.type,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Contraseña actualizada correctamente",
          confirmButtonColor: "#3085d6",
        });
        setShowPasswordModal(false);
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const openEditModal = (user, type) => {
    setCurrentUser({
      id: user.ID,
      nombre: user.Nombre,
      apellido: user.Apellido,
      email: user.Email,
      type,
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (user, type) => {
    setCurrentUser({
      id: user.ID,
      type,
    });
    setShowPasswordModal(true);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="h4 mb-0">
                <FaUserShield className="me-2" />
                Gestión de Usuarios
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Button
                  variant={
                    activeTab === "especialistas"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setActiveTab("especialistas")}
                  className="me-2"
                >
                  <FaUserMd className="me-2" />
                  Especialistas
                </Button>
                <Button
                  variant={
                    activeTab === "administradores"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setActiveTab("administradores")}
                >
                  <FaUserShield className="me-2" />
                  Administradores
                </Button>
              </div>

              {activeTab === "especialistas" ? (
                loading.Especialista ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Apellido</th>
                          <th>Email</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.Especialista.map((user) => (
                          <tr key={user.ID}>
                            <td>{user.ID}</td>
                            <td>{user.Nombre}</td>
                            <td>{user.Apellido}</td>
                            <td>{user.Email}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() =>
                                  openEditModal(user, "Especialista")
                                }
                              >
                                <FaEdit /> Editar
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  openPasswordModal(user, "Especialista")
                                }
                              >
                                <FaKey /> Contraseña
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )
              ) : loading.Administrador ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.Administrador.map((user) => (
                        <tr key={user.ID}>
                          <td>{user.ID}</td>
                          <td>{user.Nombre}</td>
                          <td>{user.Apellido}</td>
                          <td>{user.Email}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() =>
                                openEditModal(user, "Administrador")
                              }
                            >
                              <FaEdit /> Editar
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                openPasswordModal(user, "Administrador")
                              }
                            >
                              <FaKey /> Contraseña
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para editar usuario */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="modal-custom modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 d-flex flex-column justify-content-start align-items-start">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentUser?.nombre || ""}
                onChange={(e) =>
                  setCurrentUser((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column justify-content-start align-items-start">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={currentUser?.apellido || ""}
                onChange={(e) =>
                  setCurrentUser((prev) => ({
                    ...prev,
                    apellido: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column justify-content-start align-items-start">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser?.email || ""}
                onChange={(e) =>
                  setCurrentUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        className="modal-custom modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 d-flex flex-column justify-content-start align-items-start">
              <Form.Label>Nueva Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column justify-content-start align-items-start">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Cambiar Contraseña
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Formulario para agregar nuevo usuario */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="h4 mb-0">
                <FaUserPlus className="me-2" />
                Agregar Nuevo Usuario
              </h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="contrasena"
                          value={formData.contrasena}
                          onChange={handleInputChange}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Especialista">Especialista</option>
                        <option value="Administrador">Administrador</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit">
                    Agregar Usuario
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Users;
