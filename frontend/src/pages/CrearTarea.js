import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CrearTarea = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [fechalimite, setFechalimite] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!titulo || !estado) {
      setError("El título y el estado son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Obtener el token del localStorage

      // Convertir la fecha a UTC
       const fechaUTC = fechalimite ? new Date(fechalimite).toISOString().split("T")[0] : null;

      const response = await axios.post(
        "http://localhost:5000/tareas",
        {
          titulo,
          descripcion,
          estado,
          fechalimite: fechaUTC,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el header
          },
        }
      );

      console.log("Tarea creada:", response.data);
      navigate("/tareas"); // Redirigir a la lista de tareas
    } catch (error) {
      setError("Error al crear la tarea. Inténtalo de nuevo.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Crear Nueva Tarea</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <label>Estado:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            // required
            disabled
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div>
          <label>Fecha Límite:</label>
          <input
            type="date"
            value={fechalimite}
            onChange={(e) => setFechalimite(e.target.value)}
          />
        </div>
        <button type="submit">Crear Tarea</button>
      </form>
    </div>
  );
};

export default CrearTarea;