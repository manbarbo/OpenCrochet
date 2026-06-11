---
name: pnpm-workspace
description: Configure pnpm workspace for monorepo with shared dependencies. Use when setting up the monorepo structure or adding workspaces.
---

# pnpm Workspace Setup Skill

Use this skill when setting up or modifying the pnpm workspace configuration for the OpenCrochet monorepo.

## Trigger
- Monorepo initialization
- Adding new workspaces
- Modifying workspace configuration
- Setting up shared dependencies
- Configuring workspace commands

## Actions

### 1. Create Workspace Configuration
Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. Configure Root Package
Create `package.json`:
```json
{
  "name": "opencrochet",
  "version": "1.0.0",
  "description": "Convert images into filet crochet patterns",
  "private": true,
  "packageManager": "pnpm@11.5.3",
  "scripts": {
    "dev": "docker-compose up -d",
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "build": "pnpm -r build",
    "build:web": "pnpm --filter web build",
    "build:api": "pnpm --filter api build",
    "test": "pnpm -r test",
    "test:web": "pnpm --filter web test",
    "test:api": "pnpm --filter api test",
    "test:coverage": "pnpm -r test --coverage",
    "lint": "pnpm -r lint",
    "lint:web": "pnpm --filter web lint",
    "lint:api": "pnpm --filter api lint",
    "format": "pnpm -r format",
    "format:web": "pnpm --filter web format",
    "format:api": "pnpm --filter api format",
    "storybook": "pnpm --filter web storybook",
    "build:storybook": "pnpm --filter web build-storybook",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "terraform:plan": "cd terraform && terraform plan -var-file=dev.tfvars",
    "terraform:apply": "cd terraform && terraform apply -var-file=dev.tfvars",
    "clean": "pnpm -r clean && rm -rf node_modules",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yaml,yml}": [
      "prettier --write"
    ]
  }
}
```

### 3. Configure Shared Dependencies
The root `package.json` includes shared dev dependencies:
- TypeScript
- ESLint + Prettier
- Husky + lint-staged
- Changesets (for versioning)

Individual apps/packages should NOT include these in their own package.json.

### 4. Configure Workspace Filtering
Use pnpm filtering to run commands on specific workspaces:

```bash
# Run on specific workspace
pnpm --filter web dev

# Run on all workspaces matching pattern
pnpm --filter "./apps/*" build

# Run on all workspaces
pnpm -r test

# Run on changed workspaces only
pnpm --filter "...[HEAD^]" test
```

### 5. Configure Changesets (Optional)
Create `.changeset/config.json`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 6. Create Workspace Structure
```
OpenCrochet/
├── package.json              # Root package with shared scripts
├── pnpm-workspace.yaml       # Workspace configuration
├── apps/
│   ├── web/                  # React frontend
│   │   ├── package.json
│   │   └── ...
│   └── api/                  # Node.js backend
│       ├── package.json
│       └── ...
└── packages/
    ├── shared-types/         # Shared TypeScript types
    ├── image-processing/     # Shared image processing logic
    └── ui-components/        # Shared MUI components
```

### 7. Cross-Workspace Dependencies
In `apps/web/package.json`:
```json
{
  "dependencies": {
    "@opencrochet/shared-types": "workspace:*",
    "@opencrochet/ui-components": "workspace:*"
  }
}
```

In `apps/api/package.json`:
```json
{
  "dependencies": {
    "@opencrochet/shared-types": "workspace:*",
    "@opencrochet/image-processing": "workspace:*"
  }
}
```

### 8. Configure Workspace Scripts
In each workspace package.json:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx}\"",
    "clean": "rm -rf dist node_modules"
  }
}
```

## Requirements
- MUST use pnpm workspaces (not npm/yarn)
- MUST configure shared dev dependencies at root
- MUST set up workspace commands (e.g., `pnpm dev`, `pnpm test`)
- MUST support cross-workspace dependencies
- MUST use `workspace:*` for internal dependencies
- MUST configure packageManager field in root
- MUST use engine-strict to enforce pnpm

## Commands

### Development
```bash
# Start all services
pnpm dev

# Start specific service
pnpm dev:web
pnpm dev:api

# Start with Docker
pnpm docker:up
```

### Testing
```bash
# Run all tests
pnpm test

# Run specific workspace tests
pnpm test:web
pnpm test:api

# Run with coverage
pnpm test:coverage
```

### Building
```bash
# Build all workspaces
pnpm build

# Build specific workspace
pnpm build:web
pnpm build:api
```

### Linting
```bash
# Lint all workspaces
pnpm lint

# Lint specific workspace
pnpm lint:web
pnpm lint:api
```

### Cleaning
```bash
# Clean all workspaces
pnpm clean

# Clean and reinstall
pnpm clean && pnpm install
```

### Changesets
```bash
# Add changeset
pnpm changeset

# Version packages
pnpm version

# Publish packages
pnpm release
```

## Workspace Filtering Examples
```bash
# Run on all workspaces
pnpm -r build

# Run on specific workspace
pnpm --filter web test

# Run on changed workspaces
pnpm --filter "...[HEAD^]" test

# Run on dependent workspaces
pnpm --filter web... build

# Run on dependencies
pnpm --filter ...web build
```

## Verification
- [ ] pnpm-workspace.yaml created
- [ ] Root package.json configured
- [ ] Shared dev dependencies at root
- [ ] Workspace scripts defined
- [ ] Cross-workspace dependencies work
- [ ] Filtering commands work
- [ ] Changesets configured (optional)
- [ ] Engine requirements set

## Best Practices
1. Keep root package.json lean — only shared dev dependencies
2. Use workspace:* for internal dependencies
3. Define common scripts at root level
4. Use filtering for efficient operations
5. Lock pnpm version with packageManager field
6. Use changesets for versioning (optional)
