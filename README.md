# Aplicación de Patrones Espirituales

Esta aplicación web permite gestionar y organizar patrones espirituales relacionados con el proceso de ascensión espiritual.

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

- **frontend**: Contiene la aplicación React
- **backend**: Contiene el servidor Express y la API

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)

## Configuración

1. **Variables de entorno**:
   - Crea un archivo `.env` en la carpeta raíz del proyecto con el siguiente contenido:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/patrones_db?retryWrites=true&w=majority
   JWT_SECRET=tu_secreto_jwt_seguro
   NODE_ENV=production
   ```
   - Reemplaza los valores de MongoDB URI con tu propia conexión

2. **Instalar dependencias**:
   ```bash
   # Instalar dependencias del backend
   cd backend
   npm install

   # Instalar dependencias del frontend
   cd ../frontend
   npm install
   ```

## Ejecución en desarrollo

1. **Iniciar el servidor backend**:
   ```bash
   cd backend
   npm run server
   ```

2. **Iniciar el cliente frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Ejecutar ambos simultáneamente**:
   ```bash
   # Desde la carpeta raíz
   npm run dev
   ```

## Construcción para producción

1. **Construir el frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Iniciar en modo producción**:
   ```bash
   # Desde la carpeta raíz
   npm start
   ```

## Despliegue

### Configuración de MongoDB Atlas

1. **Crear una cuenta en MongoDB Atlas**:
   - Ve a https://www.mongodb.com/cloud/atlas/register
   - Regístrate con tu correo electrónico

2. **Crear un cluster gratuito**:
   - Selecciona el plan "Shared" (gratuito)
   - Elige un proveedor de nube (AWS, Google Cloud o Azure)
   - Selecciona una región cercana a tus usuarios
   - Haz clic en "Create Cluster"

3. **Configurar acceso a la base de datos**:
   - En "Security" → "Database Access", crea un usuario con contraseña
   - En "Security" → "Network Access", añade tu IP o permite acceso desde cualquier lugar (0.0.0.0/0)

4. **Obtener la URL de conexión**:
   - Ve a "Databases" → "Connect" → "Connect your application"
   - Copia la URL de conexión (se verá algo así: `mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/patrones_db?retryWrites=true&w=majority`)
   - Reemplaza `<password>` con la contraseña que creaste

### Opciones de despliegue

#### Opción 1: Vercel (Frontend) + Render (Backend)

1. **Desplegar el frontend en Vercel**:
   - Crea una cuenta en Vercel
   - Conecta tu repositorio de GitHub
   - Configura el directorio raíz como `frontend`
   - Configura el comando de construcción como `npm run build`
   - Configura el directorio de salida como `build`

2. **Desplegar el backend en Render**:
   - Crea una cuenta en Render
   - Crea un nuevo Web Service
   - Conecta tu repositorio de GitHub
   - Configura el directorio raíz como `backend`
   - Configura el comando de inicio como `node server.js`
   - Añade las variables de entorno (MONGODB_URI, JWT_SECRET)

#### Opción 2: Netlify (Frontend) + Render (Backend)

1. **Desplegar el frontend en Netlify**:
   - Crea una cuenta en Netlify
   - Conecta tu repositorio de GitHub
   - Configura el directorio raíz como `frontend`
   - Configura el comando de construcción como `npm run build`
   - Configura el directorio de salida como `build`

2. **Desplegar el backend en Render** (igual que en la Opción 1)

## Funcionalidades

- **Autenticación**: Registro, inicio de sesión y gestión de usuarios
- **Gestión de patrones**: Crear, leer, actualizar y eliminar patrones
- **Categorización**: Organizar patrones por categorías
- **Seguimiento de progreso**: Marcar patrones como completados
- **Exportación**: Exportar patrones en formatos JSON y CSV
- **Modo offline**: Acceder a los patrones sin conexión
- **Historial de actividad**: Seguimiento de acciones del usuario

## Mejoras implementadas

1. **Estructura del Proyecto**:
   - Reorganizada en carpetas frontend y backend
   - Frontend con subcarpetas src, components, context y public
   - Backend con subcarpetas routes y models

2. **Base de Datos**:
   - Implementada la conexión a MongoDB
   - Configuradas variables de entorno
   - Modelos de datos refactorizados

3. **Sistema de Autenticación**:
   - Implementado sistema con JWT
   - Secreto JWT almacenado en variables de entorno
   - Rutas de autenticación refactorizadas

4. **Mejoras Adicionales**:
   - Proceso de construcción para el frontend
   - Gestión de estado usando Context API
   - Optimización del rendimiento
   - Funcionalidades adicionales (exportación, modo offline, historial)
