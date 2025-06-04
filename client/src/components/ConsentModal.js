import React from "react";
import "../styles/consentModal.css"; // Import your CSS styles

const ConsentModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Consentimiento Informado</h2>
        <p style={{ fontSize: "1.2rem" }}>
          Para garantizar el correcto uso y protección de tus datos personales,
          requerimos tu consentimiento expreso. La información recopilada será
          utilizada exclusivamente para fines de evaluación médica, asegurando
          la seguridad, confidencialidad y cumplimiento de las normativas de
          protección de datos. Tus datos no serán compartidos con terceros sin
          tu autorización, y siempre tendrás el derecho de solicitar su
          eliminación.
        </p>
        <p style={{ fontSize: "1.2rem" }}>
          Al aceptar este consentimiento, permites que nuestros especialistas
          accedan y analicen la información necesaria para proporcionarte un
          diagnóstico adecuado y mejorar la calidad de la atención. En caso de
          no aceptar, no podremos proceder con la evaluación.
        </p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onAccept}>
            Acepto
          </button>
          <button className="btn btn-secondary" onClick={onDecline}>
            No acepto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
