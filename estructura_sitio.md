# Estructura del Sitio Web de Patrones Espirituales

## Descripción General
Este sitio web está diseñado para gestionar y organizar los patrones espirituales relacionados con el proceso de ascensión espiritual, específicamente para usuarios que han completado la 6ª iniciación y están avanzando hacia la 7ª iniciación. El sitio permitirá al usuario listar todos los patrones existentes del documento proporcionado, así como añadir nuevos patrones personalizados.

## Diseño Visual
- **Tema**: Oscuro y moderno
- **Colores principales**: 
  - Negro (#121212) - Fondo principal
  - Gris oscuro (#1E1E1E) - Elementos secundarios
  - Gris medio (#333333) - Elementos de interfaz
  - Morado oscuro (#4A148C) - Acentos primarios
  - Lila (#9C27B0) - Acentos secundarios
  - Degradados en lila claro (#CE93D8) - Detalles y efectos

## Estructura de Páginas

### 1. Página de Inicio (No autenticado)
- Pantalla de login/registro
- Breve descripción del propósito del sitio
- Diseño minimalista con elementos visuales relacionados con la ascensión espiritual

### 2. Página de Inicio (Autenticado)
- Panel de control principal
- Estadísticas de patrones (total, añadidos personalmente, etc.)
- Acceso rápido a categorías principales
- Botón destacado para añadir nuevos patrones

### 3. Página de Instrucciones
- Explicación detallada sobre el proceso de borrado de patrones
- Guía paso a paso sobre cómo utilizar el sitio
- Información contextual sobre la relación entre los patrones y la ascensión espiritual

### 4. Listado de Patrones
- Vista de todos los patrones organizados por categorías
- Buscador con filtros avanzados
- Opciones para ordenar (alfabético, por categoría, por fecha de adición)
- Indicador visual para diferenciar patrones originales y personalizados

### 5. Página de Detalle de Patrón
- Nombre del patrón
- Descripción completa
- Categoría/s
- Opciones para editar (solo patrones personalizados)
- Opción para marcar como "trabajado" o "completado"

### 6. Página de Añadir/Editar Patrón
- Formulario para añadir nuevos patrones
- Campos: nombre, descripción, categoría, notas personales
- Vista previa antes de guardar

### 7. Perfil de Usuario
- Información básica del usuario
- Estadísticas de progreso
- Preferencias de visualización
- Opción para cambiar contraseña

## Funcionalidades Principales

### Sistema de Autenticación
- Registro de usuario (email y contraseña)
- Inicio de sesión
- Recuperación de contraseña
- Protección de rutas para usuarios no autenticados

### Gestión de Patrones
- Visualización de todos los patrones originales (558 extraídos del documento)
- Adición de nuevos patrones personalizados
- Edición de patrones personalizados
- Categorización de patrones
- Búsqueda y filtrado avanzado

### Seguimiento de Progreso
- Marcado de patrones como "trabajados" o "completados"
- Estadísticas de progreso
- Historial de actividad

## Tecnologías a Utilizar

### Frontend
- HTML5, CSS3, JavaScript
- Framework: React.js
- Biblioteca de componentes: Material-UI (adaptada para el diseño oscuro)
- Gestión de estado: Context API o Redux

### Backend
- Node.js con Express
- Base de datos: MongoDB (para flexibilidad en el esquema de patrones)
- Autenticación: JWT (JSON Web Tokens)

### Despliegue
- Frontend: Vercel o Netlify
- Backend: Heroku o similar
- Base de datos: MongoDB Atlas

## Consideraciones Adicionales
- Diseño responsive para adaptarse a diferentes dispositivos
- Animaciones sutiles para mejorar la experiencia de usuario
- Modo offline para acceder a los patrones sin conexión
- Exportación de patrones personalizados
- Posibilidad de compartir patrones específicos (opcional, según requisitos de privacidad)
