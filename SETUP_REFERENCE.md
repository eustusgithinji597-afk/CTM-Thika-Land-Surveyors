# Quick Setup Reference - CTM Thika Land Surveyors

**⏱️ Estimated Setup Time: 15-20 minutes**

---

## Fastest Way to Get Started

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
setup.bat
```

#### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

This runs all setup steps automatically and tests the build.

---

### Option 2: Manual Step-by-Step Setup

#### 1. Install Node.js (if not already installed)
- Download from: https://nodejs.org (LTS recommended)
- Verify: `node --version` and `npm --version`

#### 2. Clear Cache & Install Dependencies
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

#### 3. Create Environment File
```bash
cp .env.example .env.local
```

#### 4. Start Development Server
```bash
npm run dev
```

#### 5. Open in Browser
Visit: http://localhost:3000

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting checks
npm run lint

# Database operations
npm run db:check      # Check schema
npm run db:generate   # Generate migrations
npm run db:push       # Push to database
npm run db:studio     # Open visual editor

# Clear npm cache
npm run cache:clear
```

---

## VS Code Setup

1. **Install Extensions** (recommended):
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin

2. **Auto-install** all recommended extensions:
   - Open Command Palette (`Ctrl+Shift+P`)
   - Type: `Extensions: Show Recommended Extensions`
   - Click "Install All"

3. **Workspace Settings**:
   - Already configured in `.vscode/settings.json`
   - Auto-formats on save
   - ESLint checks on save

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows: Find process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux: Find and kill
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Module Errors
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### TypeScript Errors in VS Code
```
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Build Fails
```bash
npm run lint -- --fix
npm run build
```

---

## Environment Variables

**Required for Supabase Integration:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

See `.env.example` for all available options.

---

## System Requirements Check

```bash
# Check Node version
node --version
# Should be v20.x or higher

# Check npm version
npm --version
# Should be v10.x or higher

# List installed packages
npm list --depth=0
```

---

## Next Steps

1. **Read Documentation**:
   - `LOCAL_SETUP.md` - Detailed setup guide
   - `DEPENDENCIES.md` - Package information
   - `SUPABASE_SETUP.md` - Database configuration

2. **Start Development**:
   - `npm run dev` - Start dev server
   - Visit http://localhost:3000
   - Edit files and see changes live (HMR)

3. **Configure Database**:
   - Set up Supabase account
   - Add env variables to `.env.local`
   - Run migrations

4. **Deploy**:
   - Connect to Vercel
   - Push to GitHub
   - Automatic deployments on push

---

## Key Directories

```
project-root/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── landing/           # Landing page components
│   └── admin/             # Admin components
├── lib/                   # Utilities & database
├── public/                # Static assets
├── .vscode/               # VS Code settings
│   ├── settings.json
│   ├── extensions.json
│   └── tasks.json
├── supabase/              # Database migrations
├── .env.example           # Environment template
├── setup.sh/.bat          # Setup scripts
├── LOCAL_SETUP.md         # Detailed guide
├── DEPENDENCIES.md        # Package info
└── package.json           # Project config
```

---

## npm Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run db:check` | Validate database schema |
| `npm run db:generate` | Create migrations |
| `npm run db:push` | Apply migrations |
| `npm run db:studio` | Open database UI |
| `npm run cache:clear` | Clear npm cache |
| `npm run setup` | Full automatic setup |

---

## Performance Tips

1. **Disable unused VS Code extensions**
2. **Use `npm ci` for faster installs** (CI/CD environments)
3. **Clear `.next` folder** if experiencing build issues
4. **Use different port** if 3000 is in use
5. **Check RAM usage** - minimum 8GB recommended

---

## Useful Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+K Ctrl+F` | Format Document |
| `F2` | Rename Symbol |
| `F12` | Go to Definition |
| `Ctrl+H` | Find & Replace |
| `Ctrl+J` | Toggle Terminal |

---

## Common Issues Quick Links

- **Module not found** → See Troubleshooting section
- **Port in use** → Kill process or use different port
- **Build fails** → Run `npm run lint --fix`
- **Database errors** → Check `.env.local` and run `npm run db:check`
- **VS Code errors** → Restart TypeScript server

---

## Help & Support

- **Read**: LOCAL_SETUP.md for detailed instructions
- **Check**: Console logs for error messages
- **Verify**: Environment variables are set
- **Review**: DEPENDENCIES.md for package info
- **Reference**: SUPABASE_SETUP.md for database setup

---

**Setup Guide Last Updated**: December 2024
**Maintained By**: CTM Thika Development Team
