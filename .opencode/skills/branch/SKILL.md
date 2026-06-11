# Branch Skill

Create a new feature branch from main for the OpenCrochet project.

## Rules

- **Branch from main only** — Always create branches from the latest `main`.
- **Naming pattern**: `type/description`
- **Types**: feat, fix, docs, refactor, test, chore
- **Description**: lowercase, hyphen-separated, no spaces, concise (max 50 chars)
- **Examples**: `feat/threshold-filter`, `fix/upload-validation`, `docs/api-guide`, `refactor/grid-algorithm`, `test/integration-pipeline`, `chore/update-deps`

## Workflow

1. Run `git status` to check current branch
2. If on main:
   - Run `git pull origin main` to get latest changes
   - Determine branch name based on the task being implemented
   - Show the proposed branch name to the user
   - Ask for confirmation
   - If confirmed, run `git checkout -b <branch-name>`
3. If NOT on main:
   - Show warning: `You are currently on branch <current-branch>. New branches should be created from main.`
   - Ask if user wants to switch to main first
   - If yes, run `git stash` (if needed), `git checkout main`, `git pull origin main`, then `git checkout -b <branch-name>`
   - If no, exit and suggest using `git checkout main` manually

## Git Commands Reference

```bash
# Check current branch
git branch --show-current

# Pull latest main
git pull origin main

# Create new branch
git checkout -b feat/new-feature

# Switch to main
git checkout main

# Stash changes (if needed)
git stash
```

## When to Use

- **Before starting any implementation** — Always verify branch status
- If on `main`, create a new feature branch immediately
- If on a feature branch, continue working there
- Never commit directly to `main`

## Integration with Other Commands

After creating a branch, the workflow should be:
1. `/branch` → Create feature branch
2. Implement changes (edit code, write tests, etc.)
3. `/commit` → Commit changes with conventional commits
4. `/pr` → Create pull request to main

## Examples

- Starting a new feature: `git checkout -b feat/pixelate-filter`
- Fixing a bug: `git checkout -b fix/memory-leak`
- Adding documentation: `git checkout -b docs/adr-sharp`
- Refactoring: `git checkout -b refactor/grid-generation`
- Adding tests: `git checkout -b test/e2e-upload-flow`
- Updating dependencies: `git checkout -b chore/update-sharp`
