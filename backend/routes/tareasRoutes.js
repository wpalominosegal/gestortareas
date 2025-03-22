const express = require("express");
const { Tareas } = require("../models");
const router = express.Router();
const { Op } = require("sequelize"); // Importar operadores de Sequelize



// Crear una tarea
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, estado, fechalimite } = req.body;
    const task = await Tareas.create({
      titulo,
      descripcion,
      estado,
      fechalimite,
      userId: req.user.id, // Asumiendo que el userId se obtiene del middleware de autenticación
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las tareas del usuario autenticado
router.get("/", async (req, res) => {
  try {
    console.log(req.user.id)
    const tasks = await Tareas.findAll({
      where: { userId: req.user.id },
      attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"], // Seleccionar solo las columnas necesarias
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// router.get("/:id", async (req, res) => {
//   try {
//     const task = await Tareas.findOne({
//       where: { id: req.params.id, userId: req.user.id }, // Filtrar por ID de tarea y ID de usuario
//       attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"],
//     });
//     task ? res.json(task) : res.status(404).json({ error: "Tarea no encontrada" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Obtener una tarea por ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Tareas.findOne({
      where: { id: req.params.id, userId: req.user.id },
      attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"], // Seleccionar solo las columnas necesarias
    });
    task ? res.json(task) : res.status(404).json({ error: "Tarea no encontrada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Actualizar una tarea
// router.put("/:id", async (req, res) => {
//   try {
//     const { titulo, descripcion, estado, fechalimite } = req.body;
//     const task = await Tareas.findOne({ where: { id: req.params.id, userId: req.user.id } });
//     if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

//     await task.update({ titulo, descripcion, estado, fechalimite });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Actualizar una tarea con validaciones de estado
router.put("/:id", async (req, res) => {
  try {
    const { titulo, descripcion, estado, fechalimite } = req.body;

    // Buscar la tarea por ID y userId
    const task = await Tareas.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    // Si la tarea no existe, devolver un error 404
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Validar las reglas de actualización de estado
    if (estado) {
      // Regla 1: Solo se puede marcar como "en progreso" si está en "pendiente"
      if (estado === "en progreso" && task.estado !== "pendiente") {
        return res.status(400).json({
          error: 'Solo se puede marcar como "en progreso" si la tarea está en "pendiente"',
        });
      }

      // Regla 2: No se puede volver a "pendiente" desde "en progreso" o "completada"
      if (estado === "pendiente" && task.estado !== "pendiente") {
        return res.status(400).json({
          error: 'No se puede volver a "pendiente" desde "en progreso" o "completada"',
        });
      }
    }

    // Actualizar la tarea
    await task.update({ titulo, descripcion, estado, fechalimite });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Eliminar una tarea
// router.delete("/:id", async (req, res) => {
//   try {
//     const task = await Tareas.findOne({ where: { id: req.params.id, userId: req.user.id } });
//     if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

//     await task.destroy();
//     res.json({ mensaje: "Tarea eliminada" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Eliminar una tarea solo si su estado es "completada"
router.delete("/:id", async (req, res) => {
  try {
    // Buscar la tarea por ID y userId
    const task = await Tareas.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    // Si la tarea no existe, devolver un error 404
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Verificar si el estado de la tarea es "completada"
    if (task.estado !== "completada") {
      return res.status(400).json({ error: "Solo se pueden eliminar tareas completadas" });
    }

    // Eliminar la tarea
    await task.destroy();
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// // Obtener todos las tareas
// router.get("/", async (req, res) => {
//   const tareas = await Tareas.findAll(); // Busca todos los clientes en la BD
//   res.json(tareas); // Devuelve la lista de clientes en formato JSON
// });

// // filtros por estado

// router.get("/", async (req, res) => {
//   try {
//     const { status } = req.query;
//     const whereClause = { userId: req.user.id }; // Filtro base: tareas del usuario autenticado

//     // Filtrar por estado
//     if (status && status !== "todas") {
//       whereClause.estado = status;
//     }

//     const tasks = await Tareas.findAll({
//       where: whereClause,
//       attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"],
//     });

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// //Filtrar por titulo o palabra clave
// router.get("/", async (req, res) => {
//   try {
//     const { search } = req.query;
//     const whereClause = { userId: req.user.id }; // Filtro base: tareas del usuario autenticado

//     // Buscar por título o descripción
//     if (search) {
//       whereClause[Op.or] = [
//         { titulo: { [Op.iLike]: `%${search}%` } }, // Búsqueda insensible a mayúsculas/minúsculas
//         { descripcion: { [Op.iLike]: `%${search}%` } },
//       ];
//     }

//     const tasks = await Tareas.findAll({
//       where: whereClause,
//       attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"],
//     });

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// //Filtrar por fecha
// router.get("/", async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const whereClause = { userId: req.user.id }; // Filtro base: tareas del usuario autenticado

//     // Filtrar por rango de fechas
//     if (startDate && endDate) {
//       whereClause.fechalimite = {
//         [Op.between]: [new Date(startDate), new Date(endDate)],
//       };
//     }

//     const tasks = await Tareas.findAll({
//       where: whereClause,
//       attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"],
//     });

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    const { status, search, startDate, endDate } = req.query;
    const whereClause = { userId: req.user.id }; // Filtro base: tareas del usuario autenticado

        // Depuración: Verificar el parámetro "status"
    console.log("Status recibido:", status);

    // Filtrar por estado
    if (status && status !== "todas") {
      whereClause.estado = status;
    }

    // Buscar por título o descripción
    if (search) {
      whereClause[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } }, // Búsqueda insensible a mayúsculas/minúsculas
        { descripcion: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtrar por rango de fechas
    if (startDate && endDate) {
      whereClause.fechalimite = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const tasks = await Tareas.findAll({
      where: whereClause,
      attributes: ["id", "titulo", "descripcion", "estado", "fechalimite"],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;