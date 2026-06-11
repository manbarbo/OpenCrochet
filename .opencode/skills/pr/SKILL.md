# PR Skill

Create a pull request from the current feature branch to main for the OpenCrochet project.

## Rules

- **Create from feature branch only** — Never create PR from main.
- **Uncommitted changes** — Must commit first using `/commit` command.
- **Push branch** — Must push the branch to origin first.
- **PR Title**: Use conventional commit format: `type(scope): description`
- **PR Description**: Use the template below with sections for summary, changes, testing, and checklist.

## PR Template

```markdown
## Summary

Brief description of what this PR does and why.

## Changes

- List of specific changes made
- Each change should be a bullet point
- Reference issues if applicable: `Closes #123`

## Testing

- [ ] Unit tests pass (`pnpm test`)
- [ ] Coverage meets 80% threshold (`pnpm test:coverage`)
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Accessibility checks pass (if UI changes)

## Screenshots

If applicable, add screenshots or GIFs showing the changes.

## Checklist

- [ ] Code follows project conventions (AGENTS.md)
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (README, ADRs, etc.)
- [ ] No breaking changes (or documented if any)
- [ ] Commit messages follow conventional commits format
- [ ] Branch is up to date with main

## Related Issues

- Closes #123
- Relates to #456
```

## Workflow

1. Run `git status` to check current branch
2. If on main:
   - Show error: `Cannot create PR from main. You must be on a feature branch.`
   - Suggest running `/branch` to create a feature branch first
   - Exit
3. If on feature branch:
   - Check for uncommitted changes
   - If uncommitted changes exist:
     - Show warning: `You have uncommitted changes. Please commit first using /commit.`
     - Show `git status` output
     - Exit
   - If all changes are committed:
     - Run `git push origin <branch-name>`
     - Generate PR title using conventional commit format
     - Generate PR description using the template above
     - Show the proposed PR title and description to the user
     - Ask for confirmation
     - If confirmed, create PR using:
       ```bash
       gh pr create --title "<title>" --body "<body>" --base main
       ```
     - Show the PR URL

## Git Commands Reference

```bash
# Check current branch
git branch --show-current

# Check for uncommitted changes
git status

# Push branch to origin
git push origin <branch-name>

# Create PR with GitHub CLI
gh pr create --title "<title>" --body "<body>" --base main

# List open PRs
gh pr list

# View PR
gh pr view <pr-number>
```

## When to Use

- **After completing implementation and committing** — Use `/commit` first, then `/pr`
- **When ready to merge** — All tests must pass, coverage must meet threshold
- **Never from main** — Always create PR from a feature branch

## Integration with Other Commands

The complete workflow should be:
1. `/branch` → Create feature branch from main
2. Implement changes (edit code, write tests, etc.)
3. `/commit` → Commit changes with conventional commits
4. `/pr` → Create pull request to main

## Examples

- Feature PR: `feat(web): add pixelate filter UI`
- Bug fix PR: `fix(api): handle invalid image format error`
- Test PR: `test(api): add performance tests for 1000x1000 images`
- Docs PR: `docs(adr): add decision record for Docker`
- Refactor PR: `refactor(image-processing): optimize grid generation`
- Chore PR: `chore: update pnpm dependencies to latest versions`

## PR Requirements

Before creating a PR, verify:
- [ ] All tests pass (`pnpm test`)
- [ ] Coverage is above 80% (`pnpm test:coverage`)
- [ ] No lint errors (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Branch is up to date with main (`git pull origin main`)
- [ ] Commits follow conventional commits format
- [ ] Uncommitted changes are committed
- [ ] Branch is pushed to origin
