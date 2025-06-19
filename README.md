# LINQ - Sistema de Autenticación con Login y Dashboard

Sistema completo de autenticación usando localStorage con páginas protegidas.

## 🎯 Funcionalidades Implementadas

### 🔐 **Sistema de Autenticación**
- **Login funcional** con validación de credenciales
- **Persistencia** usando localStorage
- **Logout** con limpieza de sesión
- **Protección de rutas** automática

### 📊 **Páginas Principales**

#### Login Page (`/`)
- **Ruta**: `/` (pública)
- **Descripción**: Formulario de login con validación
- **Credenciales de prueba**: `admin@test.com` / `password`
- **Componente**: `LoginPage` en `apps/web/src/routes/index.tsx`
- **Funcionalidad**: 
  - Redirección automática al dashboard si ya está autenticado
  - Formulario con validación y manejo de errores
  - Estados de carga durante autenticación

#### Dashboard (`/dashboard`)
- **Ruta**: `/dashboard` (protegida)
- **Descripción**: Panel principal para usuarios autenticados
- **Componente**: `DashboardPage` en `apps/web/src/routes/dashboard.tsx`
- **Funcionalidad**:
  - Acceso solo para usuarios autenticados
  - Información del usuario logueado
  - Botón de logout
  - Redirección automática al login si no autenticado

## 🔒 **Sistema de Protección de Rutas**

### Rutas Públicas
- `/` - Login (accesible sin autenticación)

### Rutas Protegidas
- `/dashboard` - Dashboard (requiere autenticación)

### Componentes de Seguridad
- **AuthProvider**: Contexto global de autenticación
- **ProtectedRoute**: Componente wrapper para rutas que requieren autenticación
- **useAuth**: Hook para acceder al estado de autenticación

## 🏗️ **Estructura del Proyecto**

```
apps/web/src/
├── auth.tsx                    # Contexto de autenticación
├── components/
│   └── ProtectedRoute.tsx      # Componente de protección de rutas
├── routes/
│   ├── __root.tsx             # Componente raíz limpio
│   ├── index.tsx              # Página de login con formulario
│   └── dashboard.tsx          # Dashboard protegido
├── main.tsx                   # Setup con AuthProvider
└── index.css                  # Estilos Tailwind
```

## 🚀 **Cómo Usar**

### 1. **Desarrollo**
```bash
cd apps/web
npm run dev
```

### 2. **Login**
- Navega a `http://localhost:5173`
- Usa las credenciales: `admin@test.com` / `password`
- Serás redirigido automáticamente al dashboard

### 3. **Dashboard**
- Acceso directo a `/dashboard` te redirigirá al login si no estás autenticado
- Una vez logueado, verás tu información de usuario
- Usa el botón "Logout" para cerrar sesión

## ⚡ **Características Técnicas**

### Autenticación
- **Persistencia**: localStorage mantiene la sesión entre refreshes
- **Estados de carga**: Indicadores visuales durante autenticación
- **Manejo de errores**: Mensajes informativos para credenciales incorrectas
- **Redirecciones automáticas**: Navegación inteligente basada en estado de auth

### Seguridad
- **Protección de rutas**: Verificación automática en rutas protegidas
- **Limpieza de sesión**: Logout completo con redirección
- **Validación de estado**: Verificación continua del estado de autenticación

## 🛠️ **Tecnologías**

- **React 19.1.0 + TypeScript**
- **TanStack Router** para enrutamiento
- **Tailwind CSS** para estilos
- **localStorage** para persistencia
- **Vite** como bundler
