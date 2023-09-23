const mysql = require('mysql2');
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path'); // Importa el módulo path

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: "sql10.freesqldatabase.com",
  user: "sql10648173",
  password: "FEjGeKzTZC",
  database: "sql10648173"
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }

  console.log('Conexión a la base de datos exitosa.');

  // Consulta SQL para obtener todos los ingredientes
  const sql = 'SELECT ingredientes FROM receta';

  // Ejecuta la consulta SQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      return;
    }

    // Utiliza un conjunto para almacenar ingredientes únicos en minúsculas
    const ingredientesSet = new Set();

    // Procesa los resultados para extraer los ingredientes
    for (const row of results) {
      const ingredientesReceta = row.ingredientes.split(', ');
      for (const ingrediente of ingredientesReceta) {
        // Convierte el ingrediente a minúsculas antes de agregarlo al conjunto
        ingredientesSet.add(ingrediente.toLowerCase());
      }
    }

    // Convierte el conjunto de nuevo a un array si es necesario
    const ingredientes = Array.from(ingredientesSet);

    // Cierra la conexión a la base de datos
    connection.end();

    app.get('/', (req, res) => {
      // Renderiza el archivo "ingredientes.ejs" con los datos
      res.render('ingredientes', { ingredientes: ingredientes });
    });
    
    // Configura EJS como motor de vistas
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    
    // Inicia el servidor web en el puerto 3000
    app.listen(3000, () => {
      console.log('Servidor web en ejecución en el puerto 3000');
    });
  });
});