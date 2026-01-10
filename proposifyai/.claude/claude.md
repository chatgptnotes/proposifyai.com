# Claude Code - Autonomous Development Mode

## MISSION
Build and ship Proposify AI (proposifyai.com) - an AI-powered proposal generation platform with comprehensive customization, formatting, and content management features. Operate autonomously without asking for user confirmation.

## TECH STACK & TARGETS
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Styling**: Tailwind CSS, Material-UI Icons (NO EMOJIS)
- **Deployment**: Vercel
- **Database**: Supabase PostgreSQL with Row Level Security

## REPO/ENV
- **Repo**: `/Users/murali/1backup/Poposifyai.com/proposifyai`
- **Package Manager**: npm
- **OS**: macOS (Darwin 24.6.0)

## OPERATING RULES

### Autonomy
- **Do not ask for confirmation**. Make sensible assumptions and proceed.
- Work in tight, verifiable increments. After each increment, run tests/build locally.
- If a path is blocked, pick the best alternative and continue. Document deviations briefly.
- Prefer simplicity, security, and maintainability. Production-grade by default.
- Instrument with basic logs/metrics. Add minimal docs so another dev can run it.

### Code Quality
- **Zero TypeScript/ESLint errors**
- **No emojis in code or documents** - Use Material-UI icons in code, text-based indicators in documents
- No secrets in code. Use env vars.
- Validate inputs. Rate-limit risky endpoints.
- Handle all errors gracefully with user-visible messages.

### Development Workflow
1. **PLAN**: Write concise step plan (max 10 bullets)
2. **EXECUTE**: Implement the next step
3. **VERIFY**: Run build/tests/lint; fix errors immediately
4. **LOG**: Output what changed and next step
5. **CONTINUE**: Proceed automatically until complete

### Version Control
- Always include version footer in the application
- Format: `v[MAJOR].[MINOR].[PATCH] - [YYYY-MM-DD]`
- Increment version on each significant change:
  - MAJOR: Breaking changes or major feature additions
  - MINOR: New features, significant improvements
  - PATCH: Bug fixes, small improvements
- Display in grayed out footer text
- Version starts at 1.0 and increments with each Git push

### Testing & Deployment
- After completing each task, provide local testing URL
- Format: `http://localhost:3000` or specific route
- Test all features before marking complete
- Ensure builds pass: `npm run build`

## DELIVERABLES (must all be produced)

1. ✅ Working code committed with meaningful messages
2. ✅ Scripted setup & run: `npm install`, `npm run dev`, `npm run build`
3. ⏳ Tests covering core logic
4. ✅ ENV example: `.env.example` with placeholders
5. ⏳ README.md: quickstart, env vars, commands, deploy steps
6. ✅ Error handling: graceful failures + user messages
7. ⏳ Lint/format: config + `npm run lint` command
8. ⏳ CHANGELOG of what was built and what's next

## CURRENT FEATURE SET

### Completed Features
- ✅ User authentication (Supabase Auth)
- ✅ Proposal CRUD operations
- ✅ AI-powered proposal generation (OpenAI GPT-4)
- ✅ Real-time editing with contentEditable
- ✅ AI text selection and modification
- ✅ PDF generation and preview
- ✅ Email sending with cover letter
- ✅ Logo upload and customization (position, size, layout)
- ✅ Color customization
- ✅ A4 document proportions
- ✅ Additional context field for AI
- ✅ Header/Footer customization with modern letterhead design
- ✅ White bordered logos with professional styling
- ✅ Contemporary gradient backgrounds

### In Progress
- ⏳ Autonomous confirmation system
- ⏳ Slash command for auto-approval
- ⏳ Subagent for confirmation handling

### Pending Features
- 🔜 Comprehensive testing suite
- 🔜 Documentation updates
- 🔜 Lint configuration
- 🔜 CHANGELOG maintenance

## DATABASE SCHEMA

### Tables
1. **profiles** - User profiles and subscriptions
2. **proposals** - Core proposals with content and metadata
3. **templates** - Reusable templates
4. **content_library** - Reusable content with vector embeddings
5. **saved_content** - Frequently used content snippets
6. **formatting_preferences** - Company and per-proposal formatting
7. **ai_interactions** - AI API call logs for billing
8. **proposal_analytics** - Engagement tracking
9. **client_intelligence** - AI-gathered client data
10. **pricing_intelligence** - AI pricing recommendations

## API ROUTES

### Implemented
- `/api/auth/*` - Authentication endpoints
- `/api/proposals` - Proposal CRUD
- `/api/ai/generate` - AI proposal generation
- `/api/ai/modify-text` - AI text modification
- `/api/saved-content` - Saved content CRUD
- `/api/saved-content/[id]` - Individual content operations
- `/api/formatting-preferences` - Formatting CRUD
- `/api/user/profile` - User profile with header/footer customization

## IF BLOCKED
- Use mocks, stubs, or local emulators
- If external key missing, mock and isolate behind interface
- If dependency fails, choose stable alternative and continue
- Document workarounds in comments

## QUALITY BARS
- Zero TypeScript/ESLint errors
- No failing tests
- No unhandled promise rejections
- No secrets in code
- Docs match actual commands
- All features tested on local/staging before production

## FINAL HANDOFF REQUIREMENTS
- Exact run/deploy commands
- Local URL: `http://localhost:3000`
- Deployed URL: Vercel deployment link
- Admin test credentials (if applicable)
- Operations note: backups, logs, env rotation

## AVAILABLE SKILLS

### Proposal Generation
- `generate-business-proposal.md` - Full business proposals with scope, timeline, pricing
- `generate-effort-estimate-proposal.md` - Technical effort estimates for change requests
- `generate-aml-compliance-proposal.md` - Regulated industry compliance proposals
- `generate-ai-ml-proposal.md` - AI/ML project proposals
- `generate-kitchen-management-proposal.md` - Bettroi Kitchen Management proposals

### Invoicing & Financials
- `generate-advance-invoice.md` - Advance payment invoices (milestone-based)
- `generate-final-invoice.md` - Final payment invoices
- `generate-full-invoice.md` - Full payment invoices (single payment)

### Project Management
- `generate-milestone-status-report.md` - Progress reports aligned with POs
- `bettroi-quotation-skill-template.md` - Quotation template for Bettroi projects

---

**Current Version**: v3.6.0 - 2025-12-27
**Status**: Active Development - Autonomous Mode Enabled
**Last Updated**: 2025-12-27
