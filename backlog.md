# OpenCrochet Backlog

## Project Tasks

This file tracks all tasks for the OpenCrochet project. Update this file before starting any task and after completing it.

**Coverage Rule:** All completed tasks MUST have 80%+ coverage (90% for critical paths).

---

## In Progress

### No tasks in progress

---

## Pending

### Phase 1: Project Setup

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| SET-001 | Set up pnpm workspace (monorepo) | High | `devops` | pending | - |
| SET-002 | Set up React 19 frontend with Vite, TypeScript, MUI | High | `frontend-dev` | pending | - |
| SET-003 | Set up Node.js backend with Express, TypeScript, Sharp | High | `backend-dev` | pending | - |
| SET-004 | Set up Docker containers for development | High | `devops` | pending | - |
| SET-005 | Set up Terraform infrastructure (AWS) | Medium | `devops` | pending | - |
| SET-006 | Set up GitHub Actions CI/CD pipelines | Medium | `devops` | pending | - |
| SET-007 | Set up Git repository with conventions | Medium | `devops` | pending | - |
| SET-008 | Set up Storybook for component documentation | Medium | `frontend-dev` | pending | - |
| SET-009 | Set up Jest + React Testing Library (frontend) | High | `testing` | pending | - |
| SET-010 | Set up Jest + Supertest (backend) | High | `testing` | pending | - |

### Phase 2: Core Features

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| FEAT-001 | Implement image upload component (drag & drop) | High | `frontend-dev` | pending | - |
| FEAT-002 | Implement image preview component | High | `frontend-dev` | pending | - |
| FEAT-003 | Implement Threshold filter UI | High | `frontend-dev` | pending | - |
| FEAT-004 | Implement Halftone filter UI | Medium | `frontend-dev` | pending | - |
| FEAT-005 | Implement Posterize filter UI | Medium | `frontend-dev` | pending | - |
| FEAT-006 | Implement Pixelate filter UI | Medium | `frontend-dev` | pending | - |
| FEAT-007 | Implement grid preview component | High | `frontend-dev` | pending | - |
| FEAT-008 | Implement export functionality (SVG, PNG, PDF) | High | `frontend-dev` | pending | - |
| FEAT-009 | Implement image upload API endpoint | High | `backend-dev` | pending | - |
| FEAT-010 | Implement Threshold filter algorithm | High | `image-processing` | pending | - |
| FEAT-011 | Implement Halftone filter algorithm | Medium | `image-processing` | pending | - |
| FEAT-012 | Implement Posterize filter algorithm | Medium | `image-processing` | pending | - |
| FEAT-013 | Implement Pixelate filter algorithm | Medium | `image-processing` | pending | - |
| FEAT-014 | Implement grid generation algorithm | High | `image-processing` | pending | - |
| FEAT-015 | Implement pattern export (SVG) | High | `backend-dev` | pending | - |
| FEAT-016 | Implement pattern export (PNG) | High | `backend-dev` | pending | - |
| FEAT-017 | Implement pattern export (PDF) | Medium | `backend-dev` | pending | - |
| FEAT-018 | Implement real-time preview endpoint | Medium | `backend-dev` | pending | - |

### Phase 3: UI/UX & Design

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| UI-001 | Create MUI theme and design tokens | High | `ui-ux` | pending | - |
| UI-002 | Design responsive layout (mobile, tablet, desktop) | High | `ui-ux` | pending | - |
| UI-003 | Design image upload flow | High | `ui-ux` | pending | - |
| UI-004 | Design filter selection interface | Medium | `ui-ux` | pending | - |
| UI-005 | Design grid preview and export interface | Medium | `ui-ux` | pending | - |
| UI-006 | Ensure WCAG 2.1 AA accessibility | High | `ui-ux` | pending | - |

### Phase 4: Testing & Quality

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| TEST-001 | Write unit tests for frontend components | High | `testing` | pending | - |
| TEST-002 | Write unit tests for backend endpoints | High | `testing` | pending | - |
| TEST-003 | Write integration tests for image processing pipeline | High | `testing` | pending | - |
| TEST-004 | Write E2E tests for critical user flows | Medium | `testing` | pending | - |
| TEST-005 | Set up visual regression testing (Storybook + Chromatic) | Medium | `testing` | pending | - |
| TEST-006 | Test accessibility compliance (aXe, Lighthouse) | Medium | `testing` | pending | - |
| TEST-007 | Test image processing performance (under 5s for 1000x1000px) | Medium | `testing` | pending | - |
| TEST-008 | Test cross-browser compatibility | Low | `testing` | pending | - |

### Phase 5: Documentation

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| DOC-001 | Write README.md with setup instructions | Medium | `docs` | pending | - |
| DOC-002 | Write API documentation (Swagger) | Medium | `docs` | pending | - |
| DOC-003 | Write user guide (upload, filter, export) | Medium | `docs` | pending | - |
| DOC-004 | Write architecture documentation | Medium | `docs` | pending | - |
| DOC-005 | Write image processing algorithm documentation | Medium | `docs` | pending | - |
| DOC-006 | Create Storybook stories for all components | Medium | `docs` | pending | - |
| DOC-007 | Create ADRs for key decisions | Low | `docs` | pending | - |
| DOC-008 | Create onboarding documentation | Low | `docs` | pending | - |

### Phase 6: Advanced Features (Future)

| Task | Description | Priority | Assigned Agent | Status | Coverage |
|------|-------------|----------|----------------|--------|----------|
| ADV-001 | Implement AI-assisted edge detection | Low | `image-processing` | pending | - |
| ADV-002 | Implement pattern optimization | Low | `image-processing` | pending | - |
| ADV-003 | Add grid customization (cell size, stitch ratios) | Low | `frontend-dev` | pending | - |
| ADV-004 | Add batch processing | Low | `backend-dev` | pending | - |
| ADV-005 | Add user accounts and saved patterns | Low | `backend-dev` | pending | - |

---

## Completed

### No tasks completed yet

---

## Blocked

### No tasks blocked

---

## Task Status Legend

- **pending**: Task not yet started
- **in_progress**: Task actively being worked on
- **completed**: Task finished and verified
- **blocked**: Task cannot proceed (reason documented)

## Coverage Legend

- **-**: Not yet started
- **N/A**: Not applicable (e.g., documentation, design)
- **< 80%**: Below threshold, needs more tests
- **80%+**: Meets minimum requirement
- **90%+**: Exceeds requirement for critical paths

## How to Update This File

1. **Before starting a task**: Move it from "Pending" to "In Progress" and update status
2. **After completing a task**: Move it to "Completed" and fill in coverage percentage
3. **If blocked**: Move to "Blocked" and document the reason
4. **Adding new tasks**: Add to "Pending" with unique ID

## Template for New Tasks

```
| ID | Description | Priority | Agent | Status | Coverage |
|----|-------------|----------|-------|--------|----------|
| ID-001 | Description | Low/Medium/High | agent-name | pending | - |
```

---

**Last Updated:** 2026-06-10
**Version:** 1.0.0
**Maintainer:** @manuelbarona
