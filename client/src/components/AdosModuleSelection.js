import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <Card.Title as="h2" className="text-center mb-4 text-primary">
                  Seleccionar Módulo ADOS-2
                </Card.Title>

                <Card.Text
                  className="text-muted mb-4 text-center"
                  style={{ fontSize: "1.1rem" }}
                >
                  Por favor seleccione el módulo ADOS-2 que corresponde al
                  paciente:
                </Card.Text>

                <Row className="g-3 mb-4 d-flex justify-content-center">
                  {["T", "1", "2", "3", "4"].map((module) => (
                    <Col key={module} xs={6} sm={4} md={4} lg={4}>
                      <Button
                        variant={
                          selectedModule === module
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleModuleSelect(module)}
                        className="w-100 py-3"
                      >
                        Módulo {module}
                      </Button>
                    </Col>
                  ))}
                </Row>

                <Button
                  className="btn btn-primary w-100"
                  size="lg"
                  onClick={handleContinue}
                >
                  Continuar a la Evaluación
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdosModuleSelection;
