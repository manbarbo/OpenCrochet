# ADR 002: Use React 19 + Vite + MUI + TypeScript (Strict)

## Status

Accepted

## Context

For the web frontend, we needed a modern, fast, and type-safe stack. We evaluated:

1. **Create React App + JavaScript** — Stable but slow builds, no tree-shaking, and no type safety.
2. **Next.js + TypeScript** — Great for SSR/SEO but overkill for a client-side tool.
3. **React 19 + Vite + MUI + TypeScript (Strict)** — Fast HMR, modern React, strict types, and comprehensive UI library.

## Decision

We chose **React 19 + Vite + MUI + TypeScript (Strict)** because:

- **Vite**: Near-instant HMR, fast builds, and native ESM support.
- **React 19**: Latest features (Server Components, Actions, improved Suspense).
- **MUI**: Comprehensive component library with built-in accessibility and theming.
- **TypeScript Strict**: Catches bugs at compile time, improves IDE experience, and enforces clean code.

## Consequences

- All components must be functional (no class components).
- Styling is restricted to MUI (`sx`, `styled()`, or theme); no CSS modules or SCSS.
- Path aliases require configuration in `tsconfig.app.json` and `vite.config.ts`.
- Strict mode means some JavaScript patterns are disallowed (e.g., implicit any, null checks).

## References

- [Vite documentation](https://vitejs.dev/)
- [MUI documentation](https://mui.com/)
- [React 19 blog post](https://react.dev/blog/2024/12/05/react-19)
