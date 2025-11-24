# DevRecruiter

DevRecruiter es una plataforma para conectar desarrolladores con reclutadores, facilitando el proceso de entrevistas y evaluaciones técnicas.

## 🚀 Características

- **Autenticación Segura**: Sistema de login con JWT (Access & Refresh Tokens) y validación de sesiones.
- **Roles de Usuario**: Soporte para Aspirantes y Empleadores.
- **Entrevistas AI**: Integración con Ollama para generar preguntas y evaluar respuestas.
- **Dashboard**: Visualización de estadísticas y progreso.

## 🛠️ Tecnologías

- **Frontend**: React, Vite, TailwindCSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: SQL Server.
- **AI**: Ollama (DeepSeek-R1).
- **Infraestructura**: Docker, Docker Compose.

## 📋 Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose.
- [Ollama](https://ollama.com/) ejecutándose localmente (para funcionalidades de AI).
  - Modelo recomendado: `deepseek-r1`.
  - Asegúrate de que Ollama acepte conexiones externas o esté configurado correctamente.

## 🐳 Ejecución con Docker (Recomendado)

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repo>
   cd DevRecruiter
   ```

2. **Iniciar la aplicación**:
   ```bash
   docker-compose up --build
   ```

3. **Acceder**:
   - Frontend: [http://localhost](http://localhost)
   - Backend: [http://localhost:3001](http://localhost:3001)

## 💻 Ejecución Local (Desarrollo)

### Base de Datos
Necesitas una instancia de SQL Server. Puedes usar la imagen de Docker:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

### Backend
1. Navega a `server/`:
   ```bash
   cd server
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` (puedes copiar el ejemplo o usar los valores por defecto).
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

### Frontend
1. Navega a la raíz (donde está `vite.config.js`):
   ```bash
   cd ..
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🤖 Configuración de AI (Ollama)

El proyecto espera que Ollama esté corriendo en `http://localhost:11434`.
Puedes configurar la URL y el modelo en las variables de entorno del backend:
- `OLLAMA_API_URL`
- `OLLAMA_MODEL`

## 📂 Estructura del Proyecto

- `/server`: Código del Backend (Node.js + Express).
  - `/src`: Código fuente (Controladores, Modelos, Rutas).
- `/src`: Código del Frontend (React).
- `docker-compose.yml`: Orquestación de contenedores.
