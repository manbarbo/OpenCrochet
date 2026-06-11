# ADR 001: Use pnpm Workspace Monorepo

## Status

Accepted

## Context

We needed to organize a project with two applications (web frontend and API backend) and shared packages (types, image processing utilities, UI components). We evaluated three options:

1. **Multiple separate repositories** — Simple but creates versioning and integration overhead.
2. **npm workspaces** — Native to npm but slower and less disk-efficient.
3. **pnpm workspaces** — Fast, disk-efficient via hard links, and strict dependency management.

## Decision

We chose **pnpm workspaces** because:

- **Speed**: pnpm is significantly faster than npm/yarn for install and update operations.
- **Disk efficiency**: Uses content-addressable storage and hard links, saving disk space.
- **Strict dependencies**: Prevents phantom dependencies by only allowing explicitly declared packages.
- **Compatibility**: Works well with existing npm packages and registries.
- **Built-in filtering**: `pnpm --filter` makes it easy to run commands in specific workspaces.

## Consequences

- Team must install pnpm globally (`npm install -g pnpm`).
- CI/CD pipelines use `pnpm install` instead of `npm install`.
- All `package.json` files must declare the correct workspace dependencies.
- We enforce `pnpm@11.5.3` via `