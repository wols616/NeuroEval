import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Swal from "sweetalert2";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialProfile, setInitialProfile] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al cargar el perfil",
        confirmButtonColor: "#3085d6",
      });
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

      Swal.fire({
        title: "Actualizando perfil...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

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

      if (response.ok) {
        setError("");
        setProfile(responseData.data);
        setInitialProfile(responseData.data);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Perfil actualizado correctamente",
          confirmButtonColor: "#3085d6",
        });
      } else {
        throw new Error(
          responseData.error ||
            responseData.details ||
            "Error al actualizar el perfil"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al actualizar el perfil",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const validatePassword = (password) => {
    // Validar que tenga al menos una mayúscula, una minúscula y un número
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real
    if (name === "newPassword") {
      if (value.length > 0 && !validatePassword(value)) {
        setPasswordErrors((prev) => ({
          ...prev,
          newPassword:
            "La contraseña debe contener mayúsculas, minúsculas y al menos un número",
        }));
      } else {
        setPasswordErrors((prev) => ({
          ...prev,
          newPassword: "",
        }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== passwordData.newPassword) {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "Las contraseñas no coinciden",
        }));
      } else {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validaciones adicionales antes de enviar
    if (!passwordData.currentPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: "Ingrese su contraseña actual",
      }));
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: "Ingrese una nueva contraseña",
      }));
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword:
          "La contraseña debe contener mayúsculas, minúsculas y al menos un número",
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    try {
      Swal.fire({
        title: "Cambiando contraseña...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Contraseña actualizada correctamente",
          confirmButtonColor: "#3085d6",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setPasswordErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(data.error || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al cambiar la contraseña",
        confirmButtonColor: "#3085d6",
      });

      if (error.message.includes("Current password is incorrect")) {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: "La contraseña actual es incorrecta",
        }));
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={8} lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Perfil de {user.role}
              </h2>
            </Card.Header>

            <Card.Body className="">
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleUpdate}>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="formNombre" className="mb-3">
                      <Form.Label>
                        <strong>Nombre</strong>
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl
                          type="text"
                          name="nombre"
                          value={profile.Nombre || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              Nombre: e.target.value,
                            }))
                          }
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="formApellido" className="mb-3">
                      <Form.Label>
                        <strong>Apellido</strong>
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl
                          type="text"
                          name="apellido"
                          value={profile.Apellido || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              Apellido: e.target.value,
                            }))
                          }
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="formEmail" className="mb-4">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-envelope-fill"></i>
                    </InputGroup.Text>
                    <FormControl
                      type="email"
                      name="email"
                      value={profile.Email || ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          Email: e.target.value,
                        }))
                      }
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="btn btn-outline-secondary"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-4 py-2"
                  >
                    <i className="bi bi-key-fill me-2"></i>
                    {showPasswordForm ? "Cancelar" : "Cambiar Contraseña"}
                  </Button>

                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="px-4 py-2"
                  >
                    <i className="bi bi-save-fill me-2"></i>
                    Actualizar Perfil
                  </Button>
                </div>
              </Form>

              {showPasswordForm && (
                <Form onSubmit={handlePasswordSubmit} className="mt-4">
                  <h5 className="mb-3">Cambiar Contraseña</h5>

                  <Form.Group controlId="formCurrentPassword" className="mb-3">
                    <Form.Label>
                      <strong>Contraseña Actual</strong>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <FormControl
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.currentPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.currentPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formNewPassword" className="mb-3">
                    <Form.Label>
                      <strong>Nueva Contraseña</strong>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <FormControl
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.newPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.newPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text muted>
                      La contraseña debe contener mayúsculas, minúsculas y al
                      menos un número.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword" className="mb-4">
                    <Form.Label>
                      <strong>Confirmar Nueva Contraseña</strong>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <FormControl
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="btn btn-outline-primary me-2"
                      type="submit"
                      className="px-4 py-2"
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Guardar Nueva Contraseña
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>

            <Card.Footer className="bg-light">
              <small className="text-muted">
                Última actualización: {new Date().toLocaleDateString()}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
