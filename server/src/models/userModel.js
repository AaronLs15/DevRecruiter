// server/models/userModel.js
require("dotenv").config();
const { getPool, sql } = require("../config/db");
const bcrypt = require("bcryptjs");

const OLLAMA_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const MODEL_NAME = process.env.OLLAMA_MODEL || "deepseek-r1";

const UserModel = {
  // Obtiene todos los usuarios con rol 'Aspirante' + perfil de Aspirante
  // y un arreglo JSON de entrevistas finalizadas
  getAllUsers: async (callback) => {
    try {
      const pool = await getPool();

      const query = `
        SELECT
          u.*,
          a.Experiencia,
          a.Puesto_Aspirado,
          a.Habilidades,
          a.Ubicacion,
          ISNULL((
            SELECT
              e.Tipo_Entrevista,
              e.Puntaje_Total,
              e.Fecha_Entrevista,
              e.Feedback
            FROM dbo.Entrevista e
            WHERE e.ID_Aspirante = a.ID_Empleado
              AND e.Estado = N'Finalizada'
            FOR JSON PATH
          ), N'[]') AS entrevistas
        FROM dbo.usuarios u
        LEFT JOIN dbo.Aspirante a
          ON a.ID_Usuario = u.id
        WHERE u.Rol = N'Aspirante';
      `;

      const result = await pool.request().query(query);
      callback(null, result.recordset);
    } catch (err) {
      callback(err);
    }
  },

  // Obtiene un usuario por ID + cantidad de entrevistas (ligadas a su Aspirante)
  getUserByID: async (ID, callback) => {
    try {
      const pool = await getPool();

      const query = `
        SELECT
          u.id,
          u.Nombre_usuario,
          u.Email,
          u.Contraseña,
          u.Rol,
          u.Fecha_Registro,
          (
            SELECT COUNT(*)
            FROM dbo.Aspirante a
            JOIN dbo.Entrevista e ON e.ID_Aspirante = a.ID_Empleado
            WHERE a.ID_Usuario = u.id
          ) AS entrevistaCount,
          DATEDIFF(DAY, u.Fecha_Registro, GETDATE()) + 1 AS DiasActivo
      FROM dbo.Usuarios u
      WHERE u.id = @ID;
      `;

      const result = await pool.request().input("ID", sql.Int, ID).query(query);


      callback(null, result.recordset[0] || null);
    } catch (err) {
      callback(err);
    }
  },

  getUserDiasActivo: async (ID, callback) => {
    try {
      const pool = await getPool();

      const query = `
      SELECT
        CONVERT(INT, DATEDIFF(DAY, u.Fecha_Registro, GETDATE()) + 1) AS DiasActivo
      FROM dbo.Usuarios u
      WHERE u.id = @ID;
      `;

      const result = await pool.request().input("ID", sql.Int, ID).query(query);

      callback(null, result.recordset[0] || null);
    } catch (err) {
      callback(err);
    }
  },

  // Crea un usuario
  createUser: async ({ Name, Email, Password, Rol }, callback) => {
    try {
      const pool = await getPool();
      const hashedPassword = await bcrypt.hash(Password, 10);
      const result = await pool
        .request()
        .input("Nombre", sql.NVarChar(255), Name)
        .input("Email", sql.NVarChar(255), Email)
        .input("Password", sql.NVarChar(255), hashedPassword)
        .input("Rol", sql.NVarChar(100), Rol).query(`
          INSERT INTO dbo.usuarios (Nombre_usuario, Email, [Contraseña], Rol)
          OUTPUT INSERTED.id AS id
          VALUES (@Nombre, @Email, @Password, @Rol);
        `);

      const insertedId = result.recordset[0]?.id ?? null;
      callback(null, insertedId);
    } catch (err) {
      callback(err, null);
    }
  },

  // Alta/actualización de Aspirante (a falta de regla, aquí insert simple)
  actAspirante: async (
    { ID_Usuario, Experiencia, Puesto_Aspirado, Habilidades, Ubicacion },
    callback
  ) => {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("ID_Usuario", sql.Int, ID_Usuario)
        .input("Experiencia", sql.NVarChar(sql.MAX), Experiencia ?? null)
        .input("Puesto_Aspirado", sql.NVarChar(255), Puesto_Aspirado ?? null)
        .input("Habilidades", sql.NVarChar(sql.MAX), Habilidades ?? null)
        .input("Ubicacion", sql.NVarChar(255), Ubicacion ?? null).query(`
          INSERT INTO dbo.Aspirante
            (ID_Usuario, Experiencia, Puesto_Aspirado, Habilidades, Ubicacion, ID_Estadistica)
          OUTPUT INSERTED.ID_Empleado AS id
          VALUES (@ID_Usuario, @Experiencia, @Puesto_Aspirado, @Habilidades, @Ubicacion, 0);
        `);

      const insertedId = result.recordset[0]?.id ?? null;
      callback(null, insertedId);
    } catch (err) {
      callback(err, null);
    }
  },

  // Alta Empleador
  actEmpleador: async ({ ID_Usuario, Empresa }, callback) => {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("ID_Usuario", sql.Int, ID_Usuario)
        .input("Empresa", sql.NVarChar(255), Empresa).query(`
          INSERT INTO dbo.Empleador (ID_Usuario, Nombre_Empresa, ID_Sector)
          OUTPUT INSERTED.ID_Empleador AS id
          VALUES (@ID_Usuario, @Empresa, 0);
        `);

      const insertedId = result.recordset[0]?.id ?? null;
      callback(null, insertedId);
    } catch (err) {
      callback(err, null);
    }
  },

  // Login
  iniciarSesion: async ({ Email, Password }, callback) => {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("Email", sql.NVarChar(255), Email)
        .input("Password", sql.NVarChar(255), Password).query(`
          SELECT *
          FROM dbo.usuarios
          WHERE Email = @Email
            AND [Contraseña] = @Password;
        `);

      callback(null, result.recordset);
    } catch (err) {
      callback(err);
    }
  },

  // Primera fase: 5 preguntas aleatorias entre id 1 y 10
  getPrimeraFase: async (callback) => {
    try {
      const pool = await getPool();
      const result = await pool.request().query(`
        SELECT TOP (5) pregunta
        FROM dbo.Preguntas
        WHERE id BETWEEN 1 AND 10
        ORDER BY NEWID();
      `);
      callback(null, result.recordset);
    } catch (err) {
      callback(err);
    }
  },

  // Crear entrevista (con Puntaje_Total y Duracion = 0 por defecto)
  createEntrevista: async (
    { ID_Aspirante, ID_Sector, Tipo_Entrevista, Fecha_Entrevista, Estado },
    callback
  ) => {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("ID_Aspirante", sql.Int, ID_Aspirante)
        .input("ID_Sector", sql.Int, ID_Sector ?? null)
        .input("Tipo_Entrevista", sql.NVarChar(100), Tipo_Entrevista ?? null)
        .input("Fecha_Entrevista", sql.DateTime2, Fecha_Entrevista ?? null)
        .input("Estado", sql.NVarChar(100), Estado ?? null).query(`
          INSERT INTO dbo.Entrevista
            (ID_Aspirante, ID_Sector, Tipo_Entrevista, Puntaje_Total, Fecha_Entrevista, Duracion, Estado)
          OUTPUT INSERTED.ID_Entrevista AS id
          VALUES (@ID_Aspirante, @ID_Sector, @Tipo_Entrevista, 0, @Fecha_Entrevista, 0, @Estado);
        `);

      const insertedId = result.recordset[0]?.id ?? null;
      callback(null, insertedId);
    } catch (err) {
      callback(err, null);
    }
  },

  // Insert calificación (Primera Fase)
  actCalificacionPrimeraFase: async (
    { Preguntas, Respuestas, ID_Entrevista, Fase, Calificacion },
    callback
  ) => {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("Preguntas", sql.NVarChar(sql.MAX), Preguntas)
        .input("Respuestas", sql.NVarChar(sql.MAX), Respuestas)
        .input("ID_Entrevista", sql.Int, ID_Entrevista)
        .input("Fase", sql.Int, Fase)
        .input("Calificacion", sql.Int, Calificacion).query(`
          INSERT INTO dbo.Evaluacion
            (Preguntas, Respuestas, ID_Entrevista, FaseNumero, Puntaje)
          OUTPUT INSERTED.ID AS id
          VALUES (@Preguntas, @Respuestas, @ID_Entrevista, @Fase, @Calificacion);
        `);

      const insertedId = result.recordset[0]?.id ?? null;
      callback(null, insertedId);
    } catch (err) {
      callback(err, null);
    }
  },

  // Insert calificación (Segunda Fase) -> Promise
  actCalificacionSegundaFase: async ({
    Preguntas,
    Respuestas,
    ID_Entrevista,
    Fase,
    Calificacion,
  }) => {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("Preguntas", sql.NVarChar(sql.MAX), Preguntas)
      .input("Respuestas", sql.NVarChar(sql.MAX), Respuestas)
      .input("ID_Entrevista", sql.Int, ID_Entrevista)
      .input("Fase", sql.Int, Fase)
      .input("Calificacion", sql.Int, Calificacion).query(`
        INSERT INTO dbo.Evaluacion
          (Preguntas, Respuestas, ID_Entrevista, FaseNumero, Puntaje)
        OUTPUT INSERTED.ID AS id
        VALUES (@Preguntas, @Respuestas, @ID_Entrevista, @Fase, @Calificacion);
      `);
    return result.recordset[0]?.id ?? null;
  },

  // Recalcula puntaje total de una entrevista y la marca como 'Finalizada'
  actCalificacionPorEntrevista: async (ID_Entrevista) => {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("ID_Entrevista", sql.Int, ID_Entrevista).query(`
        DECLARE @avgScore DECIMAL(10,4);
        SELECT @avgScore = AVG(CONVERT(DECIMAL(10,4), Puntaje))
        FROM dbo.Evaluacion
        WHERE ID_Entrevista = @ID_Entrevista;

        UPDATE dbo.Entrevista
        SET Puntaje_Total = ISNULL(@avgScore, 0),
            Estado = N'Finalizada'
        WHERE ID_Entrevista = @ID_Entrevista;

        SELECT @@ROWCOUNT AS changes;
      `);

    return result.recordset[0]?.changes ?? 0;
  },

  // Actualiza Feedback de una entrevista
  actFeedbackEntrevista: async (ID_Entrevista, Feedback) => {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("ID_Entrevista", sql.Int, ID_Entrevista)
      .input("Feedback", sql.NVarChar(sql.MAX), Feedback).query(`
        UPDATE dbo.Entrevista
        SET Feedback = @Feedback
        WHERE ID_Entrevista = @ID_Entrevista;

        SELECT @@ROWCOUNT AS changes;
      `);
    return result.recordset[0]?.changes ?? 0;
  },

  // Guarda texto libre de la entrevista final
  actEntrevistaFinal: async (ID_Entrevista, EntrevistaText) => {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("ID_Entrevista", sql.Int, ID_Entrevista)
      .input("Entrevista", sql.NVarChar(sql.MAX), EntrevistaText).query(`
        UPDATE dbo.Entrevista
        SET Entrevista = @Entrevista
        WHERE ID_Entrevista = @ID_Entrevista;

        SELECT @@ROWCOUNT AS changes;
      `);
    return result.recordset[0]?.changes ?? 0;
  },

  // Entrevistas por ID_Usuario (corrige la consulta original)
  // Une usuarios -> Aspirante (ID_Usuario) -> Entrevista (ID_Aspirante)
  getEntrevistaByUserID: async (ID_Usuario, callback) => {
    try {
      const pool = await getPool();
      const query = `
        SELECT 
          CONCAT(N'Entrevista', e.ID_Entrevista) AS Folio,
          e.Tipo_Entrevista,
          e.Estado
        FROM dbo.Aspirante a
        JOIN dbo.Entrevista e
          ON e.ID_Aspirante = a.ID_Empleado
        WHERE a.ID_Usuario = @ID_Usuario
        ORDER BY e.ID_Entrevista DESC;
      `;
      const result = await pool
        .request()
        .input("ID_Usuario", sql.Int, ID_Usuario)
        .query(query);

      callback(null, result.recordset);
    } catch (err) {
      callback(err);
    }
  },

  // Datos de perfil por rol
  getProfileData: async (ID_Usuario, rol, callback) => {
    try {
      const pool = await getPool();
      let request = pool.request().input("ID_Usuario", sql.Int, ID_Usuario);
      let query;

      if (rol === "Aspirante") {
        query = `
          SELECT 
            u.Nombre_usuario,
            u.Email,
            a.Experiencia,
            a.Puesto_Aspirado,
            a.Habilidades,
            a.Ubicacion
          FROM dbo.usuarios u
          LEFT JOIN dbo.Aspirante a 
            ON u.id = a.ID_Usuario
          WHERE u.id = @ID_Usuario;
        `;
      } else if (rol === "Empleador") {
        query = `
          SELECT 
            u.Nombre_usuario,
            u.Email,
            emp.Nombre_Empresa AS Empresa,
            emp.ID_Sector AS Rubro
          FROM dbo.usuarios u
          LEFT JOIN dbo.Empleador emp 
            ON u.id = emp.ID_Usuario
          WHERE u.id = @ID_Usuario;
        `;
      } else {
        return callback(new Error("Rol de usuario inválido"));
      }

      const result = await request.query(query);
      callback(null, result.recordset[0] || null);
    } catch (err) {
      callback(err);
    }
  },

  // Puntajes por usuario (mapea a su Aspirante)
  getPuntajes: async (ID_Usuario, callback) => {
    try {
      const pool = await getPool();
      const query = `
        SELECT 
          e.Fecha_Entrevista,
          e.Puntaje_Total
        FROM dbo.Aspirante a
        JOIN dbo.Entrevista e
          ON e.ID_Aspirante = a.ID_Empleado
        WHERE a.ID_Usuario = @ID_Usuario
        ORDER BY e.Fecha_Entrevista DESC, e.ID_Entrevista DESC;
      `;
      const result = await pool
        .request()
        .input("ID_Usuario", sql.Int, ID_Usuario)
        .query(query);

      callback(null, result.recordset);
    } catch (err) {
      callback(err);
    }
  },
};

module.exports = UserModel;
