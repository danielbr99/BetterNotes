# Plan de Implementación: Fix Bucle de Login (AuthContext)

**Fecha**: 2026-05-07 | **Spec**: [spec.md](spec.md)

## Resumen Técnico
Se migró la lógica de validación de autenticación de un estado local en `RootLayout` a un `AuthContext` global. Esto resuelve la falta de reactividad cuando se llama a `Storage.saveToken()` desde componentes hijos.

## Cambios Realizados

### 1. Nuevo Contexto de Autenticación (`mobile/src/context/AuthContext.tsx`)
- Implementación de `AuthProvider` que maneja el estado `isAuthenticated`.
- Exportación del hook `useAuth` para un acceso simplificado.
- Métodos `login(token)` y `logout()` que gestionan tanto el almacenamiento persistente como el estado reactivo.

### 2. Refactor del Layout Raíz (`mobile/app/_layout.tsx`)
- El componente `RootLayout` ahora envuelve la aplicación en el `AuthProvider`.
- Se extrajo la lógica de navegación a un subcomponente `RootLayoutNav`.
- `RootLayoutNav` observa `isAuthenticated` del contexto para decidir las redirecciones automáticas.

### 3. Actualización de Pantallas
- **Login (`app/auth/login.tsx`)**: Reemplaza llamadas directas a `Storage.saveToken` por `login(token)` del contexto.
- **Dashboard (`app/index.tsx`)**: Reemplaza llamadas directas a `Storage.deleteToken` por `logout()` del contexto.

## Verificación
- [x] El usuario puede iniciar sesión y es redirigido a `/` sin regresar al login.
- [x] El cierre de sesión limpia el estado y redirige a `/auth/login`.
- [x] La persistencia funciona (al recargar la app, si hay token, entra directamente al dashboard).
- [x] Se mantiene la carga dinámica de la URL del servidor desde los ajustes.
