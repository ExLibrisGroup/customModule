# Release Guide

## Release Types

This project supports two types of releases:

### 1. Latest Release (Rolling)
- **Trigger**: Push to `main` branch
- **Tag**: `latest`
- **GitHub URL**: `https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/latest/TalisAspireIntegration.zip`
- **S3 URL**: `https://{bucket}.s3.{region}.amazonaws.com/{prefix}latest/TalisAspireIntegration.zip`
- **Purpose**: Always contains the most recent build from main
- **Use case**: Users who want automatic updates

### 2. Versioned Releases (Stable)
- **Trigger**: Push a tag matching `v*` (e.g., `v1.0.0`, `v1.2.3`, `v2.0.0-beta.1`)
- **Tag**: The version tag you create
- **GitHub URL**: `https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/v1.0.0/TalisAspireIntegration.zip`
- **S3 URL**: `https://{bucket}.s3.{region}.amazonaws.com/{prefix}v1.0.0/TalisAspireIntegration.zip`
- **Purpose**: Permanent snapshot for production deployments
- **Use case**: Rollback capability

## Creating a Versioned Release

### Step 1: Prepare your release
```bash
# Ensure your main branch is up to date
git checkout main
git pull origin main

# Test the build locally
npm run build
```

### Step 2: Create and push a tag
```bash
# Create a tag with semantic versioning
git tag v1.0.0

# Or create a tag with a message
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial production release"

# Push the tag to GitHub
git push origin v1.0.0
```

### Step 3: GitHub Actions automatically builds and publishes
The workflow will:
1. Run tests
2. Build the project
3. Create a GitHub Release for the tag with the zip attached
4. Upload the zip to S3 at the versioned path (`{prefix}v1.0.0/`)
5. Copy the zip to S3 at the `{prefix}latest/` path
6. Include both the GitHub and S3 download URLs in the release notes

## Version Numbering (Semantic Versioning)

Use semantic versioning: `vMAJOR.MINOR.PATCH`

- **MAJOR** (v2.0.0): Breaking changes, incompatible API changes
- **MINOR** (v1.1.0): New features, backwards compatible
- **PATCH** (v1.0.1): Bug fixes, backwards compatible

### Examples:
- `v1.0.0` - First stable release
- `v1.1.0` - Added new component
- `v1.1.1` - Fixed bug in component
- `v2.0.0` - Changed integration method (breaking change)
- `v2.1.0-beta.1` - Pre-release version for testing

## Customer Deployment URLs

Each release publishes the zip to both GitHub Releases and S3. Either URL can be used.

### Latest (rolling) — GitHub:
```
https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/latest/TalisAspireIntegration.zip
```

### Latest (rolling) — S3:
```
https://{bucket}.s3.{region}.amazonaws.com/{prefix}latest/TalisAspireIntegration.zip
```

### Specific version — GitHub:
```
https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/v1.0.0/TalisAspireIntegration.zip
```

### Specific version — S3:
```
https://{bucket}.s3.{region}.amazonaws.com/{prefix}v1.0.0/TalisAspireIntegration.zip
```

> The exact S3 URLs for each release are listed in the release notes on GitHub.

## Rollback Strategy

If a release has issues:

1. **Quick fix**: Push a new tag (e.g., `v1.0.1`) with the fix
2. **Rollback**: Direct customers to use a previous version URL — both the GitHub and S3 versioned URLs remain permanently available

```
https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/v1.0.0/TalisAspireIntegration.zip
```

## Deleting a Tag (if needed)

```bash
# Delete locally
git tag -d v1.0.0

# Delete remotely
git push origin :refs/tags/v1.0.0
```

**Note**: Deleting a tag will also delete the associated GitHub Release. The zip will remain in S3 at the versioned path unless manually removed.
