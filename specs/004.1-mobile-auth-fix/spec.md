# Spec: Refactor de Autenticación Móvil (Global State)

## Problema
Al iniciar sesión en la aplicación móvil, el usuario era redirigido correctamente a la ruta raíz (`/`), pero el componente `RootLayout` en `app/_layout.tsx` no detectaba el cambio en el estado de autenticación. Esto provocaba que el `useEffect` de validación volviera a evaluar el estado como "no autenticado" (basándose en su estado local inicial o desactualizado) y redirigiera al usuario de vuelta a `/auth/login`, creando un bucle o impidiendo el acceso.

## Solución
Implementar un **AuthContext** global para centralizar el estado de autenticación y asegurar que cualquier cambio (login/logout) se propague de forma reactiva a través de toda la aplicación, especialmente al `RootLayout`.

## Requerimientos Técnicos
1. **Estado Centralizado**: Uso de React Context API para mantener `isAuthenticated`.
2. **Persistencia**: Sincronización automática con `expo-secure-store`.
3. **Reactividad**: El `RootLayout` debe reaccionar inmediatamente a los cambios en el contexto.
4. **Seguridad**: Encapsular la lógica de tokens dentro del proveedor de autenticación.

## Impacto en la Arquitectura
- Se añade un nuevo directorio `src/context`.
- Se elimina la dependencia directa de `Storage` para validación de rutas en `app/_layout.tsx`.
- Los componentes de Login y Dashboard ahora consumen el hook `useAuth`.
