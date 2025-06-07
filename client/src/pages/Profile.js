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

            <Card.Body>
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

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" className="px-4 py-2">
                    <i className="bi bi-save-fill me-2"></i>
                    Actualizar Perfil
                  </Button>
                </div>
              </Form>
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
