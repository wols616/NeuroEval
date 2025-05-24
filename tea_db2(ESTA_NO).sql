-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2025 at 05:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tea_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `adir`
--

CREATE TABLE `adir` (
  `ID` int(11) NOT NULL,
  `EvaluacionID` int(11) DEFAULT NULL,
  `RespuestaID` int(11) DEFAULT NULL,
  `Puntuacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adir`
--

INSERT INTO `adir` (`ID`, `EvaluacionID`, `RespuestaID`, `Puntuacion`) VALUES
(79, 46, 1, 0),
(80, 46, 2, 0),
(81, 46, 3, 1),
(82, 46, 4, 1),
(83, 46, 5, 3),
(84, 46, 6, 2),
(85, 46, 7, 3),
(86, 46, 8, 8),
(87, 46, 9, 8),
(88, 46, 10, 2),
(89, 46, 11, 3),
(90, 46, 12, 2),
(91, 46, 13, 3),
(92, 46, 14, 3),
(93, 46, 15, 1),
(94, 46, 16, 3),
(95, 46, 17, 3),
(96, 46, 18, 1),
(97, 46, 19, 2),
(98, 46, 20, 7),
(99, 46, 21, 1),
(100, 46, 22, 1),
(101, 46, 23, 1),
(102, 46, 24, 2),
(103, 46, 25, 2),
(104, 46, 26, 1),
(105, 46, 27, 2),
(106, 46, 28, 0),
(107, 46, 29, 2),
(108, 46, 30, 1),
(109, 46, 31, 7),
(110, 46, 32, 2),
(111, 46, 66, 3),
(112, 46, 67, 3),
(113, 46, 68, 3),
(114, 46, 69, 1),
(115, 46, 70, 2),
(116, 46, 71, 2),
(117, 46, 72, 1),
(118, 46, 73, 1),
(119, 46, 74, 1),
(120, 46, 75, 2);

-- --------------------------------------------------------

--
-- Table structure for table `administrador`
--

CREATE TABLE `administrador` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Contrasena` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrador`
--

INSERT INTO `administrador` (`ID`, `Nombre`, `Apellido`, `Email`, `Contrasena`) VALUES
(1, 'Wilber', 'Rivas', 'wilber.rivas2003@gmail.com', '123456'),
(2, 'Administrador', 'Principal', 'admin@neuroeval.com', '$2a$10$5WJv24201KRIY4NVRn1Aqe5'),
(3, 'Rodolfo', 'Rivas', 'rodolfo@gmail.com', 'rodolfo123');

-- --------------------------------------------------------

--
-- Table structure for table `ados`
--

CREATE TABLE `ados` (
  `ID` int(11) NOT NULL,
  `EvaluacionID` int(11) DEFAULT NULL,
  `Actividad` varchar(300) DEFAULT NULL,
  `Observacion` varchar(300) DEFAULT NULL,
  `Puntuacion` int(11) DEFAULT NULL,
  `Modulo` varchar(10) DEFAULT NULL,
  `CategoriaID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ados`
--

INSERT INTO `ados` (`ID`, `EvaluacionID`, `Actividad`, `Observacion`, `Puntuacion`, `Modulo`, `CategoriaID`) VALUES
(1, 41, 'actividad', 'observación', 1, 'T', 1),
(2, 41, 'dfdf', 'afdf', 2, 'T', 2),
(3, 42, 'gfdfds', 'sfdgfd', 1, 'T', 1),
(4, 43, 'algo', 'sdfasdf', 0, 'T', 1),
(5, 47, 'jugar con legos', 'el niño adsfsdafasdf', 2, 'T', 1),
(6, 47, 'gfds', 'ghj', 0, 'T', 1);

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `ID` int(11) NOT NULL,
  `Categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`ID`, `Categoria`) VALUES
(1, 'Comunicación'),
(2, 'Imaginación');

-- --------------------------------------------------------

--
-- Table structure for table `dsm5`
--

CREATE TABLE `dsm5` (
  `ID` int(11) NOT NULL,
  `EvaluacionID` int(11) DEFAULT NULL,
  `Apto` varchar(10) DEFAULT NULL,
  `Puntuacion` int(11) DEFAULT NULL
) ;

--
-- Dumping data for table `dsm5`
--

INSERT INTO `dsm5` (`ID`, `EvaluacionID`, `Apto`, `Puntuacion`) VALUES
(4, 64, 'ambos', 21),
(5, 65, 'ninguno', 7);

-- --------------------------------------------------------

--
-- Table structure for table `especialista`
--

CREATE TABLE `especialista` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Contrasena` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especialista`
--

INSERT INTO `especialista` (`ID`, `Nombre`, `Apellido`, `Email`, `Contrasena`) VALUES
(1, 'paola', 'vidal', 'paola@gmail.com', 'paola123'),
(2, 'Eyleen', 'Salinas', 'eyleen@gmail.com', 'eyleen123'),
(3, 'gggg', 'ggggg', 'maria@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `evaluacion`
--

CREATE TABLE `evaluacion` (
  `ID` int(11) NOT NULL,
  `PacienteID` int(11) DEFAULT NULL,
  `EspecialistaID` int(11) DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL,
  `TipoEvaluacion` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluacion`
--

INSERT INTO `evaluacion` (`ID`, `PacienteID`, `EspecialistaID`, `Fecha`, `TipoEvaluacion`) VALUES
(41, 1, 1, '2025-05-16 20:06:42', 'ADOS-2'),
(42, 2, 1, '2025-05-16 20:18:37', 'ADOS-2'),
(43, 3, 1, '2025-05-16 20:31:46', 'ADOS-2'),
(46, 13, 3, '2025-05-17 00:00:00', 'ADI-R'),
(47, 13, 3, '2025-05-17 03:06:01', 'ADOS-2'),
(64, 1, 1, '2025-05-23 08:56:16', 'dsm5'),
(65, 2, 1, '2025-05-23 09:06:33', 'DSM-5');

-- --------------------------------------------------------

--
-- Table structure for table `paciente`
--

CREATE TABLE `paciente` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `FechaNacimiento` datetime DEFAULT NULL,
  `Direccion` varchar(200) DEFAULT NULL,
  `Telefono` varchar(18) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paciente`
--

INSERT INTO `paciente` (`ID`, `Nombre`, `Apellido`, `FechaNacimiento`, `Direccion`, `Telefono`, `Email`) VALUES
(1, 'María', 'González', '1990-05-15 00:00:00', 'Calle Primavera 123, Ciudad de México', '5512345678', 'maria.gonzalez@email.com'),
(2, 'Juan', 'Pérez', '1985-11-22 00:00:00', 'Avenida Libertad 456, Guadalajara', '3312345678', 'juan.perez@email.com'),
(3, 'Ana', 'Martínez', '2000-03-08 00:00:00', 'Boulevard Reforma 789, Monterrey', '8112345678', 'ana.martinez@email.com'),
(4, 'Carlos', 'López', '1978-07-30 00:00:00', 'Calle Roble 45, Puebla', '2221234567', 'carlos.lopez@email.com'),
(5, 'Laura', 'Rodríguez', '1995-09-12 00:00:00', 'Avenida Juárez 67, Tijuana', '6641234567', 'laura.rodriguez@email.com'),
(6, 'Pedro', 'Sánchez', '1982-12-05 00:00:00', 'Calle Pino 89, León', '4771234567', 'pedro.sanchez@email.com'),
(7, 'Sofía', 'Hernández', '2005-02-18 00:00:00', 'Boulevard Universidad 34, Mérida', '9991234567', 'sofia.hernandez@email.com'),
(8, 'Miguel', 'Díaz', '1998-08-25 00:00:00', 'Avenida Central 56, Cancún', '9981234567', 'miguel.diaz@email.com'),
(9, 'Elena', 'Ramírez', '1975-04-10 00:00:00', 'Calle Nogal 78, Querétaro', '4421234567', 'elena.ramirez@email.com'),
(13, 'ddddddd', 'ddddd', '2020-01-01 00:00:00', 'dddddd', '1212-1212', 'paola2@gmail.com'),
(14, 'fdsd', 'asdf', '2025-05-17 00:00:00', 'dsfdf', '24543545', 'maria2@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `pregunta`
--

CREATE TABLE `pregunta` (
  `ID` int(11) NOT NULL,
  `Pregunta` varchar(300) DEFAULT NULL,
  `Categoria` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pregunta`
--

INSERT INTO `pregunta` (`ID`, `Pregunta`, `Categoria`) VALUES
(1, 'Incapacidad para utilizar conductas no verbales en la regulación de la interacción social', 'A1'),
(2, 'Incapacidad para desarrollar relaciones con sus iguales', 'A2'),
(3, 'Falta de goce o placer compartido', 'A3'),
(4, 'Falta de reciprocidad socio-emocional', 'A4'),
(5, 'Falta o retraso del lenguaje hablado e incapacidad para compensar esta falta mediante gestos', 'B1'),
(6, 'Falta de juego imaginativo o juego social imitativo espontáneo y variado', 'B4'),
(7, 'Incapacidad relativa para iniciar o sostener un intercambio conversacional', 'B2'),
(8, 'Habla estereotipada, repetitiva e idiosincrásica', 'B3'),
(9, 'Preocupación absorbente o patrón de intereses circunscrito', 'C1'),
(19, 'Adhesión aparentemente compulsiva a rutinas o rituales no funcionales', 'C2'),
(20, 'Manierismos motores estereotipados y repetitivos', 'C3'),
(21, 'Preocupaciones con partes de objetos o elementos no funcionales de los materiales', 'C4'),
(22, 'Alteraciones en el desarrollo evidentes a los 36 meses o antes', 'D1');

-- --------------------------------------------------------

--
-- Table structure for table `preguntadsm5`
--

CREATE TABLE `preguntadsm5` (
  `ID` int(11) NOT NULL,
  `Titulo` varchar(200) NOT NULL,
  `Pregunta` varchar(300) DEFAULT NULL,
  `Descripcion` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `preguntadsm5`
--

INSERT INTO `preguntadsm5` (`ID`, `Titulo`, `Pregunta`, `Descripcion`) VALUES
(1, 'Reciprocidad socioemocional', '¿La persona muestra dificultad para participar en interacciones sociales de forma natural (como responder al saludo, sonreír de vuelta, iniciar o mantener una conversación)?', 'Evalúa si hay problemas en el “ida y vuelta” social: conversaciones, compartir emociones o responder a señales sociales básicas.'),
(2, 'Comunicación no verbal', '¿Tiene dificultad para usar o entender gestos, expresiones faciales o el contacto visual durante la comunicación?', 'Evalúa el uso y comprensión de la comunicación no verbal como el contacto visual, gestos o posturas sociales.'),
(3, 'Relaciones sociales', '¿Le cuesta establecer, mantener o comprender relaciones sociales o adaptar su comportamiento a distintos contextos sociales?', 'Evalúa si entiende y aplica reglas sociales como turnarse al hablar, comportarse diferente con un amigo vs. un adulto, o hacer amistades.'),
(4, 'Movimientos repetitivos o estereotipados', '¿La persona realiza movimientos repetitivos o inusuales como aleteo de manos, balanceo, girar objetos o repetir palabras/frases?', 'Evalúa si hay conductas motoras repetitivas o repetición del lenguaje (ecolalia, frases sin propósito).'),
(5, 'Apego a rutinas / resistencia al cambio', '¿Se molesta mucho cuando hay cambios inesperados en su rutina, entorno o actividades?', 'Evalúa inflexibilidad, necesidad extrema de seguir rutinas y resistencia a lo nuevo.'),
(6, 'Intereses restringidos o intensos', '¿Tiene intereses muy intensos o específicos que domina, repite frecuentemente y le cuesta dejar de lado?', 'Evalúa la intensidad y especificidad de intereses (ej. saber todo sobre trenes, memorizar mapas, etc.).'),
(7, 'Reacciones sensoriales inusuales', '¿Reacciona de forma exagerada o inusual ante sonidos, texturas, luces, sabores u olores?', 'Evalúa sensibilidad extrema o indiferencia ante estímulos sensoriales (taparse los oídos, evitar ciertas telas, etc.).');

-- --------------------------------------------------------

--
-- Table structure for table `reporte`
--

CREATE TABLE `reporte` (
  `ID` int(11) NOT NULL,
  `EvaluacionID` int(11) DEFAULT NULL,
  `FechaGeneracion` datetime DEFAULT NULL,
  `Contenido` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reporte`
--

INSERT INTO `reporte` (`ID`, `EvaluacionID`, `FechaGeneracion`, `Contenido`) VALUES
(1, 41, '2025-05-16 00:00:00', 'el niño está rarito'),
(2, 42, '2025-05-16 00:00:00', 'fdsgsdfg'),
(3, 43, '2025-05-16 00:00:00', 'sdafasdf'),
(4, 46, '2025-05-17 00:00:00', 'el niño presenta tal cosa'),
(5, 47, '2025-05-17 00:00:00', 'el niño tiene tal cosa x2'),
(17, 64, '2025-05-23 08:56:18', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(18, 65, '2025-05-23 09:06:33', 'Bajo nivel de indicios.');

-- --------------------------------------------------------

--
-- Table structure for table `respuesta`
--

CREATE TABLE `respuesta` (
  `ID` int(11) NOT NULL,
  `PreguntaID` int(11) DEFAULT NULL,
  `Respuesta` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `respuesta`
--

INSERT INTO `respuesta` (`ID`, `PreguntaID`, `Respuesta`) VALUES
(1, 1, 'Mirada directa'),
(2, 1, 'Sonrisa social'),
(3, 1, 'Variedad de expresiones faciales usadas para comunicarse'),
(4, 2, 'Juego imaginativo con sus iguales'),
(5, 2, 'Interés por otros niños'),
(6, 2, 'Respuesta a las aproximaciones de otros niños'),
(7, 2, 'Respuesta a las aproximaciones de otros niños'),
(8, 2, 'Juego en grupo con sus iguales (puntúe si tiene entre 4 años, 0 meses y 9 años, 11 meses)'),
(9, 2, 'Amistades(puntúe si tiene 10 años o más)'),
(10, 3, 'Mostrar y dirigir la atención'),
(11, 3, 'Ofrecimientos para compartir'),
(12, 3, 'Busca compartir su deleite o goce con otros'),
(13, 4, 'Uso del cuerpo de otra persona para comunicarse'),
(14, 4, 'Ofrecimiento de consuelo'),
(15, 4, 'Calidad de los acercamientos sociales'),
(16, 4, 'Expresiones faciales inapropiadas'),
(17, 4, 'Cualidad apropiada de las respuestas sociales'),
(18, 5, 'Señalar para expresar interés'),
(19, 5, 'Asentir con la cabeza'),
(20, 5, 'Negar con la cabeza'),
(21, 5, 'Gestos convencionales/instrumentales'),
(22, 6, 'Imitación espontánea de acciones'),
(23, 6, 'Juego imaginativo'),
(24, 6, 'Juego social imitativo'),
(25, 7, 'Verbalización social/charla'),
(26, 7, 'Conversación recíproca'),
(27, 8, 'Expresiones estereotipadas y ecolalia diferída'),
(28, 8, 'Preguntas o expresiones inapropiadas'),
(29, 8, 'Inversión de pronombres'),
(30, 8, 'Neologismos/lenguaje idiosincrásico'),
(31, 9, 'Preocupaciones inusuales'),
(32, 9, 'Intereses circunscritos (puntúe solamente si tiene 3 años o más)'),
(66, 19, 'Rituales verbales '),
(67, 19, 'Compulsiones / rituales'),
(68, 20, 'Manierismos de manos y dedos'),
(69, 20, 'Otros manierismos complejos o movimientos estereotipados del cuerpo'),
(70, 21, 'Uso repetitivo de objetos o interés en partes de objetos'),
(71, 21, 'Intereses sensoriales inusuales'),
(72, 22, 'Edad en que los padres lo notaron por primera vez (si es <36 meses, puntúe 1)'),
(73, 22, 'Edad de las primeras palabras (si > 24 meses, puntúe 1)'),
(74, 22, 'Edad de las primeras frases (si > 33 meses, puntúe 1)'),
(75, 22, 'Juicio del entrevistador sobre la edad en que se manifestaron por primera vez las anormalidades (si < 36 meses puntúe 1)');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adir`
--
ALTER TABLE `adir`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EvaluacionID` (`EvaluacionID`),
  ADD KEY `RespuestaID` (`RespuestaID`);

--
-- Indexes for table `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ados`
--
ALTER TABLE `ados`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EvaluacionID` (`EvaluacionID`),
  ADD KEY `CategoriaID` (`CategoriaID`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `dsm5`
--
ALTER TABLE `dsm5`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EvaluacionID` (`EvaluacionID`);

--
-- Indexes for table `especialista`
--
ALTER TABLE `especialista`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PacienteID` (`PacienteID`),
  ADD KEY `EspecialistaID` (`EspecialistaID`);

--
-- Indexes for table `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `preguntadsm5`
--
ALTER TABLE `preguntadsm5`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EvaluacionID` (`EvaluacionID`);

--
-- Indexes for table `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PreguntaID` (`PreguntaID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adir`
--
ALTER TABLE `adir`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `administrador`
--
ALTER TABLE `administrador`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ados`
--
ALTER TABLE `ados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dsm5`
--
ALTER TABLE `dsm5`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `especialista`
--
ALTER TABLE `especialista`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `paciente`
--
ALTER TABLE `paciente`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `preguntadsm5`
--
ALTER TABLE `preguntadsm5`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reporte`
--
ALTER TABLE `reporte`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adir`
--
ALTER TABLE `adir`
  ADD CONSTRAINT `adir_ibfk_1` FOREIGN KEY (`EvaluacionID`) REFERENCES `evaluacion` (`ID`),
  ADD CONSTRAINT `adir_ibfk_2` FOREIGN KEY (`RespuestaID`) REFERENCES `respuesta` (`ID`);

--
-- Constraints for table `ados`
--
ALTER TABLE `ados`
  ADD CONSTRAINT `ados_ibfk_1` FOREIGN KEY (`EvaluacionID`) REFERENCES `evaluacion` (`ID`),
  ADD CONSTRAINT `ados_ibfk_2` FOREIGN KEY (`CategoriaID`) REFERENCES `categoria` (`ID`);

--
-- Constraints for table `dsm5`
--
ALTER TABLE `dsm5`
  ADD CONSTRAINT `dsm5_ibfk_1` FOREIGN KEY (`EvaluacionID`) REFERENCES `evaluacion` (`ID`);

--
-- Constraints for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD CONSTRAINT `evaluacion_ibfk_1` FOREIGN KEY (`PacienteID`) REFERENCES `paciente` (`ID`),
  ADD CONSTRAINT `evaluacion_ibfk_2` FOREIGN KEY (`EspecialistaID`) REFERENCES `especialista` (`ID`);

--
-- Constraints for table `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`EvaluacionID`) REFERENCES `evaluacion` (`ID`);

--
-- Constraints for table `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`PreguntaID`) REFERENCES `pregunta` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
