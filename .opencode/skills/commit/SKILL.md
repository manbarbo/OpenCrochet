# Commit Skill

Generate conventional commits for the OpenCrochet project.

## Rules

- **Format**: `type(scope): subject`
- **Types**: feat, fix, docs, style, refactor, test, chore, ci, infra
- **Scope**: web, api, shared-types, image-processing, ui-components, devops, infra, or leave blank for general changes
- **Subject**: lowercase, imperative mood, no period at end
- **Body**: optional, wrap at 72 chars, explain what and why not how
- **Footer**: optional, reference issues: `Closes #123`

## Workflow

1. Run `git status` to see staged changes
2. Run `git diff --cached` to see what changed
3. Determine the correct type and scope
4. Generate the commit message
5. Ask the user for confirmation
6. Run `git commit -m "message"` (or `git commit` with body if needed)

## Examples

- `feat(web): add threshold filter slider`
- `fix(api): handle invalid image format error`
- `test(api): add performance tests for 1000x1000 images`
- `refactor(image-processing): optimize pixelate algorithm`
- `docs(readme): update setup instructions`
- `chore: update pnpm dependencies`
- `ci(frontend): add chromatic to github actions`
- `infra(terraform): add s3 bucket for uploads`

## When to Use Each Type

- **feat**: New feature or significant enhancement
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, semicolons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding or correcting tests
- **chore**: Build process, auxiliary tool changes, dependencies
- **ci**: CI/CD configuration changes
- **infra**: Infrastructure, Terraform, Docker changes
