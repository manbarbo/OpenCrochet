# OpenCrochet Onboarding Guide

Welcome to the OpenCrochet team! This guide will get you up and running in under 30 minutes.

## Prerequisites

You need the following tools installed on your machine:

- **Docker Desktop** (latest stable) — [Download](https://www.docker.com/products/docker-desktop)
- **Git** — [Download](https://git-scm.com/downloads)
- **pnpm** (optional for local development) — `npm install -g pnpm`

> **Note:** You do NOT need Node.js installed locally if you use Docker for everything. Docker handles Node.js 20 internally.

## Quick Start (Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/manbarbo/OpenCrochet.git
cd OpenCrochet
```

### 2. Start all services

```bash
pnpm dev
```

This command:
- Builds the frontend (`apps/web`)
- Starts the backend API (`apps/api` on port 3001)
- Starts Storybook (port 6006)
- Serves Swagger UI at `http://localhost:3001/api/docs`

### 3. Open the app

- **Web app**: http://localhost:5173
- **API docs**: http://localhost:3001/api/docs
- **Storybook**: http://localhost:6006

## Project Structure

```
OpenCrochet/
├── apps/
│   ├── web/          # React 19 + Vite frontend
│   └── api/          # Node.js 20 + Express backend
├── packages/
│   ├── shared-types/ # TypeScript interfaces
│   ├── image-processing/ # Filter algorithms
│   └── ui-components/ # Reusable MUI components
├── docs/             # Documentation
│   ├── adr/          # Architecture Decision Records
│   ├── api-spec.yaml # OpenAPI specification
│   ├── user-guide.md # User documentation
│   ├── architecture.md # System architecture
│   └── image-processing.md # Algorithm docs
├── terraform/        # AWS infrastructure
├── .opencode/        # OpenCode agents and skills
└── docker-compose.yml # Development orchestration
```

## Development Workflow

### Running tests

```bash
# All tests
pnpm test

# Frontend only
pnpm test:web

# Backend only
pnpm test:api

# With coverage
pnpm test:coverage
```

### Code style

```bash
# Lint all workspaces
pnpm lint

# Format all workspaces
pnpm format
```

### Adding a new dependency

```bash
# To a specific workspace
pnpm add <package> --filter <workspace>

# Example
pnpm add lodash --filter @opencrochet/web
```

## Key Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start all services (Docker) |
| `pnpm dev:web` | Frontend only (Vite dev server) |
| `pnpm dev:api` | Backend only (Node.js + nodemon) |
| `pnpm test` | Run all tests |
| `pnpm test:web` | Frontend tests (Jest + RTL) |
| `pnpm test:api` | Backend tests (Jest + Supertest) |
| `pnpm test:coverage` | Tests with coverage reports |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm format` | Format all workspaces |
| `pnpm storybook` | Start Storybook |
| `pnpm docker:up` | Start Docker containers |
| `pnpm terraform:plan` | Plan Terraform changes |
| `pnpm terraform:apply` | Apply Terraform changes |

## Conventions

### Commits

We use **Conventional Commits**:

```
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore, ci, infra
```

Examples:
- `feat(web): add drag-and-drop image upload`
- `fix(api): handle empty file upload`
- `docs(adr): add decision record for Docker`
- `test(image-processing): add threshold filter tests`

### TypeScript

- **Strict mode** is enabled everywhere. No `any` types.
- All components are **functional** (no class components).
- Use **MUI** for styling (`sx` prop, `styled()`, or theme).
- No CSS modules, SCSS, or styled-components.

### Testing

- **Coverage minimum**: 80% for all tasks, 90% for critical paths.
- **Frontend**: React Testing Library with Jest.
- **Backend**: Jest with Supertest.
- **Integration**: Mock external dependencies (Sharp, axios), don't test actual image processing.
- **Accessibility**: All components must pass `jest-axe`.

### Path Aliases

Configured in `tsconfig.app.json` and `vite.config.ts`:

```typescript
import MyComponent from '@components/MyComponent'
import { useMyStore } from '@stores/myStore'
```

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │──────│   Nginx     │──────│   Web App   │
│             │      │  (Docker)   │      │   (Vite)    │
└─────────────┘      └─────────────┘      └─────────────┘
                                                  │
                                                  │ fetch
                                                  ▼
                                         ┌─────────────┐
                                         │   API App   │
                                         │  (Express)  │
                                         └─────────────┘
                                                  │
                                                  │ process
                                                  ▼
                                         ┌─────────────┐
                                         │    Sharp    │
                                         │ (libvips)   │
                                         └─────────────┘
```

## Common Issues

### Docker not starting

```bash
# Check Docker is running
docker info

# Rebuild containers
pnpm docker:up --build
```

### Tests failing locally

```bash
# Make sure all dependencies are installed
pnpm install

# Run tests in specific workspace
pnpm test:web --filter @opencrochet/web
```

### Sharp compilation errors

Sharp requires native compilation. If you see errors:

```bash
# Rebuild Sharp
pnpm rebuild sharp

# Or use Docker (recommended)
pnpm dev:api
```

### Port conflicts

If ports 3001, 5173, or 6006 are already in use:

```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
lsof -ti:6006 | xargs kill -9
```

## Resources

- **Architecture**: `docs/architecture.md`
- **API Docs**: `docs/api-spec.yaml` (or `http://localhost:3001/api/docs`)
- **User Guide**: `docs/user-guide.md`
- **Image Processing**: `docs/image-processing.md`
- **ADRs**: `docs/adr/`
- **Backlog**: `backlog.md`
- **README**: `README.md`

## Getting Help

- Check the **Architecture Decision Records** (`docs/adr/`) for why things are built the way they are.
- Check **backlog.md** for current task status.
- Review existing tests for examples of how to write new ones.
- Use **Storybook** to explore components in isolation.

## Next Steps

1. Read the [Architecture documentation](docs/architecture.md)
2. Review the [User Guide](docs/user-guide.md) to understand the app
3. Explore [Storybook](http://localhost:6006) to see all components
4. Check the [API documentation](http://localhost:3001/api/docs) to understand endpoints
5. Pick a task from the [backlog](backlog.md) and start contributing!

---

**Happy coding!** 🧶

*Last Updated: 2026-06-11*
