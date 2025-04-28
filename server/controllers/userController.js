// server/controllers/userController.js
const UserModel = require('../models/userModel');

const userController = {
  getAllUsers: (req, res) => {
    UserModel.getAllUsers((err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  },

  createUser: (req, res) => {
    const { Name, Email, Password } = req.body;
    if (!Name || !Email || !Password) {
      return res.status(400).json({ error: "Te hacen falta datos" });
    }
    UserModel.createUser({ Name, Email, Password }, (err, lastID) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: lastID });
    });
  },

  getPrimeraFase: (req, res) => {
    UserModel.getPrimeraFase((err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  },

  /**
   * Crea una nueva entrevista y retorna su ID_Entrevista
   */
  createEntrevista: (req, res) => {
    const { ID_Aspirante, ID_Sector, Tipo_Entrevista, Fecha_Entrevista, Estado } = req.body;

    // Validaciones básicas
    if (!ID_Aspirante || !ID_Sector || !Tipo_Entrevista || !Fecha_Entrevista || !Estado) {
      return res.status(400).json({ error: 'Faltan campos requeridos en el payload' });
    }

    UserModel.createEntrevista(
      { ID_Aspirante, ID_Sector, Tipo_Entrevista, Fecha_Entrevista, Estado },
      (err, ID_Entrevista) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Retornar el ID generado
        res.json({ ID_Entrevista });
      }
    );
  }
  
};

module.exports = userController;
