// server/models/userModel.js
const db = require('../config/db');

const UserModel = {
  getAllUsers: (callback) => {
    const sql = "SELECT * FROM Users";
    db.all(sql, [], callback);
  },

  createUser: ({ Name, Email, Password }, callback) => {
    const sql = "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)";
    db.run(sql, [Name, Email, Password], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },
};

module.exports = UserModel;
