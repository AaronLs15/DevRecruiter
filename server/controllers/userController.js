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

  getUserByID: (req, res) => {
    const { ID } = req.params;
    UserModel.getUserByID(ID, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ data: row });
    });
  },

  createUser: (req, res) => {
    const { Name, Email, Password, Rol } = req.body;
    // Validación básica
    if (!Name || !Email || !Password || !Rol) {
      return res.status(400).json({ error: "Te hacen falta datos (incluye Rol)" });
    }
    // Comprueba que Rol sea uno de los permitidos
    const rolesPermitidos = ["Aspirante", "Empleador"];
    if (!rolesPermitidos.includes(Rol)) {
      return res.status(400).json({ error: "Rol inválido" });
    }
    UserModel.createUser({ Name, Email, Password, Rol }, (err, lastID) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: lastID });
    });
  },

  actAspirante: (req, res) => {
    const {ID_Usuario,Experiencia,Puesto_Aspirado,Habilidades,Ubicacion} = req.body;
    // Validación básica
    if (!ID_Usuario || !Experiencia || !Puesto_Aspirado || !Habilidades || !Ubicacion) {
      return res.status(400).json({ error: "Te hacen falta datos" });
    }
    UserModel.actAspirante({ID_Usuario,Experiencia,Puesto_Aspirado,Habilidades,Ubicacion}, (err, lastID) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: lastID });
    });
  },

  actEmpleador: (req, res) => {
    const {ID_Usuario,Empresa} = req.body;
    // Validación básica
    if (!ID_Usuario || !Empresa) {
      return res.status(400).json({ error: "Te hacen falta datos" });
    }
    UserModel.actEmpleador({ID_Usuario,Empresa}, (err, lastID) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: lastID });
    });
  },

  iniciarSesion: (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ error: "Te hacen falta datos" });
    }
    UserModel.iniciarSesion({ Email, Password }, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
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
  },

  actCalificacionPrimeraFase: (req, res) => {
    const { Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion } = req.body;

    // Validaciones básicas
    if (!Preguntas || !Respuestas || !ID_Entrevista || !Fase || !Calificacion) {
      return res.status(400).json({ error: 'Faltan campos requeridos en el payload' });
    }

    UserModel.actCalificacionPrimeraFase(
      { Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion },
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Calificación actualizada correctamente' });
      }
    );
  },

  actCalificacionSegundaFase: async (req, res) => {
    try {
      const { Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion } = req.body;
      if (![Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion].every(v => v != null)) {
        return res.status(400).json({ error: 'Faltan campos requeridos en el payload' });
      }

      // 1. Inserción de la segunda fase
      await UserModel.actCalificacionSegundaFase({ Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion });

      // 2. Cálculo y actualización del promedio global
      await UserModel.actCalificacionPorEntrevista(ID_Entrevista);

      // 3. Respuesta final
      res.json({ message: 'Calificación general actualizada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  actFeedbackEntrevistau: async (req, res) => {
    try {
      const { ID_Entrevista, Feedback } = req.body;
      if (!ID_Entrevista || !Feedback) {
        return res.status(400).json({ error: 'Faltan campos requeridos en el payload' });
      }

      await UserModel.actFeedbackEntrevista(ID_Entrevista, Feedback);
      res.json({ message: 'Feedback actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  actEntrevistaFinalizada: async (req, res) => {
    try {
      const { ID_Entrevista,EntrevistaText } = req.body;
      if (!ID_Entrevista || !EntrevistaText) {
        return res.status(400).json({ error: 'Faltan campos requeridos en el payload' });
      }
      await UserModel.actEntrevistaFinal(ID_Entrevista, EntrevistaText);
      res.json({ message: 'Entrevista actualizada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getEntrevistaByUserID: (req, res) => {
    const { ID_Usuario } = req.params;
    UserModel.getEntrevistaByUserID(ID_Usuario, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  },

  getProfile: (req, res) => {
    const ID_Usuario = req.params.id;
    // Toma el Rol del query string
    const rol = req.query.Rol;

    if (!rol) {
      return res.status(400).json({ message: 'Falta el parámetro Rol' });
    }

    UserModel.getProfileData(ID_Usuario, rol, (err, profile) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
      res.json(profile);
    });
  },

  getPuntajes: (req, res) => {
    const ID_Usuario = req.params.id;
    UserModel.getPuntajes(ID_Usuario, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  }

};

module.exports = userController;
