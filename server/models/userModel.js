
const db = require('../config/db');

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
    const sql = "Select pregunta from Preguntas WHERE ID BETWEEN 1 AND 10";
    db.all(sql, [], callback);
  }
};

module.exports = UserModel;
