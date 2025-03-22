
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Tareas.css'; // Importar el archivo CSS

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Obtener las tareas del usuario con filtros
    const fetchTasks = async () => {
        setLoading(true);
        try {
            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                alert('La fecha de inicio no puede ser mayor que la fecha de fin');
                return;
            }

            const token = localStorage.getItem('token');
            const params = {};

            if (statusFilter !== 'todas') {
                params.status = statusFilter;
            }
            if (searchTerm) {
                params.search = searchTerm;
            }
            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await axios.get('http://localhost:5000/tareas', {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            setTasks(response.data);
        } catch (error) {
            alert('Error al obtener tareas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar las tareas al montar el componente o cambiar los filtros
    useEffect(() => {
        fetchTasks();
    }, [statusFilter, searchTerm, startDate, endDate]);

    // Eliminar una tarea
    const handleDelete = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/tareas/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.filter((task) => task.id !== taskId));
            alert('Tarea eliminada exitosamente');
        } catch (error) {
            alert('Error al eliminar la tarea');
            console.error(error);
        }
    };

    // Redirigir a la página de edición
    const handleUpdate = (taskId) => {
        navigate(`/editartarea/${taskId}`);
    };

    // Restablecer los filtros
    const handleResetFilters = () => {
        setStatusFilter('todas');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1>Mis Tareas</h1>
                <button className="create-task-button" onClick={() => navigate('/creartarea')}>
                    Crear Tarea
                </button>
            </div>

            {/* Filtros */}
            <div className="filters">
                <div className="filter-group">
                    <label>Filtrar por estado:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="todas">Todas</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Buscar tarea:</label>
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* <div className="filter-group">
                    <label>Filtrar por fechas:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div> */}
                <div className="filter-group horizontal">
                    <label>Filtrar por fechas:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    </div>

                <button className="apply-filters-button" onClick={fetchTasks}>
                    Aplicar Filtros
                </button>
                {/* <button className="reset-filters-button" onClick={handleResetFilters}>
                    Restablecer Filtros
                </button> */}
            </div>

            {/* Lista de tareas */}
            {loading ? (
                <p>Cargando tareas...</p>
            ) : Array.isArray(tasks) && tasks.length > 0 ? (
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <h3>{task.titulo}</h3>
                            <p>{task.descripcion}</p>
                            <div className={`task-status ${task.estado.replace(' ', '-')}`}>
                                {task.estado}
                            </div>
                            <div className="task-due-date">
                                Fecha límite: {new Date(task.fechalimite).toLocaleDateString()}
                            </div>
                            <div className="task-actions">
                                <button className="action-button edit-button" onClick={() => handleUpdate(task.id)}>
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                </button>
                                <button className="action-button delete-button" onClick={() => handleDelete(task.id)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-tasks-message">No hay tareas disponibles</p>
            )}
        </div>
    );
};

export default Tasks;

