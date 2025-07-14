# 🚀 Estimador QA - Plataforma de Estimación para Scripts Automatizados

Una aplicación web moderna para calcular el esfuerzo necesario en el desarrollo de scripts automatizados de pruebas QA.

## ✨ Características Principales

- **📊 Estimación Inteligente**: Cálculo automático basado en complejidad (Baja, Media, Alta)
- **⏱️ Desglose Detallado**: Distribución de tiempo por actividad:
  - Tiempo de Diseño
  - Tiempo de Desarrollo
  - Tiempo de Refactorización
  - Tiempo de Mantenimiento
  - Tiempo de Documentación
- **🎨 Interfaz Moderna**: Diseñada con Material-UI y tema Santander
- **📱 Responsive**: Optimizada para desktop y móviles
- **💾 Historial**: Guardado de estimaciones anteriores
- **📈 Estadísticas**: Análisis de estimaciones realizadas
- **📤 Exportación**: A Excel, PDF y Word (próximamente)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Charts**: MUI X Charts
- **Styling**: CSS3 + Emotion
- **Icons**: Material Icons

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Scripts Disponibles
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint

## 🎯 Cómo Usar la Aplicación

1. **Completa los datos básicos**:
   - Nombre del caso de prueba
   - Tipo de complejidad
   - Prioridad
   - Descripción

2. **Configura la estimación**:
   - Activa/desactiva el cálculo automático
   - Ajusta manualmente los tiempos si es necesario
   - Usa los sliders para una experiencia visual

3. **Revisa el resumen**:
   - Tiempo total estimado
   - Desglose por actividad
   - Estadísticas del historial

4. **Guarda y exporta**:
   - Guarda la estimación en el historial
   - Exporta a Excel para reportes

## 🎨 Características de Diseño

### Paleta de Colores (Santander)
- **Primario**: #EC0000 (Rojo Santander)
- **Secundario**: #FFFFFF (Blanco)
- **Acentos**: #FF4444, #B30000
- **Grises**: #333333, #666666, #F5F5F5

### Componentes Interactivos
- Sliders visuales para ajuste de tiempos
- Cards interactivas con hover effects
- Animaciones suaves y transiciones
- Iconografía consistente

## 📊 Configuración de Complejidad

### Tiempos Base por Complejidad:

**Baja Complejidad (2-9 horas)**
- Diseño: 2h | Desarrollo: 4h | Refactorización: 1h | Mantenimiento: 1h | Documentación: 1h

**Media Complejidad (10-20 horas)**
- Diseño: 4h | Desarrollo: 8h | Refactorización: 2h | Mantenimiento: 2h | Documentación: 2h

**Alta Complejidad (21+ horas)**
- Diseño: 8h | Desarrollo: 16h | Refactorización: 4h | Mantenimiento: 4h | Documentación: 3h

---

**© 2025 Santander - Plataforma de Estimación QA**

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
