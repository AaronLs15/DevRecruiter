IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DevRecruiter')
BEGIN
    CREATE DATABASE [DevRecruiter]
END
GO
USE [DevRecruiter]
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aspirante')
BEGIN
CREATE TABLE [dbo].[Aspirante](
    [ID_Empleado] int IDENTITY(1,1) NOT NULL,
    [ID_Usuario] int NULL,
    [ID_Estadistica] int NULL,
    [Experiencia] nvarchar(MAX) NULL,
    [Puesto_Aspirado] nvarchar(255) NULL,
    [Habilidades] nvarchar(MAX) NULL,
    [Ubicacion] nvarchar(255) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_auth_log')
BEGIN
CREATE TABLE [dbo].[audit_auth_log](
    [AuditID] bigint IDENTITY(1,1) NOT NULL,
    [UserID] int NOT NULL,
    [SessionID] bigint NULL,
    [Event] nvarchar(40) NOT NULL,
    [Message] nvarchar(200) NULL,
    [IpAddress] nvarchar(45) NULL,
    [UserAgent] nvarchar(255) NULL,
    [CreatedAt] datetime2(3) NOT NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'auth_session')
BEGIN
CREATE TABLE [dbo].[auth_session](
    [SessionID] bigint IDENTITY(1,1) NOT NULL,
    [UserID] int NOT NULL,
    [RefreshVersion] int NOT NULL,
    [UserAgent] nvarchar(255) NULL,
    [IpAddress] nvarchar(45) NULL,
    [CreatedAt] datetime2(3) NOT NULL,
    [LastActivity] datetime2(3) NOT NULL,
    [ExpiresAt] datetime2(3) NOT NULL,
    [RevokedAt] datetime2(3) NULL,
    [RevokedReason] nvarchar(100) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'banco_preguntas')
BEGIN
CREATE TABLE [dbo].[banco_preguntas](
    [ID] int IDENTITY(1,1) NOT NULL,
    [ID_Sector] int NULL,
    [ID_Pregunta] int NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Empleador')
BEGIN
CREATE TABLE [dbo].[Empleador](
    [ID_Empleador] int IDENTITY(1,1) NOT NULL,
    [ID_Usuario] int NULL,
    [ID_Sector] int NULL,
    [Nombre_Empresa] nvarchar(255) NOT NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Entrevista')
BEGIN
CREATE TABLE [dbo].[Entrevista](
    [ID_Entrevista] int IDENTITY(1,1) NOT NULL,
    [ID_Aspirante] int NULL,
    [ID_Sector] int NULL,
    [Tipo_Entrevista] nvarchar(100) NULL,
    [Puntaje_Total] int NULL,
    [Fecha_Entrevista] datetime2(0) NULL,
    [Duracion] int NULL,
    [Estado] nvarchar(100) NULL,
    [Feedback] nvarchar(MAX) NULL,
    [Entrevista] nvarchar(MAX) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Evaluacion')
BEGIN
CREATE TABLE [dbo].[Evaluacion](
    [ID] int IDENTITY(1,1) NOT NULL,
    [Preguntas] nvarchar(MAX) NULL,
    [Respuestas] nvarchar(MAX) NULL,
    [FaseNumero] int NULL,
    [Puntaje] int NULL,
    [ID_Entrevista] int NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Parametros')
BEGIN
CREATE TABLE [dbo].[Parametros](
    [ID_Parametro] int IDENTITY(1,1) NOT NULL,
    [Nombre_Parametro] nvarchar(255) NOT NULL,
    [Descripcion_Parametro] nvarchar(MAX) NULL,
    [Valor_Parametro] nvarchar(MAX) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Preguntas')
BEGIN
CREATE TABLE [dbo].[Preguntas](
    [id] int IDENTITY(1,1) NOT NULL,
    [pregunta] nvarchar(MAX) NOT NULL,
    [respuesta] nvarchar(MAX) NULL,
    [categoria] nvarchar(255) NULL,
    [dificultad] nvarchar(100) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reporte')
BEGIN
CREATE TABLE [dbo].[Reporte](
    [ID_Reporte] int IDENTITY(1,1) NOT NULL,
    [ID_Evaluacion] int NULL,
    [Puntaje_Total] int NULL,
    [Texto_Reporte] nvarchar(MAX) NULL,
    [Texto_AreaMejora] nvarchar(MAX) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sector')
BEGIN
CREATE TABLE [dbo].[Sector](
    [ID_Sector] int IDENTITY(1,1) NOT NULL,
    [Nombre_Sector] nvarchar(255) NOT NULL,
    [Descripcion_Sector] nvarchar(MAX) NULL
);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'usuarios')
BEGIN
CREATE TABLE [dbo].[usuarios](
    [id] int IDENTITY(1,1) NOT NULL,
    [Nombre_usuario] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Contraseña] nvarchar(255) NOT NULL,
    [Rol] nvarchar(100) NULL,
    [fecha_registro] date NULL
);
END
GO
