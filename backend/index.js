const express = require("express");
const { Sequelize } = require("sequelize");
const cors = require("cors"); // Importa el paquete CORS
const dbConfig = require("./config/config.json").development;

 const authMiddleware = require("./middleware/authMiddleware");

const userRoutes = require("./routes/userRoutes");
const tareasRoutes = require("./routes/tareasRoutes");
require("dotenv").config();

const app = express();
const sequelize = new Sequelize(dbConfig);

// Usa CORS para permitir solicitudes de otros orígenes
app.use(cors()); // Habilita CORS

app.use(express.json());
app.use("/usuarios", userRoutes);
app.use("/tareas", authMiddleware, tareasRoutes);



// Conectar a la base de datos
sequelize.authenticate()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch(err => console.error("Error al conectar:", err));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API! Usa /clientes o /pedidos para interactuar.");
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
