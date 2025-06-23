# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# Ecommerce - (Versión Administrador)

Proyecto de ecommerce desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Objetivo

Permitir la gestión y compra de componentes electrónicos para proyectos de robótica y makers, una plataforma web con funcionalidades tanto para administradores de negocio como para clientes.

---

## ⚙️ Tecnologías principales

- React + TypeScript
- Tailwind CSS
- Vite
- Supabase (Base de datos y autenticación)
- GitHub Actions (CI/CD)
- Vercel (Frontend deployment)

---

## ✅ Requisitos Funcionales

| ID  | Descripción                                            |
| --- | ------------------------------------------------------ |
| RF1 | Registro y autenticación del rol negocio               |
| RF2 | CRUD de productos y visualización de reportes          |
| RF3 | Registro y login de clientes                           |
| RF4 | Visualización de productos por parte del cliente       |
| RF5 | Carrito, simulación de compra e historial con filtros  |
| RF6 | Vista responsive (adaptable a diferentes dispositivos) |

---

## 📦 Estructura del Proyecto

ecommerce-admin/
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── hooks/
│ └── utils/
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── README.md
