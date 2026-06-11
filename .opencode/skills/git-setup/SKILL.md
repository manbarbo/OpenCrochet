---
name: git-setup
description: Initialize Git repository with conventions, templates, and branch protection. Use when setting up version control or modifying Git workflows.
---

# Git Setup Skill

Use this skill when initializing or configuring Git version control for the OpenCrochet project.

## Trigger
- Initial repository setup
- Modifying Git workflows
- Adding branch protection rules
- Setting up commit conventions
- Creating templates

## Actions

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "chore(repo): initial project setup"
```

### 2. Create .gitignore
```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production

# Logs
*.log
npm-debug.log*

# Coverage
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Terraform
terraform/.terraform/
terraform/*.tfstate
terraform/*.tfstate.*
terraform/*.tfvars

# Uploads
uploads/
temp/

# Storybook
storybook-static/

# Misc
*.tgz
*.tar.gz
```

### 3. Configure Commit Message Convention
Install commitlint:
```bash
pnpm add -D @commitlint/config-conventional @commitlint/cli
```

Create `commitlint.config.js`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'ci',
        'infra',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'frontend',
        'backend',
        'image-processing',
        'api',
        'ui',
        'tests',
        'docs',
        'infra',
        'terraform',
        'docker',
        'ci',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
}
```

### 4. Configure Husky for Commit Validation
```bash
npx husky install
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'
```

### 5. Create Branch Protection Rules
Create `.github/settings.yml`:
```yaml
repository:
  default_branch: main
  delete_branch_on_merge: true

branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
        require_code_owner_reviews: false
      required_status_checks:
        strict: true
        contexts:
          - "Frontend CI / lint"
          - "Frontend CI / test"
          - "Backend CI / lint"
          - "Backend CI / test"
          - "Terraform CI / validate"
      enforce_admins: false
      required_linear_history: true
      allow_force_pushes: false
      allow_deletions: false
```

### 6. Create Issue Templates
Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen.

**Screenshots**
If applicable.

**Environment:**
- OS: [e.g., macOS]
- Browser: [e.g., Chrome]
- Version: [e.g., 1.0.0]

**Additional context**
Any other context.
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEAT] '
labels: feature
assignees: ''
---

**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution**
What you want to happen.

**Describe alternatives**
Any alternative solutions.

**Additional context**
Any other context.
```

### 7. Create README.md Template
Create `README.md`:
```markdown
# OpenCrochet

Convert images into filet crochet patterns using AI and image processing.

## Features
- Upload images (JPG, PNG, WebP)
- Apply filters: Threshold, Halftone, Posterize, Pixelate
- Real-time preview of pattern grid
- Export to SVG, PNG, PDF
- Adjustable grid size and stitch ratios

## Tech Stack
- Frontend: React 19, TypeScript, MUI, Vite
- Backend: Node.js, Express, TypeScript, Sharp
- Infrastructure: Terraform, AWS, Docker

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker 24+ (optional)

### Installation
```bash
# Clone repository
git clone https://github.com/username/opencrochet.git
cd opencrochet

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Development
```bash
# Start all services
pnpm dev

# Start frontend only
pnpm dev:web

# Start backend only
pnpm dev:api

# Run tests
pnpm test

# Build for production
pnpm build
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
MIT
```

### 8. Create CONTRIBUTING.md
Create `CONTRIBUTING.md`:
```markdown
# Contributing to OpenCrochet

Thank you for your interest in contributing!

## Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Start development: `pnpm dev`

## Workflow
1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make changes following our coding standards
3. Write tests (minimum 80% coverage)
4. Update documentation
5. Commit with conventional commit format
6. Push to your fork
7. Create a Pull Request

## Commit Convention
Format: `type(scope): subject`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance
- `ci`: CI/CD changes
- `infra`: Infrastructure

## Testing
- All code must have tests (minimum 80% coverage)
- Run tests before submitting PR: `pnpm test`
- Update tests when modifying existing code

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- Functional React components with hooks
- MUI components and theming

## Pull Request Process
1. Ensure tests pass
2. Update relevant documentation
3. Request review from maintainers
4. Address review comments
5. Merge after approval

## Questions?
Open an issue or contact the maintainers.
```

## Requirements
- MUST protect main branch (require PR, require review)
- MUST enforce conventional commit messages
- MUST provide clear PR and issue templates
- MUST include license and contribution guidelines
- MUST set up Husky for commit validation
- MUST configure branch protection rules

## Git Workflow

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch (optional)
- `feat/*`: Feature branches
- `fix/*`: Bug fix branches
- `docs/*`: Documentation branches
- `infra/*`: Infrastructure branches

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

Examples:
- `feat(image-processing): add threshold filter`
- `fix(api): handle large file uploads`
- `docs(readme): update setup instructions`
- `test(frontend): add image upload tests`
- `infra(terraform): add s3 bucket for uploads`

### Release Process
1. Update version in package.json
2. Create release branch: `git checkout -b release/v1.0.0`
3. Update CHANGELOG.md
4. Create PR to main
5. After merge, tag release: `git tag -a v1.0.0 -m "Release v1.0.0"`
6. Push tag: `git push origin v1.0.0`

## Commands
```bash
# Create feature branch
git checkout -b feat/my-feature

# Commit with convention
git commit -m "feat(ui): add image upload component"

# Push branch
git push origin feat/my-feature

# Rebase with main
git checkout feat/my-feature
git rebase main

# Squash commits
git rebase -i HEAD~3
```

## Verification
- [ ] Git repository initialized
- [ ] .gitignore created
- [ ] Branch protection configured
- [ ] Commit linting set up
- [ ] PR template created
- [ ] Issue templates created
- [ ] README.md created
- [ ] CONTRIBUTING.md created
- [ ] LICENSE added
