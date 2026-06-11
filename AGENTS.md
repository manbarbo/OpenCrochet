# OpenCrochet Agent Guide

> Compact repo orientation for OpenCode sessions. Long-form docs live elsewhere; this file only captures what an agent is likely to miss.

## Current State (Critical)

**This repository is an empty project shell.** No code exists yet. The only files are:
- `.opencode/` — OpenCode agents and skills
- `README.md` — Human-readable overview
- `backlog.md` — Task tracker (all 30+ tasks are `pending`)
- `AGENTS.md` — This file

Everything else must be created from scratch.

## Architecture

pnpm workspace monorepo with two apps and three shared packages:

```
OpenCrochet/
├── apps/
│   ├── web/          # React 19 + Vite + MUI + TypeScript (strict)
│   └── api/          # Node.js 20 + Express + Sharp + TypeScript (strict)
├── packages/
│   ├── shared-types/
│   ├── image-processing/
│   └── ui-components/
├── terraform/        # AWS infra (S3, EC2, CloudFront)
├── docker-compose.yml
├── package.json      # Root: shared dev deps, workspace scripts
└── pnpm-workspace.yaml
```

## Agent Delegation

Agents are defined in `.opencode/agents/` and configured in `.opencode/opencode.json`. Use the `task` tool to delegate work to the correct agent:

- **`frontend-dev`** — React components, hooks, MUI, Canvas API, Storybook
- **`backend-dev`** — Express endpoints, Sharp, Multer, Swagger, exports
- **`image-processing`** — Filter algorithms (Threshold, Halftone, Posterize, Pixelate), grid generation
- **`devops`** — Docker, Terraform, CI/CD, Nginx
- **`testing`** — Jest, coverage enforcement, accessibility, E2E
- **`docs`** — README, API docs, Storybook stories, user guides
- **`ui-ux`** — MUI theme, responsive design, accessibility specs

## Implementation Order

The correct bootstrap order matters. Use the skills in `.opencode/skills/` for step-by-step instructions:

1. `pnpm-workspace` — Create root `package.json`, `pnpm-workspace.yaml`, shared deps
2. `react-setup` — Initialize `apps/web/` with Vite, MUI, Jest, Storybook
3. `node-setup` — Initialize `apps/api/` with Express, Sharp, Jest, Swagger
4. `docker-setup` — Create Dockerfiles, docker-compose.yml, nginx.conf
5. `terraform-setup` — Create AWS infra modules (S3, EC2, CloudFront)
6. `ci-cd-setup` — Create GitHub Actions workflows
7. `git-setup` — Create .gitignore, PR templates, issue templates

Then implement features in backlog order (Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5).

## Hard Constraints

- **pnpm only** — Never use npm or yarn. The root `package.json` must declare `"packageManager": "pnpm@8.0.0"`.
- **TypeScript strict mode** — Every `tsconfig.json` must have `"strict": true`. No `.js` files.
- **80% coverage minimum** — Every task must have tests before it can be marked `completed` in `backlog.md`. 90% for critical paths (image processing algorithms, API endpoints).
- **Conventional commits** — Format: `type(scope): subject`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `infra`.
- **MUI only** — No CSS modules, SCSS, or styled-components. Use `sx` prop, `styled()`, or theme.
- **Functional components only** — No class components.

## Coverage Verification

Before marking any task complete in `backlog.md`, verify coverage:

```bash
# Frontend
pnpm test:web --coverage

# Backend
pnpm test:api --coverage
```

If coverage is below 80%, the task stays `in_progress`. Update `backlog.md` with the coverage percentage when moving a task to `completed`.

## Task Management

`backlog.md` is the source of truth. Update it:
- **Before starting**: Move task to `in_progress`
- **After completing**: Move to `completed` with coverage percentage
- **If blocked**: Move to `blocked` with reason

## Key Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start all services via Docker Compose |
| `pnpm dev:web` | Start frontend only (Vite dev server) |
| `pnpm dev:api` | Start backend only (Node.js with nodemon) |
| `pnpm test` | Run all tests |
| `pnpm test:web` | Run frontend tests |
| `pnpm test:api` | Run backend tests |
| `pnpm test:coverage` | Run tests with coverage reports |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm format` | Format all workspaces |
| `pnpm storybook` | Start Storybook |
| `pnpm docker:up` | Start Docker containers |
| `pnpm terraform:plan` | Plan Terraform changes |
| `pnpm terraform:apply` | Apply Terraform changes |

## Where to Find Details

- **Agent prompts** — `.opencode/agents/<agent-name>.md`
- **Implementation skills** — `.opencode/skills/<skill-name>/SKILL.md`
- **OpenCode config** — `.opencode/opencode.json`
- **Task tracker** — `backlog.md`
- **Human overview** — `README.md`

## OpenCode Commands

These are registered in `.opencode/opencode.json`:
- `/setup` — Run full project setup sequence
- `/test` — Run all tests and verify 80% coverage
- `/coverage` — Generate and review coverage reports
- `/backlog` — Update and review backlog.md

---

**Last Updated:** 2026-06-10
