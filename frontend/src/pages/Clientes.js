// import React, { useState } from 'react';
// import ClienteForm from '../components/ClienteForm';
// import ClienteList from '../components/ClienteList';
// import '../styles/Cliente.css'

// const Clientes = () => {
//   const [clientes, setClientes] = useState([]);

//   const handleClienteAdded = (nuevoCliente) => {
//     setClientes([...clientes, nuevoCliente]);
//   };

//   return (
//     <div className="clientes-container">
//       <h1>Clientes</h1>
//       <div className="clientes-form">
//         <ClienteForm onClienteAdded={handleClienteAdded} />
//       </div>
//       <div className="clientes-list">
//         <ClienteList />
//       </div>
//     </div>
//   );
// };

// export default Clientes;

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const fetchTasks = useCallback(async () => {
        try {
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
        }
    }, [statusFilter, searchTerm, startDate, endDate]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // Ahora `fetchTasks` está en la lista de dependencias sin causar el warning

    return (
        <div>
            <h1>Mis Tareas</h1>
            <button onClick={() => navigate('/creartarea')}>Crear Tarea</button>

            <div>
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

            <div>
                <label>Buscar tarea:</label>
                <input
                    type="text"
                    placeholder="Buscar por título o descripción"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div>
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

            <button onClick={fetchTasks}>Aplicar Filtros</button>

            {Array.isArray(tasks) && tasks.length > 0 ? (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha Límite</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.titulo}</td>
                                <td>{task.descripcion}</td>
                                <td>{task.estado}</td>
                                <td>{new Date(task.fechalimite).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => navigate(`/editartarea/${task.id}`)}>Editar</button>
                                    <button onClick={() => handleDelete(task.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay tareas disponibles</p>
            )}
        </div>
    );
};

export default Tasks;
