

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tareas from './pages/Tareas';
import CrearTarea from './pages/CrearTarea';
import EditarTarea from './pages/EditarTarea';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tareas" element={<Tareas />} />
                <Route path="/creartarea" element={<CrearTarea />} />
                <Route path="/editartarea/:id" element={<EditarTarea />} />
                
            </Routes>
        </Router>
    );
}

export default App;
 