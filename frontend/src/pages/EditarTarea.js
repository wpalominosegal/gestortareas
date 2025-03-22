import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarTarea = () => {
    const { id } = useParams(); // Obtener el ID de la tarea de la URL
    console.log(id)
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const [fechalimite, setFechalimite] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/tareas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const task = response.data;
                setTitulo(task.titulo);
                setDescripcion(task.descripcion);
                setEstado(task.estado);
                setFechalimite(task.fechalimite);
            } catch (error) {
                setError('Error al cargar la tarea');
                console.error(error);
            }
        };
        fetchTask();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/tareas/${id}`,
                { titulo, descripcion, estado, fechalimite },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/tareas'); // Redirigir a la lista de tareas después de la actualización
        } catch (error) {
            setError('Error al actualizar la tarea');
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h1>Editar Tarea</h1>
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
                        required
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
                <button type="submit">Actualizar Tarea</button>
            </form>
        </div>
    );
};

export default EditarTarea;