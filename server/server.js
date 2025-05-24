require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: "tea_db2",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
};

// Change password route
app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id, role } = req.user;

  // Get current user
  const getUserQuery = `SELECT * FROM ${role} WHERE ID = ?`;
  db.query(getUserQuery, [id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.Contrasena
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updateQuery = `UPDATE ${role} SET Contrasena = ? WHERE ID = ?`;
    db.query(updateQuery, [hashedPassword, id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Password updated successfully" });
    });
  });
});

// LOGUEO
/*
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  const query = `SELECT * FROM ${role} WHERE Email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    if (user.Contrasena === password) {
      const token = jwt.sign(
        { id: user.ID, email: user.Email, role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "3h" }
      );
      res.json({ token, user });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    /*bcrypt.compare(password, user.Contrasena, (err, result) => {
            if (err) return res.status(500).json({ error: 'Authentication error' });
            
            if (result) {
                const token = jwt.sign(
                    { id: user.ID, email: user.Email, role },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1h' }
                );
                res.json({ token, user });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }); -- Cerrar el comentario acá
  });
});*/




const { comparePassword } = require('./utils/hashUtils');

app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body;

  const query = `SELECT * FROM ${role} WHERE Email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    const passwordMatch = await comparePassword(password, user.Contrasena);
    if (passwordMatch) {
      const token = jwt.sign(
        { id: user.ID, email: user.Email, role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "3h" }
      );
      res.json({ token, user });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});














// Protected routes
app.get("/api/patients", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Paciente";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.post("/api/patients", authenticateToken, (req, res) => {
  const { nombre, apellido, fechaNacimiento, direccion, telefono, email } =
    req.body;
  const query =
    "INSERT INTO Paciente (Nombre, Apellido, FechaNacimiento, Direccion, Telefono, Email) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [nombre, apellido, fechaNacimiento, direccion, telefono, email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ id: results.insertId });
    }
  );
});

app.get("/api/patients/:id", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Paciente WHERE ID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Patient not found" });
    res.json(results[0]);
  });
});

app.put("/api/patients/:id", authenticateToken, (req, res) => {
  const { nombre, apellido, fechaNacimiento, direccion, telefono, email } =
    req.body;
  const query =
    "UPDATE Paciente SET Nombre = ?, Apellido = ?, FechaNacimiento = ?, Direccion = ?, Telefono = ?, Email = ? WHERE ID = ?";

  db.query(
    query,
    [
      nombre,
      apellido,
      fechaNacimiento,
      direccion,
      telefono,
      email,
      req.params.id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Patient updated successfully" });
    }
  );
});

app.delete("/api/patients/:id", authenticateToken, (req, res) => {
  const query = "DELETE FROM Paciente WHERE ID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Patient deleted successfully" });
  });
});

app.get("/api/preguntas", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Pregunta";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/api/categories", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Categoria";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Endpoint para crear evaluaciones
app.post("/api/evaluaciones", async (req, res) => {
  try {
    console.log("Recibiendo solicitud de creación de evaluación");
    console.log("Datos recibidos:", req.body);

    const { PacienteID, EspecialistaID, TipoEvaluacion, Fecha } = req.body;

    // Validación básica
    if (!PacienteID || !EspecialistaID || !TipoEvaluacion || !Fecha) {
      console.error("Faltan campos requeridos:", {
        PacienteID,
        EspecialistaID,
        TipoEvaluacion,
        Fecha,
      });
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    console.log("Datos validados correctamente");
    console.log("Ejecutando consulta SQL...");

    const query = `
        INSERT INTO Evaluacion (PacienteID, EspecialistaID, Fecha, TipoEvaluacion) 
        VALUES (?, ?, ?, ?)
      `;

    db.query(
      query,
      [PacienteID, EspecialistaID, Fecha, TipoEvaluacion],
      (err, results) => {
        if (err) {
          console.error("Error en la consulta SQL:", err);
          console.error("Query:", query);
          console.error("Parámetros:", [
            PacienteID,
            EspecialistaID,
            Fecha,
            TipoEvaluacion,
          ]);
          return res.status(500).json({
            error: "Error al crear evaluación",
            details: err.message,
          });
        }

        console.log("Evaluación creada exitosamente");
        console.log("ID de la evaluación:", results.insertId);

        return res.json({
          success: true,
          id: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error en /api/evaluaciones:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

app.delete("/api/evaluaciones/:id", authenticateToken, (req, res) => {
  const query1 = "DELETE FROM Adir WHERE EvaluacionID = ?";
  db.query(query1, [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ error: "Database error en Respuesta" });

    // Solo si la primera eliminación fue exitosa, ejecutamos la segunda
    const query = "DELETE FROM Evaluacion WHERE ID = ?";
    db.query(query, [req.params.id], (err, results) => {
      if (err)
        return res.status(500).json({ error: "Database error en Evaluacion" });
      res.json({ message: "Evaluation deleted successfully" });
    });
  });
});

//método para obtener las respuestas de una pregunta por su ID
app.get("/api/respuestas/:id", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Respuesta WHERE PreguntaID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/api/preguntas-con-respuestas", async (req, res) => {
  try {
    // 1. Obtener todas las preguntas
    const preguntas = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM Pregunta ORDER BY ID", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!preguntas || preguntas.length === 0) {
      return res.status(404).json({ error: "No se encontraron preguntas" });
    }

    // 2. Obtener IDs de preguntas para buscar respuestas
    const preguntaIds = preguntas.map((p) => p.ID);

    // 3. Obtener todas las respuestas para estas preguntas
    const respuestas = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Respuesta WHERE PreguntaID IN (?) ORDER BY PreguntaID, ID",
        [preguntaIds],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    // 4. Agrupar respuestas por pregunta
    const respuestasPorPregunta = {};
    respuestas.forEach((respuesta) => {
      if (!respuestasPorPregunta[respuesta.PreguntaID]) {
        respuestasPorPregunta[respuesta.PreguntaID] = [];
      }
      respuestasPorPregunta[respuesta.PreguntaID].push({
        ID: respuesta.ID,
        Respuesta: respuesta.Respuesta,
      });
    });

    // 5. Construir el resultado final
    const resultado = preguntas.map((pregunta) => ({
      ID: pregunta.ID,
      Pregunta: pregunta.Pregunta,
      Categoria: pregunta.Categoria,
      respuestas: respuestasPorPregunta[pregunta.ID] || [],
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error en /api/preguntas-con-respuestas:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

// Método para obtener todas las preguntas del DSM-5
app.get("/api/dsm5", (req, res) => {
  const query = "SELECT * FROM preguntadsm5";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Método para agregar una nueva evaluacion dsm5
app.post("/api/dsm5", (req, res) => {
  const { EvaluacionID, Apto, Puntuacion } = req.body;

  if (!EvaluacionID) {
    return res.status(400).json({ error: "Falta EvaluacionID" });
  }

  const query = `
        INSERT INTO dsm5 (EvaluacionID, Apto, Puntuacion) 
        VALUES (?, ?, ?)
      `;

  db.query(query, [EvaluacionID, Apto, Puntuacion], (err, results) => {
    if (err) {
      console.error("Error al guardar puntuación DSM-5:", err);
      return res.status(500).json({ error: "Error al guardar puntuación" });
    }

    res.json({ success: true });
  });
});

// Insertar una nueva prueba ADIR
app.post("/api/adir", async (req, res) => {
  try {
    const { EvaluacionID, RespuestaID, Puntuacion } = req.body;

    if (!EvaluacionID) {
      return res.status(400).json({ error: "Falta EvaluacionID" });
    }

    const query = `
        INSERT INTO Adir (EvaluacionID, RespuestaID, Puntuacion) 
        VALUES (?, ?, ?)
      `;

    db.query(query, [EvaluacionID, RespuestaID, Puntuacion], (err, results) => {
      if (err) {
        console.error("Error al guardar puntuación ADI-R:", err);
        return res.status(500).json({ error: "Error al guardar puntuación" });
      }

      res.json({ success: true });
    });
  } catch (error) {
    console.error("Error en /api/adir:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/ados", (req, res) => {
  try {
    const {
      EvaluacionID,
      Actividad,
      Observacion,
      Puntuacion,
      Modulo,
      CategoriaID,
    } = req.body;

    if (!EvaluacionID) {
      return res.status(400).json({ error: "Falta EvaluacionID" });
    }

    const query = `
        INSERT INTO Ados (EvaluacionID, Actividad, Observacion, Puntuacion, Modulo, CategoriaID) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

    db.query(
      query,
      [EvaluacionID, Actividad, Observacion, Puntuacion, Modulo, CategoriaID],
      (err, results) => {
        if (err) {
          console.error("Error al guardar puntuación ADOS:", err);
          return res.status(500).json({ error: "Error al guardar puntuación" });
        }

        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error("Error en /api/ados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/reportes", (req, res) => {
  try {
    const { EvaluacionID, FechaGeneracion, Contenido } = req.body;

    if (!EvaluacionID) {
      return res.status(400).json({ error: "Falta EvaluacionID" });
    }

    const query = `
        INSERT INTO Reporte (EvaluacionID, FechaGeneracion, Contenido) 
        VALUES (?, ?, ?)
      `;

    db.query(
      query,
      [EvaluacionID, FechaGeneracion, Contenido],
      (err, results) => {
        if (err) {
          console.error("Error al guardar reporte:", err);
          return res.status(500).json({ error: "Error al guardar reporte" });
        }

        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error("Error en /api/reportes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/reportes/:pacienteId", authenticateToken, (req, res) => {
  const { pacienteId } = req.params;

  const query = `
        SELECT 
            r.*,
            e.Fecha as fecha,
            e.TipoEvaluacion as tipoEvaluacion,
            p.Nombre as pacienteNombre,
            p.Apellido as pacienteApellido,
            es.Nombre as especialistaNombre,
            es.Apellido as especialistaApellido
        FROM Reporte r
        JOIN Evaluacion e ON r.EvaluacionID = e.ID
        JOIN Paciente p ON e.PacienteID = p.ID
        JOIN Especialista es ON e.EspecialistaID = es.ID
        WHERE p.ID = ?
        ORDER BY r.FechaGeneracion DESC
    `;
  db.query(query, [pacienteId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/api/reportes", authenticateToken, (req, res) => {
  const query = `
        SELECT 
            r.*,
            e.Fecha as fecha,
            e.TipoEvaluacion as tipoEvaluacion,
            p.Nombre as pacienteNombre,
            p.Apellido as pacienteApellido,
            es.Nombre as especialistaNombre,
            es.Apellido as especialistaApellido
        FROM Reporte r
        JOIN Evaluacion e ON r.EvaluacionID = e.ID
        JOIN Paciente p ON e.PacienteID = p.ID
        JOIN Especialista es ON e.EspecialistaID = es.ID
        ORDER BY r.FechaGeneracion DESC
    `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.delete("/api/reportes/:id", (req, res) => {
  const query = "DELETE FROM Reporte WHERE ID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Report deleted successfully" });
  });
});

// Método para saber si tengo acceso a una evaluación
app.get("/api/evaluacionesApto/:id", (req, res) => {
  const { id } = req.params;
  //const { role } = req.user;

  const query = `SELECT dsm5.Apto 
    FROM dsm5 
    JOIN evaluacion ON evaluacion.ID = dsm5.EvaluacionID 
    WHERE evaluacion.PacienteID = ? 
    ORDER BY dsm5.ID DESC 
    LIMIT 1;
    `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Evaluation not found" });
    res.json(results[0]);
  });
});
//------------------------------------------------------------------------------------
//Métodos del perfil
app.get("/api/especialista/:id", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Especialista WHERE ID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0] || null);
  });
});

app.get("/api/administrador/:id", authenticateToken, (req, res) => {
  const query = "SELECT * FROM Administrador WHERE ID = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0] || null);
  });
});

app.put("/api/especialista/:id", authenticateToken, (req, res) => {
  const { nombre, apellido, email } = req.body;
  const query =
    "UPDATE Especialista SET Nombre = ?, Apellido = ?, Email = ? WHERE ID = ?";

  db.query(query, [nombre, apellido, email, req.params.id], (err, results) => {
    if (err) {
      console.error("Error updating especialista:", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }

    // Verificar si la actualización afectó filas
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Especialista no encontrado" });
    }

    // Devolver el perfil actualizado
    const selectQuery = "SELECT * FROM Especialista WHERE ID = ?";
    db.query(selectQuery, [req.params.id], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error fetching updated profile:", selectErr);
        return res
          .status(500)
          .json({ error: "Database error", details: selectErr.message });
      }

      res.json({
        message: "Especialista updated successfully",
        data: selectResults[0],
      });
    });
  });
});

app.put("/api/administrador/:id", authenticateToken, (req, res) => {
  const { nombre, apellido, email } = req.body;
  const query =
    "UPDATE Administrador SET Nombre = ?, Apellido = ?, Email = ? WHERE ID = ?";

  db.query(query, [nombre, apellido, email, req.params.id], (err, results) => {
    if (err) {
      console.error("Error updating administrador:", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }

    // Verificar si la actualización afectó filas
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    // Devolver el perfil actualizado
    const selectQuery = "SELECT * FROM Administrador WHERE ID = ?";
    db.query(selectQuery, [req.params.id], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error fetching updated profile:", selectErr);
        return res
          .status(500)
          .json({ error: "Database error", details: selectErr.message });
      }

      res.json({
        message: "Administrador updated successfully",
        data: selectResults[0],
      });
    });
  });
});

/*
De esta forma aún no encriptaba

app.post("/api/especialista", authenticateToken, (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;
  const query =
    "INSERT INTO Especialista (Nombre, Apellido, Email, Contrasena) VALUES (?, ?, ?, ?)";
  db.query(query, [nombre, apellido, email, contrasena], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.post("/api/administrador", authenticateToken, (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;
  const query =
    "INSERT INTO Administrador (Nombre, Apellido, Email, Contrasena) VALUES (?, ?, ?, ?)";
  db.query(query, [nombre, apellido, email, contrasena], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});*/



//ya de esta forma sí encripta
const { hashPassword } = require('./utils/hashUtils'); // Asegúrate de que la ruta sea correcta

// Función para validar la contraseña
function isPasswordValid(password) {
  const lengthOk = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return lengthOk && hasUpper && hasLower && hasNumber;
}

app.post("/api/especialista", authenticateToken, async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena } = req.body;

    // Validar contraseña antes de encriptar
    if (!isPasswordValid(contrasena)) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(contrasena);

    const query =
      "INSERT INTO Especialista (Nombre, Apellido, Email, Contrasena) VALUES (?, ?, ?, ?)";

    db.query(query, [nombre, apellido, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Encryption or server error" });
  }
});




function isPasswordValid(password) {
  if (typeof password !== 'string') return false;

  const lengthOk = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return lengthOk && hasUpper && hasLower && hasNumber;
}

app.post("/api/administrador", authenticateToken, async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena } = req.body;

    if (!contrasena || !isPasswordValid(contrasena)) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      });
    }

    const hashedPassword = await hashPassword(contrasena);

    const query =
      "INSERT INTO Administrador (Nombre, Apellido, Email, Contrasena) VALUES (?, ?, ?, ?)";

    db.query(query, [nombre, apellido, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Encryption or server error" });
  }
});







// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
