const express = require("express");
const cors = require('cors'); // Importa el paquete cors
const apiRouter = require('./rsi_acciones');
const apiCryptos = require('./rsi_criptos');
const app = express();
const PORT = process.env.PORT || 8080;

// Configura el middleware cors para todas las rutas
app.use(cors());

app.use('/acciones', apiRouter);

app.use('/', apiCryptos);


app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});