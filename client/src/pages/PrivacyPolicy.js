import React from "react";
import { Container, Card, Accordion } from "react-bootstrap";
import {
  FaShieldAlt,
  FaDatabase,
  FaUserLock,
  FaInfoCircle,
} from "react-icons/fa";
import "../styles/privacyPolicy.css"; // Crearemos este archivo después

const PrivacyPolicy = () => {
  return (
    <Container className="privacy-policy-container my-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h2 className="text-center mb-0">
            <FaShieldAlt className="me-2" />
            Políticas de Privacidad
          </h2>
        </Card.Header>
        <Card.Body>
          <section className="intro-section mb-4">
            <p className="lead">
              En nuestra aplicación, la privacidad y seguridad de tus datos son
              nuestra máxima prioridad.
            </p>
            <p>
              Esta política describe cómo recopilamos, usamos, compartimos y
              protegemos la información de nuestros usuarios. Al utilizar
              nuestra aplicación, aceptas las prácticas descritas en esta
              política.
            </p>
          </section>

          <Accordion defaultActiveKey="0" flush>
            {/* Sección 1 */}
            <Accordion.Item eventKey="0" className="mb-3 border">
              <Accordion.Header>
                <FaDatabase className="me-2 text-info" />
                <strong>1. Información que Recopilamos</strong>
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>
                    <strong>Datos personales:</strong> Nombre, apellidos, fecha
                    de nacimiento, dirección de correo electrónico, número de
                    teléfono y otra información de contacto.
                  </li>
                  <li>
                    <strong>Datos de salud:</strong> Información médica
                    relevante, historial clínico, resultados de evaluaciones y
                    cualquier otro dato relacionado con la salud del paciente.
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            {/* Sección 2 */}
            <Accordion.Item eventKey="1" className="mb-3 border">
              <Accordion.Header>
                <FaUserLock className="me-2 text-primary" />
                <strong>2. Uso de la Información</strong>
              </Accordion.Header>
              <Accordion.Body>
                <p>Utilizamos la información recopilada para:</p>
                <ul>
                  <li>
                    Proveer y mejorar nuestros servicios de evaluación clínica
                  </li>
                  <li>Personalizar la experiencia del usuario</li>
                  <li>Generar informes y análisis clínicos</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                  <li>
                    Comunicarnos contigo sobre actualizaciones o cambios en el
                    servicio
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            {/* Sección 3 */}
            <Accordion.Item eventKey="2" className="mb-3 border">
              <Accordion.Header>
                <FaShieldAlt className="me-2 text-success" />
                <strong>3. Protección de Datos</strong>
              </Accordion.Header>
              <Accordion.Body>
                <p>Implementamos medidas de seguridad robustas incluyendo:</p>
                <ul>
                  <li>Encriptación de datos sensibles</li>
                  <li>Control de acceso basado en roles estricto</li>
                  <li>Auditorías regulares de seguridad</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            {/* Sección 4 */}
            <Accordion.Item eventKey="3" className="mb-3 border">
              <Accordion.Header>
                <FaInfoCircle className="me-2 text-warning" />
                <strong>4. Derechos del Usuario</strong>
              </Accordion.Header>
              <Accordion.Body>
                <p>Tienes derecho a:</p>
                <ul>
                  <li>Acceder a tus datos personales</li>
                  <li>Solicitar corrección de información incorrecta</li>
                  <li>
                    Solicitar eliminación de tus datos (derecho al olvido)
                  </li>
                  <li>Limitar el procesamiento de tus datos</li>
                  <li>Recibir tus datos en formato estructurado</li>
                  <li>Presentar reclamos ante autoridades regulatorias</li>
                </ul>
                <p className="mt-3">
                  Para ejercer estos derechos, contacta a nuestro Oficial de
                  Privacidad en:
                  <a href="mailto:privacidad@catolica.edu.sv" className="ms-2">
                    privacidad@tudominio.com
                  </a>
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <section className="final-notes mt-4 p-3 bg-light rounded">
            <h5 className="mb-3">Notas Importantes</h5>
            <p>
              <strong>Actualizaciones:</strong> Esta política puede actualizarse
              periódicamente. Te notificaremos sobre cambios significativos.
            </p>
            <p>
              <strong>Consentimiento:</strong> Al usar nuestra aplicación,
              aceptas esta política de privacidad.
            </p>
            <p className="mb-0">
              <strong>Contacto:</strong> Para preguntas sobre privacidad,
              contacta a nuestro equipo en
              <a href="mailto:soporte@tudominio.com" className="ms-2">
                soporte@catolica.edu.sv.com
              </a>
            </p>
          </section>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Última actualización: {new Date().toLocaleDateString()}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;
