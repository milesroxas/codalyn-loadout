# Development Workflow Guide

Quick reference for working with this jsDelivr-integrated Webflow project.

## TL;DR - The 4 Commands You Need

```bash
pnpm dev          # 1. Test locally at localhost:3005
pnpm check:fix    # 2. Fix code quality issues
git add src/      # 3. Stage your changes
git commit -m "feat: description"  # 4. Commit
pnpm push         # 5. Push → GitHub Actions builds → jsDelivr updates
```

**Never commit `dist/` files manually!** GitHub Actions builds them automatically.

---

## How jsDelivr Deployment Works

**Important:** jsDelivr automatically serves files directly from your GitHub repository. You never need to manually upload files to jsDelivr!

When you push to GitHub:
1. GitHub Actions builds your `dist/` files automatically
2. GitHub Actions commits `dist/` back to your repo
3. GitHub Actions purges jsDelivr cache (forces immediate update)
4. Your changes go live **immediately** at: `https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js`

**Note:** Without cache purging, jsDelivr caches files for up to 12 hours. The workflow now includes automatic cache purging for instant updates!

## Simple 4-Step Workflow

### Step 1: Make Changes

```bash
# Edit files in src/
pnpm dev  # Test locally at localhost:3005
```

### Step 2: Check Code Quality

```bash
pnpm check:fix  # Auto-fix linting and formatting
```

### Step 3: Commit Your Changes

```bash
# Stage ONLY source files (NOT dist/)
git add src/
git add bin/              # If you changed build scripts
git add package.json      # If you changed dependencies

# Commit with conventional commit message
git commit -m "feat: your feature description"
```

### Step 4: Push to GitHub

```bash
pnpm push
```

**That's it!** GitHub Actions will:
- Build production files
- Commit `dist/` to GitHub
- Purge jsDelivr cache (instant updates!)

---

## What `pnpm push` Actually Does

```bash
# Under the hood, it runs:
git restore dist/                    # Discard local builds
git pull --rebase origin main        # Get latest (including bot commits)
git push origin main                 # Push your changes
```

This prevents conflicts between your local builds and GitHub Actions builds.

## Complete Example Session

```bash
# 1. Make changes
# Edit src/features/carousel/model.ts

# 2. Test locally
pnpm dev
# Test in Webflow with localhost:3005

# 3. Code quality check
pnpm check:fix

# 4. Commit
git add src/
git commit -m "feat: add breakpoint configuration to carousel"

# 5. Push
pnpm push

# 6. Wait 2-5 minutes, then test production:
# https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js
# Hard refresh browser (Cmd+Shift+R)
```

## Webflow Integration

### Development (Local Testing)

```html
<!-- Webflow Project Settings > Custom Code > Footer Code -->
<script defer src="http://localhost:3005/index.js"></script>
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

- Work directly on `main` branch (no feature branches needed for solo work)
- Always use `pnpm push` instead of `git push`
- Only commit `src/`, `bin/`, `docs/`, `package.json` files
- Test locally with `pnpm dev` before pushing
- Run `pnpm check:fix` before committing
- Use conventional commit messages (feat:, fix:, chore:, docs:)

### ❌ DON'T

- Don't manually commit `dist/` files (GitHub Actions handles this)
- Don't use `git push` directly (use `pnpm push` instead)
- Don't edit `dist/` files directly
- Don't skip `pnpm check:fix` before committing
- Don't manually upload files to jsDelivr (it mirrors GitHub automatically!)

## Troubleshooting

### "Cannot pull with rebase: You have unstaged changes"

**Problem:** You have uncommitted changes when trying to push.

**Solution:**
```bash
# Option 1: Commit or restore the changes first
git status                    # See what changed
git restore dist/            # If it's dist/, discard it
git add docs/                # If it's source files, commit them

# Then try again
pnpm push
```

### "Your branch has diverged"

**Problem:** Your local branch and remote have different commits.

**Solution:**
```bash
pnpm push  # This handles it automatically with --rebase
```

### "Unstaged changes in dist/"

**Problem:** You ran `pnpm dev` or `pnpm build` locally, creating dist/ files that conflict with GitHub's automated builds.

**Solution:**
```bash
git restore dist/            # Discard local builds
pnpm push                    # Let GitHub Actions build instead
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

## File Structure & What to Commit

```
src/              → ✅ Commit this (your source code)
bin/              → ✅ Commit this (build scripts)
docs/             → ✅ Commit this (documentation)
package.json      → ✅ Commit this (dependencies)
pnpm-lock.yaml    → ✅ Commit this (lock file)

dist/             → ❌ Never commit (GitHub Actions builds this)
node_modules/     → ❌ Never commit (gitignored)
```

**Remember:** GitHub Actions automatically builds and commits `dist/` files. You only commit source code!

## Getting Help

- **Build Issues**: Check GitHub Actions logs
- **Type Errors**: Run `pnpm check` locally
- **Webflow Issues**: Verify CDN URL in browser Network tab
- **Git Conflicts**: Use `pnpm push` instead of `git push`
