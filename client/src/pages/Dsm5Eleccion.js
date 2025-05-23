import React, { useState } from "react";

const Dsm5Eleccion = ({ resultado, setModalAbierto, finalizarEvaluacion }) => {
    const [seleccionados, setSeleccionados] = useState({
        ADI_R: false,
        ADOS_2: false,
    });

    const manejarSeleccion = (prueba) => {
        setSeleccionados((prev) => ({
            ...prev,
            [prueba]: !prev[prueba],
        }));
    };

    return (
        <>
            <div className="overlay" onClick={() => setModalAbierto(false)}></div>
            <div className="modal">
                <div className="alert alert-warning">
                    <strong>
                        Advertencia, este Test es solamente para orientación no es un
                        resultado final, indicar abajo las pruebas que se realizarán
                        para obtener un diagnostico más detallado
                    </strong>
                </div>
                <h3>Resultado de Evaluación</h3>
                <p>{resultado}</p>

                <div className="options-container">
                    <div
                        className={`option-box ${seleccionados.ADI_R ? "selected" : ""}`}
                        onClick={() => manejarSeleccion("ADI_R")}
                    >
                        ADI-R
                    </div>
                    <div
                        className={`option-box ${seleccionados.ADOS_2 ? "selected" : ""}`}
                        onClick={() => manejarSeleccion("ADOS_2")}
                    >
                        ADOS-2
                    </div>
                </div>

                <button className="finalize-button" onClick={finalizarEvaluacion}>
                    Finalizar
                </button>
            </div>
        </>
    );
};

export default Dsm5Eleccion;