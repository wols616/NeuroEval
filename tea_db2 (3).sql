-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2025 at 07:58 PM
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
-- Table structure for table `actividadados`
--

CREATE TABLE `actividadados` (
  `ID` int(11) NOT NULL,
  `Actividad` varchar(300) NOT NULL,
  `Descripcion` varchar(300) NOT NULL,
  `NombreModulo` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actividadados`
--

INSERT INTO `actividadados` (`ID`, `Actividad`, `Descripcion`, `NombreModulo`) VALUES
(1, 'Frecuencia de vocalización espontanea dirigida a otros', 'Observa si el niño hace sonidos o habla por iniciativa propia para comunicarse con alguien.', 'T'),
(2, 'Señalar', 'Evalúa si el niño señala con el dedo para mostrar interés o llamar la atención sobre algo.', 'T'),
(3, 'Gestos', 'Considera si el niño utiliza gestos (como saludar, decir adiós o pedir) para comunicarse.', 'T'),
(4, 'Frecuencia de vocalización espontanea dirigida a otros', 'Observa si el niño emite sonidos o vocalizaciones de forma espontánea para comunicarse con otras personas.', '1'),
(5, 'Señalar', 'Evalúa si el niño utiliza gestos de señalar para compartir interés o pedir algo.', '1'),
(6, 'Gestos', 'Analiza el uso de gestos comunicativos (como saludar, negar con la cabeza, etc.).', '1'),
(7, 'Señalar', 'Evalúa si el niño usa gestos de señalar para compartir interés o pedir algo.', '2'),
(8, 'Gestos descriptivos, convencionales, instrumentales o informativos', 'Analiza el uso de gestos más complejos (como mover la cabeza para \"no\", aplaudir, o gestos que acompañan una explicación).', '2'),
(9, 'Contacto visual inusual', 'Observa si el contacto visual es escaso, excesivo o inadecuado en contexto.', '2'),
(10, 'Narración de sucesos', 'Evalúa la capacidad del individuo para relatar experiencias personales o eventos de manera coherente y detallada, incluyendo el uso de contexto emocional o relevancia social.', '3'),
(11, 'Conversación', 'Analiza la fluidez, reciprocidad y adecuación en diálogos espontáneos (ej. turnos de habla, adaptación al interlocutor).', '3'),
(12, 'Gestos descriptivos, convencionales, instrumentales o informativos', 'Observa el uso de gestos para complementar o enriquecer la comunicación (ej. mover las manos al explicar, señalar para clarificar).', '3'),
(13, 'Uso estereotipado o idiosincrásico de palabras o frases', 'Evalúa la presencia de lenguaje repetitivo, inflexible o fuera de contexto (ej. frases literales, ecolalia).', '4'),
(14, 'Conversación', 'Analiza la capacidad para mantener diálogos recíprocos, incluyendo turnos de habla, adaptación al interlocutor y coherencia temática.', '4'),
(15, 'Gestos descriptivos, convencionales, instrumentales o informativos', 'Observa el uso de gestos para complementar la comunicación (ej. señalar, mover las manos al explicar).', '4'),
(16, 'Contacto visual inusual', 'Examina si el niño evita mirar a los ojos o tiene una forma atípica de hacer contacto visual.', 'T'),
(17, 'Expresiones faciales dirigidas a otros', 'Determina si el niño muestra emociones faciales que son comprensibles y dirigidas hacia otros.', 'T'),
(18, 'Integración de la mirada y otras conductas durante las iniciaciones sociales', 'Observa si el niño coordina la mirada con otros comportamientos sociales como gestos o vocalizaciones al iniciar interacciones.', 'T'),
(19, 'Disfrute compartido durante la interacción', 'Evalúa si el niño comparte emociones positivas (como alegría) con otra persona durante la actividad.', 'T'),
(20, 'Respuesta al nombre', 'Mide si el niño reacciona cuando se le llama por su nombre.', 'T'),
(21, 'Ignorar', 'Indica si el niño frecuentemente no responde o no presta atención cuando alguien le habla o interactúa con él.', 'T'),
(22, 'Pedir', 'Examina si el niño solicita objetos o ayuda, usando gestos, sonidos o palabras.', 'T'),
(23, 'Mostrar', 'Evalúa si el niño muestra objetos a otra persona para compartir atención o interés.', 'T'),
(24, 'Iniciación espontánea de la atención conjunta', 'Mide si el niño intenta espontáneamente compartir su interés por algo con otra persona.', 'T'),
(25, 'Respuesta a la atención conjunta', 'Observa si el niño sigue la mirada o el gesto de otra persona para dirigir su atención hacia algo.', 'T'),
(26, 'Características de las iniciaciones sociales', 'Describe cómo el niño inicia interacciones sociales y cuán apropiadas o naturales son esas iniciaciones.', 'T'),
(27, 'Cantidad de las iniciaciones sociales/familiar o cuidador', 'Cuenta con qué frecuencia el niño inicia interacciones sociales, especialmente con familiares o cuidadores.', 'T'),
(28, 'Calidad general de la relación', 'Evalúa el nivel de conexión emocional y recíproca entre el niño y el adulto que lo acompaña.', 'T'),
(29, 'Entonación de las vocalizaciones o verbalizaciones', 'Observa si el tono de voz o la forma de hablar del niño es inusual (por ejemplo, monótono, cantado, etc.).', 'T'),
(30, 'Interés sensorial inusual en los materiales de juego o en las personas', 'Evalúa si el niño muestra una fascinación extraña por texturas, luces, sonidos o partes del cuerpo de otras personas.', 'T'),
(31, 'Movimientos de manos y dedos / postura', 'Examina si hay movimientos repetitivos o posturas inusuales con las manos, dedos o cuerpo.', 'T'),
(32, 'Intereses inusualmente repetitivos o comportamientos estereotipados', 'Considera si el niño repite actividades o se enfoca excesivamente en ciertos objetos o rutinas.', 'T'),
(33, 'Contacto visual inusual', 'Observa si el niño evita el contacto visual o lo usa de manera atípica.', '1'),
(34, 'Expresiones faciales dirigidas a otros', 'Evalúa si el niño usa expresiones faciales para comunicarse (sonrisas, sorpresa, etc.).', '1'),
(35, 'Integración de la mirada y otras conductas durante las iniciaciones sociales', 'Analiza si coordina la mirada con gestos o vocalizaciones durante interacciones.', '1'),
(36, 'Disfrute compartido durante la interacción', 'Observa si el niño muestra placer al interactuar con otros.', '1'),
(37, 'Mostrar', 'Evalúa si el niño muestra objetos o juguetes para compartir su interés.', '1'),
(38, 'Iniciación espontánea de la atención conjunta', 'Observa si el niño inicia interacciones para dirigir la atención del otro hacia algo.', '1'),
(39, 'Respuesta a la atención conjunta', 'Evalúa si el niño sigue la mirada o señalamiento del evaluador.', '1'),
(40, '', '', '1'),
(41, 'Características de las iniciaciones sociales', 'Analiza la calidad y frecuencia de los intentos de interacción del niño.', '1'),
(42, 'Entonación de las vocalizaciones o verbalizaciones', 'Observa si el niño usa tonos de voz inusuales (monótonos, agudos, etc.).', '1'),
(43, 'Uso estereotipado o idionsincrásico de palabras o frases', 'Evalúa si repite frases o palabras de manera rígida o fuera de contexto.', '1'),
(44, 'Interés sensorial inusual en los materiales de juego o en las personas', 'Analiza si el niño muestra fascinación por texturas, sonidos o movimientos.', '1'),
(45, 'Manierismos de manos y dedos y otros manierismos complejos', 'Observa movimientos repetitivos como aleteos o giros de manos.', '1'),
(46, 'Interes inusualmente repetitivos o comportamientos estereotipados', 'Evalúa si el niño tiene rutinas rígidas o intereses muy restringidos.', '1'),
(47, 'Expresiones faciales dirigidas a otros', 'Evalúa si las expresiones son espontáneas, apropiadas y coordinadas con la interacción.', '2'),
(48, 'Disfrute compartido durante la interacción', 'Determina si el niño muestra placer al interactuar (risas, comentarios, participación activa).', '2'),
(49, 'Mostrar', 'Observa si el niño comparte objetos o logros espontáneamente para compartir interés.', '2'),
(50, 'Iniciación espontánea de la atención conjunta', 'Analiza si el niño inicia interacciones para dirigir la atención del evaluador hacia algo relevante.', '2'),
(51, 'Características de las iniciaciones sociales', 'Evalúa la naturalidad, frecuencia y adecuación de los intentos de interacción.', '2'),
(52, 'Cantidad de comunicación social recíproca', 'Mide la fluidez y equilibrio en el intercambio conversacional.', '2'),
(53, 'Calidad general de la relación', 'Juzga la conexión emocional y adaptabilidad durante la interacción.', '2'),
(54, 'Uso estereotipado o idiosincrásico de palabras o frases', 'Observa repeticiones literales, lenguaje rígido o frases fuera de contexto.', '2'),
(55, 'Interés sensorial inusual en los materiales de juego o en las personas', 'Evalúa fascinación por olores, texturas, sonidos o estímulos visuales.', '2'),
(56, 'Manierismos de manos y dedos y otros manierismos complejos', 'Detecta movimientos repetitivos (aleteos, torsiones de dedos, etc.).', '2'),
(57, 'Intereses inusualmente repetitivos o comportamientos estereotipados', 'Analiza rutinas inflexibles, obsesiones temáticas o patrones de juego repetitivos.', '2'),
(58, 'Contacto visual inusual', 'Detecta si el contacto visual es escaso, excesivo o inadecuado (ej. evasión, mirada fija).', '3'),
(59, 'Expresiones faciales dirigidas al examinador', 'Evalúa la expresividad facial y su sincronía con el contenido emocional de la interacción.', '3'),
(60, 'Disfrute compartido durante la interacción', 'Determina si hay muestras genuinas de placer o interés en la interacción (risas, comentarios espontáneos).', '3'),
(61, 'Características de las iniciaciones sociales', 'Analiza la naturalidad y propósito de los intentos por iniciar interacciones (ej. preguntas relevantes, compartir ideas).', '3'),
(62, 'Calidad de la respuesta social ', 'Observa si las respuestas son apropiadas al contexto (ej. empatía, ajuste al tema de conversación).', '3'),
(63, 'Cantidad de comunicación social recíproca', 'Mide el equilibrio en el intercambio conversacional (monopolizar vs. participación pasiva).', '3'),
(64, 'Calidad general de la relación', 'Juzga la conexión emocional y adaptabilidad durante la interacción (ej. calidez, interés mutuo).', '3'),
(65, 'Uso estereotipado o idiosincrásico de palabras o frases', 'Detecta lenguaje repetitivo, inflexible o fuera de contexto (ej. ecolalia, frases literales).', '3'),
(66, 'Interés sensorial inusual en los materiales de juego o en las personas', 'Evalúa fascinación por estímulos sensoriales (olores, texturas, sonidos) o manipulación atípica de objetos.', '3'),
(67, 'Manierismos de manos y dedos y otros manierismos complejos', 'Identifica movimientos repetitivos (aleteos, torsiones) o posturas corporales inusuales.', '3'),
(68, 'Interés excesivo en temas u objetos inusuales o altamente específi cos', 'Analiza obsesiones temáticas (ej. horarios, datos muy específicos) que limitan la flexibilidad.', '3'),
(69, 'Gestos enfáticos o emocionales', 'Evalúa si los gestos reflejan adecuadamente emociones o énfasis durante la interacción.', '4'),
(70, 'Contacto visual inusual', 'Detecta patrones atípicos (evasión, mirada fija o inconsistente).', '4'),
(71, 'Expresiones faciales dirigidas al examinador', 'Analiza si las expresiones son espontáneas y congruentes con el contexto social.', '4'),
(72, 'Comentarios sobre las emociones de otros / empatía', 'Evalúa la capacidad para reconocer y responder a emociones ajenas.', '4'),
(73, 'Responsabilidad', 'Observa la comprensión de normas sociales y roles en interacciones (ej. respeto por turnos, ajuste a contextos formales).', '4'),
(74, 'Características de las iniciaciones sociales', 'Analiza la naturalidad y propósito de los intentos por interactuar.\r\n\r\n', '4'),
(75, 'Calidad de la respuesta social', 'uzga la adecuación de las respuestas a situaciones sociales.', '4'),
(76, 'Cantidad de comunicación social recíproca ', 'Mide el equilibrio en diálogos (monopolizar vs. participación pasiva).', '4'),
(77, 'Interés sensorial inusual en los materiales de juego o en las personas', 'Detecta fascinación por estímulos sensoriales (sonidos, texturas).', '4'),
(78, 'Manierismos de manos y dedos y otros manierismos complejos', 'Identifica movimientos repetitivos (aleteos, torsiones).', '4'),
(79, 'Interés excesivo en temas u objetos inusuales o altamente específi cos', 'Analiza obsesiones temáticas que limitan la flexibilidad.', '4'),
(80, 'Compulsiones o rituales', 'Evalúa rutinas rígidas o comportamientos repetitivos con función de ansiedad.', '4');

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
(120, 46, 75, 2),
(142, 82, 1, 1),
(143, 82, 2, 1),
(144, 82, 3, 1),
(145, 82, 4, 1),
(146, 82, 5, 3),
(147, 82, 6, 2),
(148, 82, 7, 1),
(149, 82, 8, 3),
(150, 82, 9, 2),
(151, 82, 10, 1),
(152, 82, 11, 2),
(153, 82, 12, 3),
(154, 82, 13, 2),
(155, 82, 14, 3),
(156, 82, 15, 1),
(157, 82, 16, 1),
(158, 82, 17, 3),
(159, 82, 18, 2),
(160, 82, 19, 1),
(161, 82, 20, 1),
(162, 82, 21, 1),
(163, 82, 22, 2),
(164, 82, 23, 1),
(165, 82, 24, 1),
(166, 82, 25, 3),
(167, 82, 26, 1),
(168, 82, 27, 2),
(169, 82, 28, 3),
(170, 82, 29, 1),
(171, 82, 30, 1),
(172, 82, 31, 2),
(173, 82, 32, 1),
(174, 82, 66, 7),
(175, 82, 67, 2),
(176, 82, 68, 2),
(177, 82, 69, 2),
(178, 82, 70, 2),
(179, 82, 71, 2),
(180, 82, 72, 1),
(181, 82, 73, 2),
(182, 82, 74, 1),
(183, 82, 75, 2),
(184, 86, 1, 2),
(185, 86, 2, 2),
(186, 86, 3, 2),
(187, 86, 4, 2),
(188, 86, 5, 3),
(189, 86, 9, 8),
(190, 86, 6, 3),
(191, 86, 7, 3),
(192, 86, 8, 8),
(193, 86, 10, 2),
(194, 86, 11, 1),
(195, 86, 12, 2),
(196, 86, 13, 2),
(197, 86, 14, 1),
(198, 86, 15, 3),
(199, 86, 16, 3),
(200, 86, 17, 7),
(201, 86, 18, 2),
(202, 86, 19, 2),
(203, 86, 20, 3),
(204, 86, 21, 3),
(205, 86, 22, 1),
(206, 86, 23, 2),
(207, 86, 24, 2),
(208, 86, 25, 3),
(209, 86, 26, 3),
(210, 86, 27, 7),
(211, 86, 28, 2),
(212, 86, 29, 2),
(213, 86, 30, 1),
(214, 86, 31, 3),
(215, 86, 32, 2),
(216, 86, 66, 7),
(217, 86, 67, 3),
(218, 86, 68, 8),
(219, 86, 69, 3),
(220, 86, 70, 7),
(221, 86, 71, 1),
(222, 86, 72, 3),
(223, 86, 73, 3),
(224, 86, 74, 1),
(225, 86, 75, 2),
(226, 91, 1, 3),
(227, 91, 2, 2),
(228, 91, 3, 3),
(229, 91, 4, 2),
(230, 91, 5, 2),
(231, 91, 6, 7),
(232, 91, 7, 2),
(233, 91, 8, 7),
(234, 91, 9, 3),
(235, 91, 10, 3),
(236, 91, 11, 3),
(237, 91, 12, 2),
(238, 91, 13, 1),
(239, 91, 14, 1),
(240, 91, 15, 1),
(241, 91, 16, 2),
(242, 91, 17, 3),
(243, 91, 18, 1),
(244, 91, 19, 1),
(245, 91, 20, 2),
(246, 91, 21, 2),
(247, 91, 22, 3),
(248, 91, 23, 2),
(249, 91, 24, 3),
(250, 91, 25, 3),
(251, 91, 26, 2),
(252, 91, 27, 3),
(253, 91, 28, 2),
(254, 91, 29, 2),
(255, 91, 30, 3),
(256, 91, 31, 1),
(257, 91, 32, 3),
(258, 91, 66, 2),
(259, 91, 67, 3),
(260, 91, 68, 1),
(261, 91, 69, 1),
(262, 91, 70, 3),
(263, 91, 71, 2),
(264, 91, 72, 2),
(265, 91, 73, 2),
(266, 91, 74, 1),
(267, 91, 75, 2),
(268, 96, 1, 3),
(269, 96, 2, 3),
(270, 96, 3, 7),
(271, 96, 4, 2),
(272, 96, 5, 7),
(273, 96, 6, 7),
(274, 96, 7, 3),
(275, 96, 8, 7),
(276, 96, 9, 7),
(277, 96, 10, 3),
(278, 96, 11, 1),
(279, 96, 12, 8),
(280, 96, 13, 3),
(281, 96, 14, 3),
(282, 96, 15, 2),
(283, 96, 16, 2),
(284, 96, 17, 7),
(285, 96, 18, 1),
(286, 96, 19, 2),
(287, 96, 20, 3),
(288, 96, 21, 1),
(289, 96, 22, 3),
(290, 96, 23, 7),
(291, 96, 24, 7),
(292, 96, 25, 3),
(293, 96, 26, 7),
(294, 96, 27, 3),
(295, 96, 28, 2),
(296, 96, 29, 7),
(297, 96, 30, 2),
(298, 96, 31, 8),
(299, 96, 32, 7),
(300, 96, 66, 3),
(301, 96, 67, 7),
(302, 96, 68, 7),
(303, 96, 69, 3),
(304, 96, 70, 7),
(305, 96, 71, 7),
(306, 96, 72, 3),
(307, 96, 73, 3),
(308, 96, 74, 2),
(309, 96, 75, 3);

-- --------------------------------------------------------

--
-- Table structure for table `administrador`
--

CREATE TABLE `administrador` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Contrasena` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrador`
--

INSERT INTO `administrador` (`ID`, `Nombre`, `Apellido`, `Email`, `Contrasena`) VALUES
(1, 'Wilber', 'Rivas', 'wilber.rivas2003@gmail.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(2, 'Administrador', 'Principal', 'admin@neuroeval.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(3, 'Rodolfo', 'Rivas', 'rodolfo@gmail.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(4, 'Herberth', 'Contreras', 'herberth@gmail.com', '$2b$10$PhNK9QvFkimrY3qLeSjJlOO1M2IB9lm1NEtom9G1WhWlnG/nBBJz6');

-- --------------------------------------------------------

--
-- Table structure for table `ados`
--

CREATE TABLE `ados` (
  `ID` int(11) NOT NULL,
  `EvaluacionID` int(11) DEFAULT NULL,
  `ActividadID` int(11) DEFAULT NULL,
  `Observacion` varchar(300) DEFAULT NULL,
  `Puntuacion` int(11) DEFAULT NULL,
  `CategoriaID` int(11) DEFAULT NULL,
  `Modulo` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ados`
--

INSERT INTO `ados` (`ID`, `EvaluacionID`, `ActividadID`, `Observacion`, `Puntuacion`, `CategoriaID`, `Modulo`) VALUES
(13, 103, 4, 'afsd', 1, 1, '1'),
(14, 104, 13, 'asdf', 2, 2, '4'),
(15, 104, 14, 'dfgfdgdf', 3, 1, '4'),
(16, 105, 3, 'algo más', 3, 1, 'T'),
(17, 105, 1, 'gsdfg', 3, 1, 'T'),
(18, 105, 2, 'fghfgh', 3, 1, 'T'),
(19, 106, 3, 'jhgjhg', 0, 1, 'T'),
(20, 106, 1, 'dfgfdg', 1, 3, 'T'),
(21, 106, 2, 'fgfgf', 2, 1, 'T'),
(22, 112, 13, 'sdfsdfasd', 1, 1, '4'),
(23, 112, 15, '', 2, 2, '4'),
(24, 112, 14, '', 1, 1, '4'),
(25, 112, 69, '', 2, 6, '4'),
(26, 112, 70, '', 1, 1, '4'),
(27, 112, 76, 'sdf', 2, 5, '4'),
(28, 113, 4, 'fdsafs', 1, 1, '1');

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
(2, 'Imaginación y creatividad '),
(3, 'Interacción social recíproca'),
(4, 'Comportamientos estereotipados e intereses restrin'),
(5, 'Comportamientos restringidos y repetitivos'),
(6, 'Otros comportamientos observables');

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
(5, 65, 'ninguno', 7),
(6, 66, 'ados', 14),
(7, 67, 'ambos', 21),
(8, 68, 'adir', 16),
(9, 80, 'ambos', 21),
(10, 83, 'ambos', 18),
(11, 84, 'adir', 18),
(12, 85, 'ambos', 14),
(13, 88, 'ninguno', 13),
(14, 89, 'adir', 20),
(15, 90, 'ambos', 21),
(16, 95, 'adir', 14),
(17, 97, 'ados', 20);

-- --------------------------------------------------------

--
-- Table structure for table `especialista`
--

CREATE TABLE `especialista` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Contrasena` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especialista`
--

INSERT INTO `especialista` (`ID`, `Nombre`, `Apellido`, `Email`, `Contrasena`) VALUES
(1, 'paola', 'vidal', 'paola@gmail.com', '$2b$10$LjfF9G12q.cuZiAcCOLR1.oNzItWhRv.zzL7R8s4Tf6eUnKguhdzi'),
(2, 'Eyleen', 'Salinas', 'eyleen@gmail.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(3, 'gggg', 'ggggg', 'maria@gmail.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(4, 'Prueba', 'Prueba', 'prueba@gmail.com', '$2b$10$Gps6oXUAfkuA9QUUOIyDz.hW5x.DLO8mOB6DB7FTq//k6PaWh.qBC'),
(5, 'asdf', 'asdf', 'asdf@gmail.com', '$2b$10$LjfF9G12q.cuZiAcCOLR1.oNzItWhRv.zzL7R8s4Tf6eUnKguhdzi');

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
(46, 13, 3, '2025-05-17 00:00:00', 'ADI-R'),
(64, 1, 1, '2025-05-23 08:56:16', 'DSM5'),
(65, 2, 1, '2025-05-23 09:06:33', 'DSM-5'),
(66, 1, 1, '2025-05-23 15:24:47', 'DSM-5'),
(67, 4, 1, '2025-05-23 16:45:45', 'DSM-5'),
(68, 5, 1, '2025-05-23 16:46:31', 'DSM-5'),
(80, 1, 1, '2025-05-23 17:26:56', 'DSM-5'),
(82, 5, 1, '2025-05-23 00:00:00', 'ADI-R'),
(83, 2, 1, '2025-05-24 01:40:36', 'DSM-5'),
(84, 15, 1, '2025-05-24 03:35:05', 'DSM-5'),
(85, 15, 1, '2025-05-24 03:35:51', 'DSM-5'),
(86, 15, 1, '2025-05-24 00:00:00', 'ADI-R'),
(88, 16, 1, '2025-05-24 06:18:02', 'DSM-5'),
(89, 16, 1, '2025-05-24 06:19:25', 'DSM-5'),
(90, 16, 1, '2025-05-24 06:19:54', 'DSM-5'),
(91, 16, 1, '2025-05-24 00:00:00', 'ADI-R'),
(93, 16, 1, '2025-05-24 00:00:00', 'ADI-R'),
(95, 17, 1, '2025-05-24 14:07:46', 'DSM-5'),
(96, 17, 1, '2025-05-24 00:00:00', 'ADI-R'),
(97, 17, 1, '2025-05-24 14:11:06', 'DSM-5'),
(103, 1, 1, '2025-05-31 19:10:17', 'ADOS-2'),
(104, 1, 1, '2025-05-31 19:38:13', 'ADOS-2'),
(105, 1, 1, '2025-05-31 19:46:17', 'ADOS-2'),
(106, 1, 1, '2025-05-31 19:47:07', 'ADOS-2'),
(109, 1, 1, '2025-05-31 00:00:00', 'ADI-R'),
(110, 1, 1, '2025-05-31 00:00:00', 'ADI-R'),
(112, 17, 1, '2025-06-02 17:44:19', 'ADOS-2'),
(113, 17, 1, '2025-06-02 17:51:42', 'ADOS-2');

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
(15, 'Maicol', 'Monje', '2004-05-23 00:00:00', 'santa anass', '7898-5421', 'maicol@gmail.com'),
(16, 'Ever', 'Zamora', '2004-02-11 00:00:00', 'santa ana', '1234-1234', 'ever@gmail.com'),
(17, 'Rodolfo', 'Rodriguez', '2004-01-09 00:00:00', 'santa anaa', '7878-8787', 'rodolfo2@gmail.com');

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
(4, 46, '2025-05-17 00:00:00', 'el niño presenta tal cosa'),
(17, 64, '2025-05-23 08:56:18', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(18, 65, '2025-05-23 09:06:33', 'Bajo nivel de indicios.'),
(19, 66, '2025-05-23 15:24:47', 'Algunos indicios. Se recomienda observar más.'),
(20, 67, '2025-05-23 16:45:45', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(21, 68, '2025-05-23 16:46:31', 'Algunos indicios. Se recomienda observar más.'),
(22, 80, '2025-05-23 17:26:56', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(23, 82, '2025-05-23 00:00:00', 'Diagnostico de prueba'),
(24, 83, '2025-05-24 01:40:36', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(25, 84, '2025-05-24 03:35:05', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(26, 85, '2025-05-24 03:35:51', 'Algunos indicios. Se recomienda observar más.'),
(27, 86, '2025-05-24 00:00:00', 'Está medio enfermito'),
(29, 88, '2025-05-24 06:18:02', 'Algunos indicios. Se recomienda observar más.'),
(30, 89, '2025-05-24 06:19:25', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(31, 90, '2025-05-24 06:19:54', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(32, 91, '2025-05-24 00:00:00', 'La persona muestra muchos indicios de tener autismo'),
(35, 95, '2025-05-24 14:07:46', 'Algunos indicios. Se recomienda observar más.'),
(36, 96, '2025-05-24 00:00:00', 'La persona muestra indicios claros de TEA'),
(37, 97, '2025-05-24 14:11:06', 'Nivel alto de indicios. Se sugiere evaluación profesional.'),
(40, 103, '2025-05-31 00:00:00', 'sdfasdf'),
(41, 104, '2025-05-31 00:00:00', 'fghfhfghgh'),
(42, 105, '2025-05-31 00:00:00', 'fghjgfhgh'),
(43, 106, '2025-05-31 00:00:00', 'gfghd'),
(44, 112, '2025-06-02 00:00:00', 'sadfsdfsdfsd'),
(45, 113, '2025-06-02 00:00:00', 'sadfsdf');

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
-- Indexes for table `actividadados`
--
ALTER TABLE `actividadados`
  ADD PRIMARY KEY (`ID`);

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
  ADD KEY `CategoriaID` (`CategoriaID`),
  ADD KEY `fk_actividad` (`ActividadID`);

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
-- AUTO_INCREMENT for table `actividadados`
--
ALTER TABLE `actividadados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `adir`
--
ALTER TABLE `adir`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=350;

--
-- AUTO_INCREMENT for table `administrador`
--
ALTER TABLE `administrador`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ados`
--
ALTER TABLE `ados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dsm5`
--
ALTER TABLE `dsm5`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `especialista`
--
ALTER TABLE `especialista`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `paciente`
--
ALTER TABLE `paciente`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

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
  ADD CONSTRAINT `ados_ibfk_2` FOREIGN KEY (`CategoriaID`) REFERENCES `categoria` (`ID`),
  ADD CONSTRAINT `fk_actividad` FOREIGN KEY (`ActividadID`) REFERENCES `actividadados` (`ID`);

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
