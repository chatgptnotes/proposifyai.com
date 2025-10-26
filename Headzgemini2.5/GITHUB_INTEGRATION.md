# GitHub Integration Guide for ProposifyAI

## Current Repository

Your project has the following Git remotes configured:
- **origin**: https://github.com/chatgptnotes/Headzgemini2.5.git
- **proposifyai**: https://github.com/chatgptnotes/proposifyai.com.git

## Setting Up Automatic Deployments

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your project settings:
   https://vercel.com/chatgptnotes-6366s-projects/proposifyai-app/settings

2. Navigate to "Git" section

3. Click "Connect Git Repository"

4. Select GitHub and choose:
   - Repository: chatgptnotes/proposifyai.com
   - Or: chatgptnotes/Headzgemini2.5

5. Configure deployment settings:
   - Production Branch: main
   - Enable automatic deployments on push
   - Enable preview deployments for pull requests

### Option 2: Via Vercel CLI

```bash
# Link to specific Git repository
vercel git connect
```

Follow the prompts to connect your GitHub repository.

## Automatic Deployment Workflow

Once connected, deployments will happen automatically:

### Production Deployments
- Trigger: Push to `main` branch
- URL: https://proposifyai.com (and all production aliases)
- Environment: Production variables

### Preview Deployments
- Trigger: Push to any non-main branch or PR
- URL: Unique preview URL for each deployment
- Environment: Preview variables

## GitHub Actions (Optional)

If you want more control, you can set up GitHub Actions for deployments:

### Create `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./proposifyai-app

      - name: Build Project Artifacts
        run: vercel build ${{ github.ref == 'refs/heads/main' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./proposifyai-app

      - name: Deploy to Vercel
        run: vercel deploy ${{ github.ref == 'refs/heads/main' && '--prod' || '--prebuilt' }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./proposifyai-app
```

### Required GitHub Secrets

Add these secrets to your GitHub repository:
1. Go to: https://github.com/chatgptnotes/proposifyai.com/settings/secrets/actions
2. Add new secret: `VERCEL_TOKEN`
   - Get token from: https://vercel.com/account/tokens
3. Add: `VERCEL_ORG_ID` (found in .vercel/project.json)
4. Add: `VERCEL_PROJECT_ID` (found in .vercel/project.json)

## Deployment Protection

### Branch Protection Rules

Set up branch protection for `main`:
1. Go to: https://github.com/chatgptnotes/proposifyai.com/settings/branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Include Vercel deployment check

### Vercel Deployment Protection

Configure in Vercel dashboard:
1. Settings → Deployment Protection
2. Enable:
   - Require approval for production deployments
   - Password protection for preview deployments
   - Vercel Authentication for preview deployments

## Monitoring Deployments

### Via GitHub
- Check Actions tab: https://github.com/chatgptnotes/proposifyai.com/actions
- View deployment status in PR checks

### Via Vercel
- Dashboard: https://vercel.com/chatgptnotes-6366s-projects/proposifyai-app
- Get notifications for deployment status

## Recommended Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```
   → Creates preview deployment

2. **Code Review**:
   - Open PR on GitHub
   - Review preview deployment
   - Request reviews from team

3. **Merge to Production**:
   ```bash
   git checkout main
   git pull origin main
   git merge feature/new-feature
   git push origin main
   ```
   → Deploys to production

## Rollback Strategy

### Via Vercel Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Via CLI
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

## Environment Synchronization

Keep environments in sync:

```bash
# Pull production environment to local
vercel env pull .env.local

# Add new environment variable
vercel env add NEW_VAR production
vercel env add NEW_VAR preview
vercel env add NEW_VAR development
```

## Webhooks for Custom Integrations

Set up webhooks in Vercel:
1. Settings → Git → Deploy Hooks
2. Create hook for specific branch
3. Use webhook URL in your CI/CD pipeline

Example webhook URL:
```
https://api.vercel.com/v1/integrations/deploy/[token]/[project]
```

## Troubleshooting

### Deployment Not Triggering
1. Check Git connection in Vercel dashboard
2. Verify branch name matches production branch setting
3. Check GitHub webhook settings

### Build Failures
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Test build locally: `npm run build`

### Permission Issues
1. Verify GitHub app has repository access
2. Check Vercel team permissions
3. Re-authenticate GitHub connection

## Current Status

- Git Remotes: Configured
- Vercel Project: Created
- GitHub Integration: NOT CONNECTED (manual setup required)
- Auto Deployments: NOT ENABLED

**Next Step**: Connect GitHub repository via Vercel dashboard for automatic deployments.

## Resources

- Vercel Git Integration: https://vercel.com/docs/git
- GitHub Actions: https://docs.github.com/en/actions
- Vercel CLI: https://vercel.com/docs/cli
- Deploy Hooks: https://vercel.com/docs/deploy-hooks
