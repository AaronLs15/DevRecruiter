import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Configuración general para todos los archivos JavaScript (Node y frontend)
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      // En un backend puedes usar las variables globales de Node
      globals: globals.node,
    },
    plugins: {
      // Usamos el plugin de ESLint para JavaScript y Prettier para el formateo
      js,
      prettier: pluginPrettier,
    },
    // Extiende las reglas recomendadas de ESLint, y las de Prettier para evitar conflictos
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
      'js/recommended',
    ],
    rules: {
      // Ajustamos algunas reglas para que no marquen errores críticos en backend
      'no-unused-vars': 'warn', // solo como advertencia
      'no-console': 'off',      // permitimos el uso de console.log u otras funciones de consola
      // Puedes agregar o modificar reglas según tus preferencias
    },
  },
  // Configuración adicional para archivos React, si aplicara en alguna parte del proyecto
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
    },
    extends: [pluginReact.configs.flat.recommended],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
