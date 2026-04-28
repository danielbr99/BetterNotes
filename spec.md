# Especificación: Sistema de Notas Pro

## Objetivo

Desarrollar un sistema de gestión de notas personales utilizando un enfoque SDD para garantizar la integridad de los datos y la documentación automática.

## Requisitos del Sistema

- **Creación de Notas:** El usuario podrá crear notas con título y contenido.
- **Identificación:** Cada nota tendrá un ID único generado por el sistema.
- **Validación:** No se permitirán notas sin título.

## Definición Técnica

La API sigue el estándar OpenAPI 3.1. El contrato se encuentra en `./openapi.yaml`.

## Flujo de Trabajo (SDD)

1. Diseño del contrato (YAML).
2. Validación con Spectral.
3. Mocking con Prism.
4. Generación de código con Spec Kit (uv tool run specify).
