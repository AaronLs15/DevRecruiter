# Proyecto Dev Recruiter

Este proyecto integra un frontend en React (creado con Vite y TailwindCSS) y un backend basado en Node.js con Express y SQLite. La aplicación simula una interfaz de chat (similar a ChatGPT) y cuenta con una API para almacenar preguntas preestablecidas y respuestas generadas por una IA, la cual se ejecutará localmente usando Ollama.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (incluye npm)
- [Ollama](https://ollama.ai) para ejecutar la IA localmente

## Estructura del Proyecto

- **Frontend:** Ubicado en la raíz del proyecto, contiene la aplicación React creada con Vite.
- **Backend:** Carpeta `server/` que incluye la API desarrollada con Express y la base de datos SQLite.

## Instalación

### 1. Clonar el Repositorio

### 2. Instalación de Dependencias del Frontend
Desde la raíz del proyecto, instala las dependencias del frontend:

```bash
npm install
```
Esto instalará todas las dependencias necesarias para la aplicación React (Vite, TailwindCSS, react-icons, etc.), según lo definido en el archivo package.json.

### 3. Instalación de Dependencias del Backend
Navega a la carpeta server:

```bash
cd server
```
Luego, instala las dependencias del backend:

```bash
npm install
```

### 4. Inicialización de la Base de Datos
Desde la carpeta server, ejecuta el siguiente script para crear la base de datos y la tabla necesaria:

```bash
node initDB.js
```

Este comando creará el archivo db.sqlite y la tabla qa para almacenar preguntas y respuestas.

### 5. Instalación de Ollama
Para ejecutar la inteligencia artificial localmente con Ollama:

-Visita la página oficial de [Ollama](https://ollama.com/).

-Descarga el instalador correspondiente a tu sistema operativo (por ejemplo, para Windows 11).

-Ejecuta el instalador y sigue las instrucciones para completar la instalación.

-Una vez instalado, inicia Ollama y verifica que esté corriendo antes de realizar peticiones a la API.


# Ejecución del Proyecto
Ejecutar el Backend
Desde la carpeta server, inicia el servidor con:

```bash
node server.js
```

Si deseas que el servidor se reinicie automáticamente al hacer cambios, puedes usar nodemon:

```bash
npm install -g nodemon   # Solo la primera vez, si no lo tienes instalado
nodemon server.js
```
El backend se ejecutará en el puerto 5000 por defecto y expondrá endpoints.


# Ejecutar el Frontend
Abre una nueva terminal, vuelve a la raíz del proyecto y ejecuta:
```bash
npm run dev
```

# Uso
Interfaz de Chat: La aplicación React simula un chat con un input de texto y muestra el historial de mensajes.

API: El backend permite almacenar y recuperar preguntas y respuestas mediante peticiones HTTP.

IA con Ollama: Con Ollama instalado y corriendo, la aplicación puede realizar peticiones a la API de Ollama para obtener respuestas generadas por la IA local.

# Tecnologías Utilizadas
## Frontend:
- React con Vite
- TailwindCSS
- React Icons

## Backend:

- Node.js con Express
- SQLite (usando el paquete sqlite3)
- CORS

## Inteligencia Artificial:

- Ollama para ejecutar la IA localmente

# Notas Adicionales
Asegúrate de tener corriendo tanto el backend como el frontend para que la aplicación funcione correctamente.

Verifica que Ollama esté activo en tu máquina antes de enviar peticiones que involucren la generación de respuestas de la IA.

Puedes personalizar la API, la interfaz del chat o la integración con Ollama según tus necesidades.

tet
