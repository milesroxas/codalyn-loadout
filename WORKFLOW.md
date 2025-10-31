# Development Workflow Guide

Quick reference for working with this jsDelivr-integrated Webflow project.

## Daily Development Workflow

### 1. Local Development

```bash
# Start dev server for testing in Webflow
pnpm dev

# In Webflow, use:
# <script defer src="http://localhost:3000/index.js"></script>
```

### 2. Making Changes

```bash
# Edit files in src/
# - src/features/carousel/
# - src/utils/
# etc.

# Test your changes
pnpm dev  # Watch mode with live reload
```

### 3. Code Quality

```bash
# Before committing, run checks
pnpm check:fix  # Auto-fix linting and formatting
pnpm check      # Verify everything passes
```

### 4. Committing Changes

```bash
# Stage only source files (NOT dist/)
git add src/
git add package.json  # If you changed dependencies
git commit -m "feat: your feature description"
```

### 5. Pushing to GitHub (Automated)

```bash
# Use the simplified push command
pnpm push
```

**What `pnpm push` does:**
1. Discards any local dist/ builds
2. Pulls latest changes (including automated builds)
3. Pushes your source code changes
4. GitHub Actions will then:
   - Build production files
   - Commit dist/ files
   - jsDelivr updates within 2-5 minutes

### 6. Alternative: Manual Push

If you prefer manual control:

```bash
# Discard local dist builds
git restore dist/

# Pull latest automated builds
git pull --rebase origin main

# Push your changes
git push origin main
```

## Complete Example Session

```bash
# 1. Start working
pnpm dev

# 2. Make changes to src/features/carousel/model.ts

# 3. Test in Webflow with localhost:3000

# 4. Verify code quality
pnpm check:fix

# 5. Commit your changes
git add src/
git commit -m "feat: add breakpoint configuration to carousel"

# 6. Push (automated)
pnpm push

# 7. Wait 2-5 minutes, then test in Webflow production:
# https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js
```

## Webflow Integration

### Development (Local Testing)

```html
<!-- Webflow Project Settings > Custom Code > Footer Code -->
<script defer src="http://localhost:3000/index.js"></script>
```

### Production (Auto-updating)

```html
<!-- Always gets latest from main branch -->
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.css" rel="stylesheet"/>
```

### Production (Pinned Version)

```html
<!-- Stable version, won't auto-update -->
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@v1.0.0/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@v1.0.0/dist/index.css" rel="stylesheet"/>
```

## Important Rules

### ✅ DO

- Always use `pnpm push` instead of `git push`
- Only commit `src/` files manually
- Test locally with `pnpm dev` before pushing
- Run `pnpm check:fix` before committing
- Use conventional commit messages (feat:, fix:, chore:)

### ❌ DON'T

- Don't manually commit `dist/` files (GitHub Actions handles this)
- Don't push without pulling first
- Don't edit dist/ files directly
- Don't skip `pnpm check` before committing

## Troubleshooting

### "Your branch has diverged"

This happens if you forgot to pull before pushing.

**Solution:**
```bash
pnpm push  # This handles it automatically
```

### "Unstaged changes in dist/"

You have local builds that conflict with remote.

**Solution:**
```bash
git restore dist/
git pull origin main
```

### Changes Not Appearing in Webflow

1. Check GitHub Actions: https://github.com/milesroxas/codalyn-loadout/actions
2. Verify the build succeeded
3. Wait 2-5 minutes for jsDelivr cache
4. Hard refresh in browser (Cmd+Shift+R / Ctrl+Shift+R)
5. Check the CDN URL directly in browser

### Build Failed on GitHub Actions

1. Check the Actions log for errors
2. Run `pnpm build` locally to reproduce
3. Fix the issue in src/
4. Push again with `pnpm push`

## Version Management

### Creating a Stable Release

```bash
# After testing and verifying everything works
git tag v1.0.0
git push origin v1.0.0

# Update Webflow to use this stable version:
# @main → @v1.0.0
```

### Semantic Versioning

- `v1.0.0` - Major (breaking changes)
- `v1.1.0` - Minor (new features, backward compatible)
- `v1.0.1` - Patch (bug fixes)

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start local dev server |
| `pnpm build` | Build production locally (for testing) |
| `pnpm check` | Run linting and type checking |
| `pnpm check:fix` | Auto-fix code quality issues |
| `pnpm push` | Smart push with auto-sync |
| `pnpm test` | Run Playwright tests |

## File Structure

```
src/              → Your code (commit this)
dist/             → Built files (DON'T commit, CI handles it)
.github/workflows → Automation (rarely modified)
bin/              → Build scripts (rarely modified)
```

## Getting Help

- **Build Issues**: Check GitHub Actions logs
- **Type Errors**: Run `pnpm check` locally
- **Webflow Issues**: Verify CDN URL in browser Network tab
- **Git Conflicts**: Use `pnpm push` instead of `git push`
