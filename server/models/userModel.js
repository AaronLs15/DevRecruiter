
const db = require('../config/db');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3.2';

const UserModel = {
  getAllUsers: (callback) => {
    const sql = "SELECT * FROM usuarios";
    db.all(sql, [], callback);
  },

  createUser: ({ Name, Email, Password }, callback) => {
    const sql = "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)";
    db.run(sql, [Name, Email, Password], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },

  getPrimeraFase: (callback) => {
    const sql = `
      SELECT pregunta
      FROM Preguntas
      WHERE ID BETWEEN 1 AND 10
      ORDER BY RANDOM()
      LIMIT 5
    `;
    db.all(sql, [], callback);
  },

  createEntrevista: (
    { ID_Aspirante, ID_Sector, Tipo_Entrevista, Fecha_Entrevista, Estado },
    callback
  ) => {
    const sql = `
      INSERT INTO Entrevista
        (ID_Aspirante,
         ID_Sector,
         Tipo_Entrevista,
         Puntaje_Total,
         Fecha_Entrevista,
         Duracion,
         Estado)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
    `;
    // Asignamos 0 a Puntaje_Total y 0 a Duracion por defecto
    db.run(
      sql,
      [
        ID_Aspirante,
        ID_Sector,
        Tipo_Entrevista,
        0,                // Puntaje_Total por defecto
        Fecha_Entrevista,
        0,                // Duracion por defecto
        Estado
      ],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  actCalificacionPrimeraFase: (
    { Preguntas,Respuestas,ID_Entrevista,Fase,Calificacion}, callback
  ) => {
    const sql = `
      INSERT INTO Evaluacion
        (Preguntas,Respuestas,ID_Entrevista,FaseNumero,Puntaje)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [Preguntas, Respuestas,ID_Entrevista,Fase, Calificacion],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  actCalificacionSegundaFase: (
    { Preguntas,Respuestas,ID_Entrevista,Fase,Calificacion}, callback
  ) => {
    const sql = `
      INSERT INTO Evaluacion
        (Preguntas,Respuestas,ID_Entrevista,FaseNumero,Puntaje)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [Preguntas, Respuestas,ID_Entrevista,Fase, Calificacion],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  }

};

module.exports = UserModel;
