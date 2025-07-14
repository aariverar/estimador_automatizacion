# Copilot Instructions para Plataforma de Estimación QA

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto del Proyecto
Esta es una plataforma web para estimación de esfuerzo en desarrollo de scripts automatizados QA. El proyecto utiliza:

- **Framework**: React + TypeScript + Vite
- **UI Library**: Material-UI (MUI)
- **Tema**: Basado en Santander con color principal #EC0000
- **Propósito**: Calculadora de estimación para casos de prueba automatizados

## Estilo y Convenciones
- Usar el tema de Santander con color principal `#EC0000`
- Seguir las convenciones de Material-UI
- Componentes funcionales con hooks de React
- TypeScript estricto con interfaces bien definidas
- Nombres de archivos en camelCase
- Comentarios en español para funciones principales

## Características Principales
- Formulario de estimación con variables: Diseño, Desarrollo, Refactorización, Mantenimiento, Documentación
- Calculadora automática basada en complejidad
- Visualización en tiempo real de estimaciones
- Exportación a Excel/PDF/Word
- Interfaz responsiva y amigable

## Patrones de Código
- Usar useState y useEffect para manejo de estado
- Implementar validaciones de formulario
- Mantener componentes reutilizables
- Separar lógica de negocio de presentación
