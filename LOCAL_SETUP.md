# CTM Thika Land Surveyors - Local Development Setup Guide

This comprehensive guide will help you set up the CTM Thika Land Surveyors Next.js project on your local VS Code environment.

## System Requirements

### Minimum Requirements
- **Node.js**: v20.x LTS or v22.x LTS
- **npm**: v10.x or higher (comes with Node.js)
- **RAM**: 8GB minimum
- **Disk Space**: 5GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Recommended Setup
- Node.js v22.x LTS
- VS Code 1.95+
- 16GB+ RAM for optimal development experience

---

## Installation Steps

### Step 1: Install Node.js and npm

#### Windows
1. Download Node.js LTS from [nodejs.org](https://nodejs.org)
2. Run the installer and follow the setup wizard
3. Verify installation by opening Command Prompt and running:
   ```bash
   node --version
   npm --version
   ```

#### macOS
```bash
# Using Homebrew (recommended)
brew install node@22

# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js LTS
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Step 2: Clone or Extract Project Files

```bash
# Navigate to your desired directory
cd ~/projects

# Clone the repository (if using Git)
git clone <repository-url> ctm-thika-surveyors

# Or extract the ZIP file to the project directory
cd ctm-thika-surveyors
```

### Step 3: Install Dependencies

Navigate to the project root directory and run:

```bash
# Clear npm cache (recommended for fresh installs)
npm cache clean --force

# Install dependencies with legacy peer deps support
npm install --legacy-peer-deps

# Verify dependencies are installed
ls -la node_modules/ | head -20
```

### Step 4: Verify Database Configuration

```bash
# Check database schema integrity
npx drizzle-kit check

# Expected output: "✓ Schema is valid and ready"
```

### Step 5: Start Development Server

```bash
# Start Next.js development server
npm run dev

# Expected output:
# > next dev
# 
# ▲ Next.js 16.2.6
# - Local: http://localhost:3000
# - Environments: .env.local
#
# ✓ Ready in 3.2s
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## VS Code Setup

### Recommended Extensions

The project includes a recommended extensions list. VS Code will prompt you to install them:

1. **ESLint** - Code quality and linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - CSS utility autocompletion
4. **TypeScript Vue Plugin** - Enhanced TypeScript support
5. **GitLens** - Git integration and blame information

### Auto-Install Extensions

To install all recommended extensions automatically:

1. Open VS Code Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type `Extensions: Show Recommended Extensions`
3. Click "Install All" for workspace recommendations

### VS Code Workspace Features

The project includes pre-configured workspace settings that automatically:

- Format code on save with Prettier
- Run ESLint checks on save
- Enable Tailwind CSS IntelliSense
- Configure proper TypeScript path aliases
- Set up terminal environment variables

---

## Environment Variables Setup

### Create Local Environment File

```bash
# Copy the example environment file
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local` with your configuration:

```bash
# Database Configuration (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Common Development Tasks

### Running Development Server

```bash
npm run dev
```

**Access Points:**
- Main App: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- API Routes: http://localhost:3000/api

### Building for Production

```bash
npm run build
npm start
```

### Linting and Code Quality

```bash
# Run ESLint checks
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

### Database Operations

```bash
# Check schema validity
npx drizzle-kit check

# Generate migration files
npx drizzle-kit generate

# Push changes to database
npx drizzle-kit push

# Open Drizzle Studio (visual database editor)
npx drizzle-kit studio
```

---

## Troubleshooting Guide

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Or use a different port:
npm run dev -- -p 3001
```

### Issue: TypeScript Errors in VS Code

**Solution:**
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type `TypeScript: Restart TS Server`
3. Press Enter

### Issue: Git Conflicts After Updates

**Solution:**
```bash
# Stash local changes
git stash

# Pull latest changes
git pull origin main

# Reapply local changes
git stash pop
```

### Issue: Database Connection Errors

**Solution:**
```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Check database connectivity
npx drizzle-kit check

# Restart dev server
npm run dev
```

---

## VS Code Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+K Ctrl+F` | Format Document |
| `Ctrl+Shift+L` | Select All Occurrences |
| `F12` | Go to Definition |
| `Ctrl+H` | Find and Replace |
| `Ctrl+J` | Toggle Terminal |
| `Ctrl+\` | Split Editor |

---

## Performance Optimization

### Disable Unneeded Extensions

In VS Code:
1. Open Extensions (`Ctrl+Shift+X`)
2. Disable extensions you don't use
3. Reload VS Code

### Clear Next.js Cache

```bash
# Remove .next directory
rm -rf .next

# Rebuild on next dev run
npm run dev
```

### Optimize npm Install Speed

```bash
# Use npm ci for faster installs (recommended in CI/CD)
npm ci --legacy-peer-deps
```

---

## Deployment Checklist

Before pushing to production:

- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Test all API endpoints
- [ ] Verify environment variables in production
- [ ] Check database backups
- [ ] Test on multiple browsers and devices
- [ ] Review console for warnings/errors
- [ ] Load test with expected traffic volume

---

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team

---

## Support and Troubleshooting

For issues or questions:

1. Check the troubleshooting section above
2. Review console logs for error messages
3. Check `.next/telemetry` for Next.js diagnostics
4. Open an issue on GitHub with:
   - Full error message
   - Steps to reproduce
   - System information (OS, Node version)
   - Screenshot if applicable

---

**Last Updated**: December 2024
**Maintained By**: CTM Thika Development Team
