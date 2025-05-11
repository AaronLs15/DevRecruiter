const sqlite3 = require('sqlite3').verbose();
const db = require('../config/db');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3.2';

const UserModel = {
  getAllUsers: (callback) => {
    const sql = "SELECT * FROM usuarios where Rol = 'Aspirante'";
    db.all(sql, [], callback);
  },

  getUserByID: (ID, callback) => {
    const sql = "SELECT * FROM usuarios WHERE ID = ?";
    db.get(sql, [ID], callback);
  },

  createUser: ({ Name, Email, Password, Rol }, callback) => {
    const sql = "INSERT INTO usuarios (Nombre_usuario, Email, Contraseña, Rol) VALUES (?, ?, ?, ?)";
    db.run(sql, [Name, Email, Password, Rol], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },

  iniciarSesion: ({ Email, Password }, callback) => {
    const sql = "SELECT * FROM usuarios WHERE Email = ? AND Contraseña = ?";
    db.all(sql, [Email, Password], callback);
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

  actCalificacionSegundaFase: ({ Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion }) => {
    const sql = `
      INSERT INTO Evaluacion
        (Preguntas, Respuestas, ID_Entrevista, FaseNumero, Puntaje)
      VALUES (?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion], function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  actCalificacionPorEntrevista: (ID_Entrevista) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT AVG(Puntaje) AS avgScore
         FROM Evaluacion
         WHERE ID_Entrevista = ?`,
        [ID_Entrevista],
        (err, row) => {
          if (err) return reject(err);
          const total = row.avgScore || 0;
          db.run(
            `UPDATE Entrevista
             SET Puntaje_Total = ?, Estado = 'Finalizada'
             WHERE ID_Entrevista = ?`,
            [total, ID_Entrevista],
            function(err) {
              if (err) return reject(err);
              resolve(this.changes);
            }
          );
        }
      );
    });
  }
};

module.exports = UserModel;
