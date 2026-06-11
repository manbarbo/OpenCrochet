---
name: react-setup
description: Initialize React 19 frontend with Vite, TypeScript, MUI, Jest, Storybook. Use when setting up the web application or creating a new React project.
---

# React Setup Skill

Use this skill when initializing or setting up the React frontend application for OpenCrochet.

## Trigger
- Initial project setup
- New React app creation
- Frontend rebuild or major reconfiguration

## Actions

### 1. Initialize Project
```bash
# Use Vite with React + TypeScript template
cd apps/web
pnpm create vite@latest . --template react-ts
```

### 2. Install Dependencies
```bash
# Core
pnpm add react@latest react-dom@latest

# MUI
pnpm add @mui/material@latest @emotion/react @emotion/styled
pnpm add @mui/icons-material @mui/lab

# Routing & State
pnpm add react-router-dom@latest zustand @tanstack/react-query axios

# Forms & Validation
pnpm add react-hook-form zod @hookform/resolvers

# Dev Dependencies
pnpm add -D @types/react @types/react-dom
pnpm add -D vite @vitejs/plugin-react
pnpm add -D typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
pnpm add -D prettier eslint-config-prettier
pnpm add -D jest @jest/globals jest-environment-jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @storybook/react @storybook/react-vite @storybook/addon-essentials
pnpm add -D @storybook/addon-interactions @storybook/test
pnpm add -D husky lint-staged
```

### 3. Configure TypeScript
Create `tsconfig.json` with strict mode:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Configure Vite
Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### 5. Configure MUI Theme
Create `src/styles/theme.ts`:
```typescript
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
})
```

### 6. Configure Jest
Create `jest.config.js`:
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
}
```

### 7. Configure ESLint + Prettier
Create `.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 8. Configure Husky + lint-staged
```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### 9. Create Folder Structure
```
apps/web/src/
├── components/          # Atomic design components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/               # Route-level pages
├── hooks/               # Custom React hooks
├── stores/              # Zustand stores
├── services/            # API calls
├── utils/               # Helper functions
├── types/               # TypeScript types
├── styles/              # Global styles, MUI theme
├── App.tsx
├── main.tsx
└── setupTests.ts
```

### 10. Configure Storybook
```bash
npx storybook@latest init
```

Configure `.storybook/preview.ts`:
```typescript
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../src/styles/theme'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
```

## Requirements
- MUST use pnpm for all package operations
- MUST configure TypeScript strict mode
- MUST set up absolute imports (path aliases)
- MUST configure test environment with jsdom
- MUST set coverage threshold to 80%
- MUST configure Storybook with MUI theme provider
- MUST set up ESLint + Prettier + Husky + lint-staged

## Verification
Run these commands to verify setup:
```bash
pnpm lint          # ESLint check
pnpm test          # Jest tests
pnpm storybook     # Storybook starts
pnpm build         # Vite build succeeds
```
