const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { Pool } = require('pg'); // Importation du module PostgreSQL

// Configuration CORS
const corsOptions = {
  origin: ['http://localhost:5173/'], // Assure-toi que le port correspond à celui de ton frontend
};

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
  user: 'your_username',          // Remplace par ton nom d'utilisateur PostgreSQL
  host: 'localhost',               // ou l'adresse de ton serveur de base de données
  database: 'fresqueDB',          // Remplace par le nom de ta base de données
  password: 'your_password',       // Remplace par ton mot de passe PostgreSQL
  port: 5432,                      // Port par défaut pour PostgreSQL
});

// Middleware pour gérer les erreurs de connexion à la base de données
app.use((req, res, next) => {
  req.db = pool; // Ajoute la connexion à la base de données à la requête
  next();
});

// Importation des routes
const metiersRouter = require('./routes/metiers');
const composantesRouter = require('./routes/composantes');
const thematiquesRouter = require('./routes/thematiques');
const impactsRouter = require('./routes/impacts');

// Routes
app.use('/metiers', metiersRouter);
app.use('/composantes', composantesRouter);
app.use('/thematiques', thematiquesRouter);
app.use('/impacts', impactsRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send({ message: 'Not Found' });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Exporter l'application
module.exports = app;
