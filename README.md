# OpenCrochet

> Convert images into filet crochet patterns using AI and image processing techniques.

[![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)](https://github.com/manuelbarona/opencrochet)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-11.5.3-orange)](https://pnpm.io)
[![React](https://img.shields.io/badge/react-19.0-61dafb)](https://react.dev)
[![Node.js](https://img.shields.io/badge/node.js-20.0-339933)](https://nodejs.org)

## Overview

OpenCrochet is a single-page web application that allows users to upload images and convert them into filet crochet patterns using advanced image processing filters and AI techniques.

### Features

- **Image Upload**: Drag-and-drop or file picker for JPG, PNG, WebP images
- **Image Processing Filters**:
  - **Threshold**: Convert to black/white based on luminosity threshold
  - **Halftone**: Convert to dots/lines of varying sizes (bitmap mode)
  - **Posterize**: Reduce colors to 2 tones for clear patterns
  - **Pixelate**: Reduce resolution to create pixel art grid
- **Real-time Preview**: Live preview of pattern changes with filter parameters
- **Grid Customization**: Adjustable grid size, cell dimensions, and stitch ratios
- **Export Options**: Download patterns as SVG, PNG, or PDF
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant

## Tech Stack

### Frontend
- **React 19** (latest stable) with TypeScript (strict mode)
- **Material UI (MUI) v6** — Component library and design system
- **Vite** — Build tool and dev server
- **Zustand** — State management
- **React Query** — Server state management
- **Axios** — HTTP client
- **Canvas API** — Browser-side image processing

### Backend
- **Node.js 20+** with Express.js
- **TypeScript** (strict mode)
- **Sharp** — High-performance image processing
- **Multer** — File upload handling
- **Joi / Zod** — Input validation
- **Winston** — Logging
- **Helmet + CORS** — Security middleware

### AI / Image Processing
- **Sharp** — Node.js image processing (resize, threshold, grayscale)
- **Canvas API** — Browser-side pixel manipulation
- **TensorFlow.js** (optional) — Edge detection and segmentation
- **OpenCV** (optional) — Advanced computer vision

### Infrastructure & DevOps
- **Terraform** — Infrastructure as Code (AWS)
- **Docker + Docker Compose** — Containerization
- **GitHub Actions** — CI/CD pipelines
- **AWS** — S3, EC2, ECS, CloudFront
- **Nginx** — Reverse proxy

### Testing & Documentation
- **Jest + React Testing Library** — Frontend unit tests
- **Jest + Supertest** — Backend integration tests
- **Storybook** — Component documentation and isolated development
- **Swagger / OpenAPI** — API documentation

## Project Structure

```
OpenCrochet/
├── AGENTS.md              # Project rules, agents, and skills
├── README.md              # This file
├── backlog.md             # Task management
├── .gitignore
├── .dockerignore
├── docker-compose.yml     # Local development orchestration
├── Dockerfile             # Production container
├── Dockerfile.dev         # Development container
├── Makefile               # Common commands
├── package.json           # Root package (pnpm workspaces)
├── pnpm-workspace.yaml    # Workspace configuration
├── pnpm-lock.yaml         # Lock file
├── .opencode/             # OpenCode agent configuration
│   ├── opencode.json      # Agent definitions
│   ├── agents/            # Agent prompts
│   └── skills/            # Skill definitions
│       ├── commit/        # Conventional commits skill
│       ├── pnpm-workspace/
│       ├── react-setup/
│       ├── node-setup/
│       ├── docker-setup/
│       ├── terraform-setup/
│       ├── ci-cd-setup/
│       ├── git-setup/
│       └── image-processing-pipeline/
├── terraform/             # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── s3/
│       ├── ec2/
│       └── cloudfront/
├── apps/
│   ├── web/               # React frontend application
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── services/    # API services
│   │   │   ├── stores/      # Zustand stores
│   │   │   ├── styles/      # Theme configuration
│   │   │   └── __tests__/   # E2E and cross-browser tests
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── jest.config.ts
│   │   └── .storybook/      # Storybook configuration
│   └── api/               # Node.js backend API
│       ├── src/
│       │   ├── routes/      # Express routes
│       │   ├── services/    # Business logic
│       │   ├── middleware/  # Express middleware
│       │   ├── utils/       # Utilities
│       │   └── __tests__/   # Integration tests
│       ├── uploads/         # Uploaded images
│       ├── package.json
│       ├── tsconfig.json
│       └── jest.config.ts
├── packages/
│   ├── shared-types/      # Shared TypeScript types
│   ├── image-processing/  # Shared image processing logic
│   └── ui-components/     # Shared MUI components
└── docs/
    ├── architecture.md
    ├── api-spec.md
    └── image-processing.md
```

## Prerequisites

- **Node.js** 20+ (LTS)
- **pnpm** 11.5.3+ (latest)
- **Docker** 24+ (for containerization)
- **Terraform** 1.5+ (for infrastructure)
- **Git** 2.40+ (for version control)

## Getting Started

### 1. Install Prerequisites

```bash
# Install pnpm globally
npm install -g pnpm

# Verify versions
node --version   # v20.0.0+
pnpm --version   # 8.0.0+
docker --version # 24.0.0+
```

### 2. Clone Repository

```bash
git clone https://github.com/manuelbarona/opencrochet.git
cd opencrochet
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Development

#### Option A: Docker Compose (Recommended)
```bash
# Start all services
pnpm dev

# Or with Docker Compose directly
docker-compose up -d
```

#### Option B: Start Services Separately
```bash
# Terminal 1: Start backend
pnpm dev:api

# Terminal 2: Start frontend
pnpm dev:web

# Terminal 3: Start Storybook
pnpm storybook
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Storybook**: http://localhost:6006

## Development Commands

### Testing
```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm test:web

# Run backend tests
pnpm test:api

# Run tests with coverage
pnpm test:coverage

# Run specific test suites
pnpm test:web -- --testPathPatterns=e2e     # E2E tests
pnpm test:web -- --testPathPatterns=a11y     # Accessibility tests
pnpm test:web -- --testPathPatterns=cross-browser  # Cross-browser tests
pnpm test:api -- --testPathPatterns=performance    # Performance tests
pnpm test:api -- --testPathPatterns=integration   # Integration tests
```

### Building
```bash
# Build all services
pnpm build

# Build frontend
pnpm build:web

# Build backend
pnpm build:api

# Build Storybook
pnpm build:storybook
```

### Linting & Formatting
```bash
# Lint all workspaces
pnpm lint

# Format all code
pnpm format

# Check formatting
pnpm format:check
```

### Docker
```bash
# Build Docker images
pnpm docker:build

# Start Docker containers
pnpm docker:up

# Stop Docker containers
pnpm docker:down

# View logs
pnpm docker:logs
```

### Terraform
```bash
# Plan Terraform changes
pnpm terraform:plan

# Apply Terraform changes
pnpm terraform:apply

# Format Terraform code
pnpm terraform:format

# Validate Terraform
pnpm terraform:validate
```

## Testing Requirements

**Coverage Threshold: 80% minimum (90% for critical paths)**

- Every component must have a `.test.tsx` file
- Every hook must have a `.test.ts` file
- Every API endpoint must have integration tests
- All tests must pass before merging

Run tests with coverage:
```bash
pnpm test:web --coverage
pnpm test:api --coverage
```

## Image Processing Pipeline

1. **Upload**: Accept image (JPG, PNG, WebP) via frontend or API
2. **Preprocessing**: Resize to working dimensions (e.g., 200x200px for preview)
3. **Filter Application**:
   - **Threshold**: Convert to black/white based on luminosity threshold (0-255)
   - **Halftone**: Convert to dots/lines of varying sizes (bitmap mode)
   - **Posterize**: Reduce to 2 colors (black and white)
   - **Pixelate**: Reduce resolution to create pixel art (each pixel = grid cell)
4. **Grid Generation**: Convert processed image to grid (2D array of 0s and 1s)
5. **Post-processing**: Apply grid smoothing, edge detection, noise reduction (optional)
6. **Export**: Generate pattern diagram (SVG/PNG/PDF)

## Agents & Skills

This project uses OpenCode agents and skills for development. See:

- **AGENTS.md** — Project rules, conventions, and agent definitions
- **.opencode/agents/** — Agent prompts and configurations
- **.opencode/skills/** — Skill definitions for common tasks

### Available Agents

- `frontend-dev` — React/TypeScript developer
- `backend-dev` — Node.js/Express developer
- `image-processing` — Computer vision and image processing expert
- `devops` — Infrastructure and CI/CD specialist
- `testing` — QA and testing specialist
- `docs` — Technical writer
- `ui-ux` — UI/UX designer

### Available Skills

- `react-setup` — Initialize React application
- `node-setup` — Initialize Node.js API
- `image-processing-pipeline` — Implement image processing features
- `terraform-setup` — Set up AWS infrastructure
- `docker-setup` — Containerize services
- `ci-cd-setup` — Set up GitHub Actions
- `git-setup` — Configure Git repository
- `pnpm-workspace` — Configure pnpm workspace
- `commit` — Generate conventional commit messages

## Task Management

Tasks are tracked in **backlog.md**. Each task includes:
- Description and priority
- Assigned agent
- Status (pending, in_progress, completed, blocked)
- Test coverage status

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes following our coding standards
4. Write tests (minimum 80% coverage)
5. Update documentation
6. Run tests: `pnpm test`
7. Commit with conventional commit message
8. Push to fork: `git push origin feat/my-feature`
9. Create Pull Request with description
10. Request review from relevant agent
11. Merge after approval and CI pass

### Commit Convention

Format: `type(scope): subject`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `infra`

Examples:
- `feat(image-processing): add threshold filter`
- `fix(api): handle large file uploads`
- `docs(readme): update setup instructions`
- `test(frontend): add image upload tests`

## Documentation

- [Architecture](docs/architecture.md) — Detailed architecture decisions
- [API Specification](docs/api-spec.md) — API endpoints and schemas
- [Image Processing](docs/image-processing.md) — Algorithms and parameters
- [Storybook](http://localhost:6006) — Component documentation
- [Swagger UI](http://localhost:3001/api/docs) — Interactive API documentation

## OpenCode Commands

This project uses OpenCode for AI-assisted development. Available commands:

- `/setup` — Run full project setup (React + Node + Docker + Terraform)
- `/test` — Run all tests and verify 80% coverage
- `/coverage` — Generate and review coverage reports
- `/backlog` — Update and review backlog.md
- `/commit` — Generate conventional commit message and commit changes

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contact

- **Project Owner**: @manuelbarona
- **GitHub**: https://github.com/manuelbarona/opencrochet
- **Issues**: https://github.com/manuelbarona/opencrochet/issues

---

**Last Updated:** 2026-06-11
**Version:** 1.0.0
