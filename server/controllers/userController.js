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
};

module.exports = userController;
