# Project Dependencies & Requirements

Complete dependency manifest for CTM Thika Land Surveyors Next.js project.

## System Requirements

### Node.js Environment
- **Minimum**: Node.js v20.x LTS
- **Recommended**: Node.js v22.x LTS
- **Download**: https://nodejs.org

### Package Manager
- **npm**: v10.x+ (comes with Node.js)
- **Alternative**: pnpm v9.x (optional)

### Hardware
- **RAM**: 8GB minimum, 16GB+ recommended
- **CPU**: Multi-core processor
- **Storage**: 5GB free disk space

---

## Production Dependencies

### Framework & Core
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | React meta-framework for SSR & static generation |
| `react` | 19.2.4 | UI library and component framework |
| `react-dom` | 19.2.4 | React DOM rendering engine |

### Styling & UI
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.3.0 | Utility-first CSS framework |
| `@tailwindcss/postcss` | 4.3.0 | Tailwind PostCSS plugin |
| `postcss` | 8.5.15 | CSS transformation engine |
| `clsx` | 2.1.1 | Conditional CSS class joining |
| `tailwind-merge` | 3.6.0 | Tailwind class conflict resolution |
| `class-variance-authority` | 0.7.1 | Component variant management |
| `tw-animate-css` | 1.4.0 | Additional Tailwind animations |

### Component Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| `@base-ui/react` | 1.5.0 | Headless UI component base |
| `shadcn` | 4.8.0 | Component library CLI |
| `lucide-react` | 1.17.0 | Icon library (1200+ icons) |

### Forms & Validation
| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.78.0 | Performance-focused form library |
| `@hookform/resolvers` | 5.4.0 | Form validation resolvers |
| `zod` | 4.4.3 | TypeScript-first schema validation |

### Database & ORM
| Package | Version | Purpose |
|---------|---------|---------|
| `drizzle-orm` | 0.45.2 | SQL ORM with type safety |
| `pg` | 8.21.0 | PostgreSQL client for Node.js |
| `better-auth` | 1.6.15 | Next.js authentication library |

### Data & Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| `papaparse` | 5.5.3 | CSV parser and stringifier |
| `@supabase/supabase-js` | 2.108.1 | Supabase JavaScript client |
| `@vercel/analytics` | 1.6.1 | Vercel Analytics integration |

---

## Development Dependencies

### Compiler & Type Safety
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.7.3 | Type-safe JavaScript |
| `@types/node` | ^24 | Node.js type definitions |
| `@types/react` | 19.2.14 | React type definitions |
| `@types/react-dom` | 19.2.3 | React DOM type definitions |

### Database Tools
| Package | Version | Purpose |
|---------|---------|---------|
| `drizzle-kit` | 0.31.10 | Drizzle ORM CLI & migrations |

### Build Tools
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | Includes webpack & Turbopack bundler |
| `tailwindcss` | 4.3.0 | CSS processing |

---

## Dependency Installation

### Standard Installation
```bash
npm install
```

### Installation with Legacy Peer Dependency Support
```bash
npm install --legacy-peer-deps
```
Use this if you encounter peer dependency conflicts.

### Clean Installation (Recommended for CI/CD)
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

---

## Optional Dependencies

### Development Tools (Not Included)
These can be installed if needed:

```bash
# Code Quality
npm install --save-dev eslint eslint-config-next prettier

# Testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Git Hooks
npm install --save-dev husky lint-staged

# API Documentation
npm install --save-dev swagger-ui-express
```

---

## Version Pinning Strategy

### Packages with Strict Versions
- `next@16.2.6` - Framework stability
- `react@19.2.4` - Core library
- `react-dom@19.2.4` - Core library
- `typescript@5.7.3` - Type safety

### Packages with Caret (^) Versions
Packages like `lucide-react@1.17.0` allow minor/patch updates:
- `^1.17.0` → `>= 1.17.0 && < 2.0.0`

This ensures bug fixes and minor features while preventing breaking changes.

---

## Known Issues & Solutions

### Peer Dependency Warnings
```
npm WARN @hookform/resolvers@5.4.0 requires react@>=18.0.0
```
**Solution**: Use `--legacy-peer-deps` flag

### Node Module Conflicts
```
npm ERR! peer dep missing: zod@^3.0.0 (install drizzle-orm@0.45.2)
```
**Solution**: Install missing peer dependencies or use `--legacy-peer-deps`

### Build Size Issues
If the build is too large:
```bash
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# Check with: npm run analyze
```

---

## Environment Variables

Create a `.env.local` file with these variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ctm_thika
```

---

## Performance Considerations

### Bundle Size Optimization
- **lucide-react**: Tree-shaken for optimal bundle size
- **clsx & tailwind-merge**: Minimal overhead for class handling
- **zod**: Only validates at runtime when needed

### Tree Shaking
All dependencies support ES modules and tree shaking for optimal production builds.

### Code Splitting
Next.js automatically code-splits at route boundaries.

---

## Updating Dependencies

### Check for Updates
```bash
npm outdated
```

### Update All Dependencies
```bash
npm update
```

### Update Specific Package
```bash
npm install package-name@latest
```

### Major Version Updates
```bash
# Test before upgrading
npm install next@latest
npm run build
npm run dev
```

---

## Compatibility Matrix

| Node.js | npm | Package Manager |
|---------|-----|-----------------|
| v20.x   | 10.x | ✓ Supported |
| v22.x   | 10.x | ✓ Supported (Recommended) |
| v18.x   | 9.x | ⚠ Legacy (may have issues) |

---

## Security Updates

### Audit Dependencies
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
npm audit fix --force  # Force upgrade (may break code)
```

### Regular Updates Recommended
```bash
# Weekly
npm outdated

# Monthly
npm update
npm audit
```

---

## Package Lock Strategy

### Using package-lock.json
- Ensures reproducible installs
- Recommended for production deployments
- Always commit to version control

### Using package-lock.json in CI/CD
```bash
npm ci --legacy-peer-deps
# More reliable than npm install in automated environments
```

---

## Dependency Visualization

```
├── next (Framework Core)
│   ├── react
│   ├── react-dom
│   └── postcss
├── Styling
│   ├── tailwindcss
│   ├── clsx
│   └── tailwind-merge
├── UI Components
│   ├── @base-ui/react
│   └── lucide-react
├── Forms
│   ├── react-hook-form
│   ├── @hookform/resolvers
│   └── zod
├── Database
│   ├── drizzle-orm
│   ├── pg
│   └── better-auth
└── Utilities
    ├── papaparse
    └── @supabase/supabase-js
```

---

## Troubleshooting

### Module Not Found
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
```

### Version Conflicts
```bash
# Check installed version
npm list package-name

# Force specific version
npm install package-name@16.2.6
```

### Slow Installation
```bash
# Use npm ci for faster installs
npm ci --legacy-peer-deps

# Or use pnpm (faster alternative)
npm install -g pnpm
pnpm install
```

---

**Last Updated**: December 2024
**Maintained By**: CTM Thika Development Team
