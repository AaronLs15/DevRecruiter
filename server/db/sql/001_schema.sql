-- Base de datos (opcional; si ya existe, ignora esta parte)
IF DB_ID(N'DevRecruiter') IS NULL
BEGIN
  CREATE DATABASE DevRecruiter;
END
GO

USE DevRecruiter;
GO

-- Helper: crea tabla si no existe
-- Aspirante
IF OBJECT_ID(N'dbo.Aspirante', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Aspirante
  (
    ID_Empleado      INT IDENTITY(1,1) PRIMARY KEY,
    ID_Usuario       INT NULL,
    ID_Estadistica   INT NULL,
    Experiencia      NVARCHAR(MAX) NULL,
    Puesto_Aspirado  NVARCHAR(255) NULL,
    Habilidades      NVARCHAR(MAX) NULL,
    Ubicacion        NVARCHAR(255) NULL
  );
END
GO

-- Empleador
IF OBJECT_ID(N'dbo.Empleador', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Empleador
  (
    ID_Empleador   INT IDENTITY(1,1) PRIMARY KEY,
    ID_Usuario     INT NULL,
    ID_Sector      INT NULL,
    Nombre_Empresa NVARCHAR(255) NOT NULL
  );
END
GO

-- Entrevista
IF OBJECT_ID(N'dbo.Entrevista', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Entrevista
  (
    ID_Entrevista     INT IDENTITY(1,1) PRIMARY KEY,
    ID_Aspirante      INT NULL,
    ID_Sector         INT NULL,
    Tipo_Entrevista   NVARCHAR(100) NULL,
    Puntaje_Total     INT NULL,
    Fecha_Entrevista  DATETIME2(0) NULL,
    Duracion          INT NULL,             -- minutos (ajusta si requieres otro formato)
    Estado            NVARCHAR(100) NULL,
    Feedback          NVARCHAR(MAX) NULL,
    Entrevista        NVARCHAR(MAX) NULL
  );
END
GO

-- Evaluacion
IF OBJECT_ID(N'dbo.Evaluacion', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Evaluacion
  (
    ID            INT IDENTITY(1,1) PRIMARY KEY,
    Preguntas     NVARCHAR(MAX) NULL,
    Respuestas    NVARCHAR(MAX) NULL,
    FaseNumero    INT NULL,
    Puntaje       INT NULL,
    ID_Entrevista INT NULL
  );
END
GO

-- Parametros
IF OBJECT_ID(N'dbo.Parametros', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Parametros
  (
    ID_Parametro         INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Parametro     NVARCHAR(255) NOT NULL,
    Descripcion_Parametro NVARCHAR(MAX) NULL,
    Valor_Parametro      NVARCHAR(MAX) NULL
  );
END
GO

-- Preguntas
IF OBJECT_ID(N'dbo.Preguntas', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Preguntas
  (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    pregunta    NVARCHAR(MAX) NOT NULL,
    respuesta   NVARCHAR(MAX) NULL,
    categoria   NVARCHAR(255) NULL,
    dificultad  NVARCHAR(100) NULL
  );
END
GO

-- Reporte
IF OBJECT_ID(N'dbo.Reporte', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Reporte
  (
    ID_Reporte       INT IDENTITY(1,1) PRIMARY KEY,
    ID_Evaluacion    INT NULL,
    Puntaje_Total    INT NULL,
    Texto_Reporte    NVARCHAR(MAX) NULL,
    Texto_AreaMejora NVARCHAR(MAX) NULL
  );
END
GO

-- Sector
IF OBJECT_ID(N'dbo.Sector', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Sector
  (
    ID_Sector        INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Sector    NVARCHAR(255) NOT NULL,
    Descripcion_Sector NVARCHAR(MAX) NULL
  );
END
GO

-- banco_preguntas
IF OBJECT_ID(N'dbo.banco_preguntas', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.banco_preguntas
  (
    ID         INT IDENTITY(1,1) PRIMARY KEY,
    ID_Sector  INT NULL,
    ID_Pregunta INT NULL
  );
END
GO

-- usuarios  (nota: columna [Contraseña] requiere delimitadores por 'ñ')
IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.usuarios
  (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_usuario  NVARCHAR(255) NOT NULL,
    Email           NVARCHAR(255) NOT NULL,
    [Contraseña]    NVARCHAR(255) NOT NULL,
    Rol             NVARCHAR(100) NULL
  );
END
GO

-- (Opcional) Índices básicos útiles
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_usuarios_Email' AND object_id = OBJECT_ID('dbo.usuarios'))
  CREATE UNIQUE INDEX IX_usuarios_Email ON dbo.usuarios(Email);
GO


/* 3) auth_session: crear si no existe y alinear UserID BIGINT */
IF OBJECT_ID('dbo.auth_session','U') IS NULL
BEGIN
  CREATE TABLE dbo.auth_session (
    SessionID      BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_auth_session PRIMARY KEY,
    UserID         INT NOT NULL,
    RefreshVersion INT NOT NULL CONSTRAINT DF_auth_session_RefreshVersion DEFAULT(1),
    UserAgent      NVARCHAR(255) NULL,
    IpAddress      NVARCHAR(45)  NULL,
    CreatedAt      DATETIME2(3)  NOT NULL CONSTRAINT DF_auth_session_CreatedAt DEFAULT(SYSDATETIME()),
    LastActivity   DATETIME2(3)  NOT NULL CONSTRAINT DF_auth_session_LastActivity DEFAULT(SYSDATETIME()),
    ExpiresAt      DATETIME2(3)  NOT NULL,
    RevokedAt      DATETIME2(3)  NULL,
    RevokedReason  NVARCHAR(100) NULL
  );
END
ELSE
BEGIN
  -- Alinear tipo a BIGINT si fuera necesario
  IF COL_LENGTH('dbo.auth_session','UserID') IS NOT NULL
  BEGIN
    -- soltar índice para poder alterar
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_auth_session_UserID' AND object_id=OBJECT_ID('dbo.auth_session'))
      DROP INDEX IX_auth_session_UserID ON dbo.auth_session;

    ALTER TABLE dbo.auth_session ALTER COLUMN UserID BIGINT NOT NULL;
  END;
END;

-- recrear índices de auth_session (si faltan)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_auth_session_UserID' AND object_id=OBJECT_ID('dbo.auth_session'))
  CREATE INDEX IX_auth_session_UserID ON dbo.auth_session(UserID);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_auth_session_Expires' AND object_id=OBJECT_ID('dbo.auth_session'))
  CREATE INDEX IX_auth_session_Expires ON dbo.auth_session(ExpiresAt);


IF OBJECT_ID('dbo.audit_auth_log','U') IS NULL
BEGIN
  CREATE TABLE dbo.audit_auth_log (
    AuditID    BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_audit_auth_log PRIMARY KEY,
    UserID     INT NOT NULL,
    SessionID  BIGINT NULL,
    Event      NVARCHAR(40) NOT NULL,
    Message    NVARCHAR(200) NULL,
    IpAddress  NVARCHAR(45)  NULL,
    UserAgent  NVARCHAR(255) NULL,
    CreatedAt  DATETIME2(3)  NOT NULL CONSTRAINT DF_audit_auth_log_CreatedAt DEFAULT(SYSDATETIME())
  );

  CREATE INDEX IX_audit_user_event ON dbo.audit_auth_log(UserID, Event);

  IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_audit_auth_log_Event')
    ALTER TABLE dbo.audit_auth_log
      ADD CONSTRAINT CK_audit_auth_log_Event
      CHECK (Event IN ('login','refresh','logout','logout_idle','logout_all','refresh_reuse_detected','login_failed'));
END
ELSE
BEGIN
  -- Alinear tipo a BIGINT si fuera necesario
  IF COL_LENGTH('dbo.audit_auth_log','UserID') IS NOT NULL
  BEGIN
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_audit_user_event' AND object_id=OBJECT_ID('dbo.audit_auth_log'))
      DROP INDEX IX_audit_user_event ON dbo.audit_auth_log;

    ALTER TABLE dbo.audit_auth_log ALTER COLUMN UserID BIGINT NOT NULL;

    CREATE INDEX IX_audit_user_event ON dbo.audit_auth_log(UserID, Event);
  END;

  -- Check constraint del evento (si falta)
  IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_audit_auth_log_Event')
    ALTER TABLE dbo.audit_auth_log
      ADD CONSTRAINT CK_audit_auth_log_Event
      CHECK (Event IN ('login','refresh','logout','logout_idle','logout_all','refresh_reuse_detected','login_failed'));
END;


IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_auth_session_user')
  ALTER TABLE dbo.auth_session
    ADD CONSTRAINT FK_auth_session_user
      FOREIGN KEY (UserID) REFERENCES dbo.usuarios(id) ON DELETE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_audit_user')
  ALTER TABLE dbo.audit_auth_log
    ADD CONSTRAINT FK_audit_user
      FOREIGN KEY (UserID) REFERENCES dbo.usuarios(id) ON DELETE CASCADE;

COMMIT TRAN;
