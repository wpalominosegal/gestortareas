//Este controlador manejará las rutas de autenticación 
// como el login, donde se genera el JWT 
// al autenticar al usuario.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Suponiendo que tienes un modelo 'Usuario'

const login = async (req, res) => {
  const { correo, password } = req.body;

  const usuario = await Usuario.findOne({ where: { correo } });

  if (!usuario) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
  }

  const isMatch = await bcrypt.compare(password, usuario.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
  }

  // Crear un token JWT
  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.json({ token });
};

module.exports = { login };