---
name: ci-cd-setup
description: Set up GitHub Actions CI/CD pipelines for testing, building, and deployment. Use when adding automation or modifying workflows.
---

# CI/CD Pipeline Setup Skill

Use this skill when setting up or modifying CI/CD pipelines for the OpenCrochet project.

## Trigger
- Initial CI/CD setup
- Adding new workflows
- Modifying existing pipelines
- Adding deployment stages
- Setting up automation

## Actions

### 1. Create Frontend CI Workflow
Create `.github/workflows/frontend.yml`:
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/web/**'
      - 'packages/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint:web
      
      - name: Format check
        run: pnpm format:web --check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test:web --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/web/coverage/lcov.info
          fail_ci_if_error: true

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build:web
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: apps/web/dist

  storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Storybook
        run: pnpm build:storybook
```

### 2. Create Backend CI Workflow
Create `.github/workflows/backend.yml`:
```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/api/**'
      - 'packages/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/api/**'
      - 'packages/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint:api
      
      - name: Format check
        run: pnpm format:api --check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test:api --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/api/coverage/lcov.info
          fail_ci_if_error: true

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build:api
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: api-build
          path: apps/api/dist
```

### 3. Create Terraform CI Workflow
Create `.github/workflows/terraform.yml`:
```yaml
name: Terraform CI

on:
  push:
    branches: [main]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [main]
    paths:
      - 'terraform/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.5.0"
      
      - name: Terraform Format
        run: terraform fmt -check
        working-directory: terraform
      
      - name: Terraform Init
        run: terraform init
        working-directory: terraform
      
      - name: Terraform Validate
        run: terraform validate
        working-directory: terraform

  plan:
    runs-on: ubuntu-latest
    needs: validate
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.5.0"
      
      - name: Terraform Init
        run: terraform init
        working-directory: terraform
      
      - name: Terraform Plan
        run: terraform plan -var-file="dev.tfvars"
        working-directory: terraform

  apply:
    runs-on: ubuntu-latest
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.5.0"
      
      - name: Terraform Init
        run: terraform init
        working-directory: terraform
      
      - name: Terraform Apply
        run: terraform apply -auto-approve -var-file="prod.tfvars"
        working-directory: terraform
```

### 4. Create Deployment Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  workflow_dispatch:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    needs: [build-frontend, build-backend]
    steps:
      - uses: actions/checkout@v4
      
      - name: Download frontend artifacts
        uses: actions/download-artifact@v4
        with:
          name: web-build
          path: apps/web/dist
      
      - name: Download backend artifacts
        uses: actions/download-artifact@v4
        with:
          name: api-build
          path: apps/api/dist
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: |
          aws s3 sync apps/web/dist s3://${{ secrets.S3_BUCKET }} --delete
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster opencrochet --service api --force-new-deployment
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment completed successfully!"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 5. Create PR Template
Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Checklist
- [ ] Tests added/updated
- [ ] Coverage meets 80% threshold
- [ ] Documentation updated
- [ ] Code follows project conventions
- [ ] Linting passes
- [ ] Commits follow conventional commits format

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

## Requirements
- MUST run tests on every PR
- MUST enforce code quality checks (lint, format, type-check)
- MUST require approval for production deployments
- MUST provide deployment status notifications
- MUST cache dependencies for faster builds
- MUST use pnpm in all workflows
- MUST enforce 80% coverage threshold

## Workflow Structure

### CI Pipeline (every PR)
1. Lint and format check
2. Unit tests with coverage
3. Build verification
4. Security audit

### CD Pipeline (main branch)
1. Build artifacts
2. Deploy to staging
3. Run smoke tests
4. Deploy to production (requires approval)

### Nightly Pipeline
1. Full test suite
2. Security scanning
3. Dependency update check
4. Performance benchmarks

## Notifications
- Slack notifications for deployments
- Email notifications for failures
- GitHub status checks on PRs

## Security
- Never commit secrets (use GitHub Secrets)
- Require approvals for production
- Use OIDC for AWS authentication (avoid long-term credentials)
- Scan containers for vulnerabilities
- Audit dependencies regularly

## Performance
- Cache pnpm dependencies
- Use parallel jobs where possible
- Optimize build times
- Use artifact storage for builds

## Commands
```bash
# Trigger workflow manually
gh workflow run frontend.yml

# View workflow status
gh run list

# View specific run
gh run view <run-id>
```
