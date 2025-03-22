import React, { useState } from 'react';
import axios from 'axios';

const ClienteForm = ({ onClienteAdded }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/clientes', { nombre, correo });
      onClienteAdded(response.data);
      setNombre('');
      setCorreo('');
    } catch (error) {
      console.error('Error al agregar cliente', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <button type="submit">Agregar Cliente</button>
    </form>
  );
};

export default ClienteForm;
