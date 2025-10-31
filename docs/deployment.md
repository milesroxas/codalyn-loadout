# jsDelivr CDN Deployment Guide

## Overview
This project automatically publishes compiled assets to jsDelivr CDN on every push to `main` that modifies source files. This enables seamless Webflow integration with auto-updating scripts.

## How It Works

### Automatic Deployment
The GitHub workflow (`.github/workflows/publish-jsdelivr.yml`) triggers when you push changes to:
- `src/**` - Source code
- `bin/**` - Build scripts
- `package.json` - Dependencies
- `pnpm-lock.yaml` - Lock file
- `tsconfig.json` - TypeScript config

The workflow:
1. Builds production assets (`pnpm build`)
2. Commits `dist/` files back to the repository
3. jsDelivr automatically picks up the changes from GitHub

## Usage in Webflow

### Latest Version (Auto-updating)
Use this for production sites that should always get the latest updates:

```html
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.css" rel="stylesheet" type="text/css"/>
```

### Pinned Version (Stable)
Use git tags for version pinning (recommended for critical production sites):

```html
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@v1.0.0/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@v1.0.0/dist/index.css" rel="stylesheet" type="text/css"/>
```

### Canary/Preview Version
Create a `canary` branch for testing:

```html
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@canary/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@canary/dist/index.css" rel="stylesheet" type="text/css"/>
```

## Versioning Strategy

### Semantic Versioning
Follow semantic versioning for git tags:
- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features, backward compatible)
- `v1.0.1` - Patch release (bug fixes)

### Creating a Release
```bash
# Create and push a new version tag
git tag v1.0.0
git push origin v1.0.0
```

### Branch Strategy
- `main` - Latest stable code, auto-deploys
- `canary` - Preview/testing branch
- `v1.x` - Version-specific branches (optional)

## Naming Conventions

### Commit Messages
Use conventional commits for clarity:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config)
- `refactor:` - Code restructuring
- `docs:` - Documentation only
- `test:` - Test changes

Example:
```bash
git commit -m "feat: add carousel navigation controls"
git commit -m "fix: resolve mobile viewport overflow"
```

### Git Tags
- Use `v` prefix: `v1.0.0`, `v2.1.3`
- Never delete published tags
- Tag the `main` branch after merging

### File Structure
- `src/` - Source TypeScript/CSS
- `dist/` - Compiled output (auto-generated, committed)
- `bin/` - Build scripts

## Best Practices

### Development Workflow
1. Create feature branch: `git checkout -b feature/carousel-controls`
2. Make changes and test locally: `pnpm dev`
3. Commit with conventional format: `git commit -m "feat: add carousel controls"`
4. Push and create PR: `git push origin feature/carousel-controls`
5. Merge to `main` after review
6. Automatic deployment triggers
7. Create version tag for stable releases

### Webflow Integration
1. **Development sites**: Use `@main` for auto-updates
2. **Production sites**: Use `@v1.0.0` pinned versions
3. **Testing**: Use `@canary` branch
4. Always use `defer` on script tags for performance
5. Place CSS in `<head>`, scripts before `</body>`

### Cache Busting
jsDelivr has automatic cache purging, but force update with:
```html
<!-- Add ?v=timestamp for immediate updates -->
<script src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js?v=20251031"></script>
```

### Rollback Strategy
If a deployment breaks production:
```bash
# Revert the commit
git revert HEAD
git push origin main

# Or point Webflow to previous working tag
# Change @main to @v1.0.0 in Webflow embed
```

## CI/CD Details

### Workflow Triggers
- ✅ Push to `main` with source file changes
- ❌ Documentation-only changes (no trigger)
- ❌ Dist-only commits (prevents infinite loops via `[skip ci]`)

### Build Process
1. Checkout repository
2. Setup pnpm 10+
3. Install dependencies with frozen lockfile
4. Run production build
5. Commit dist files if changed
6. Push back to repository

### Permissions
The workflow has `contents: write` permission to commit dist files back to the repository.

## Monitoring

### Check Deployment Status
View workflow runs: https://github.com/milesroxas/codalyn-loadout/actions

### Verify CDN Updates
jsDelivr updates within 1-2 minutes of commit. Check:
```
https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js
```

### Debugging
- Check GitHub Actions logs for build errors
- Verify `dist/` files were committed
- Test CDN URL directly in browser
- Use browser DevTools Network tab to verify loading

## Security

### Secrets
No secrets required for public repositories. The workflow uses `${{ secrets.GITHUB_TOKEN }}` which is automatically provided.

### Access Control
Only repository maintainers can push to `main`. Use branch protection rules for safety.

## FAQ

**Q: How long until changes appear on Webflow?**
A: ~2-5 minutes (1-2 min GitHub Actions + 1-2 min jsDelivr cache)

**Q: Can I use this for private repositories?**
A: Yes, but jsDelivr won't work. Use GitHub Releases or another CDN.

**Q: What if the build fails?**
A: Check GitHub Actions logs. The workflow won't commit broken builds.

**Q: Should I commit dist/ files manually?**
A: No, the workflow handles this automatically. Keep `dist/` in `.gitignore` locally.
