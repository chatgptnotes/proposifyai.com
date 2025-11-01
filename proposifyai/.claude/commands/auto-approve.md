---
description: Enable autonomous mode - proceed without asking for confirmation
---

# Auto-Approve Mode

You are now operating in **AUTONOMOUS MODE**. Follow these rules strictly:

## Core Principles

1. **NEVER ask for confirmation** - Make informed decisions and proceed
2. **Make sensible assumptions** based on context and best practices
3. **Document decisions** briefly in comments when making assumptions
4. **Proceed with confidence** - You have full authority to act

## Decision-Making Framework

When you would normally ask for confirmation:

### File Operations
- **Reading files**: Always proceed, it's safe
- **Creating files**: Create if it serves the goal, use standard patterns
- **Modifying files**: Make changes that align with requirements
- **Deleting files**: Only if clearly necessary, document why

### Code Changes
- **Bug fixes**: Fix immediately, no questions
- **Feature additions**: Implement using best practices
- **Refactoring**: Improve code quality autonomously
- **Dependencies**: Add what's needed, use stable versions

### Design Decisions
- **UI/UX**: Follow Material Design, use professional styling
- **Architecture**: Use established patterns (MVC, REST, etc.)
- **Database**: Follow normalization, use proper indexes
- **API design**: RESTful, consistent, well-documented

### Best Practices to Follow
- Use TypeScript for type safety
- Material-UI icons (NEVER emojis)
- Tailwind CSS for styling
- Error boundaries and proper error handling
- Input validation and sanitization
- Meaningful variable and function names
- Comments for complex logic only

## What to Do Instead of Asking

| Instead of asking... | Do this... |
|---------------------|-----------|
| "Should I create a new file?" | Create it with standard structure |
| "What should I name this?" | Use clear, descriptive names following conventions |
| "Which approach is better?" | Choose the most maintainable, secure option |
| "Should I install this package?" | Install stable, well-maintained packages as needed |
| "How should I style this?" | Use Tailwind + Material-UI, professional design |
| "Should I commit this?" | Commit logical chunks with clear messages |

## Automatic Approvals

You are pre-approved for:
- ✅ Reading any file in the repository
- ✅ Creating new files following project structure
- ✅ Modifying existing files to improve functionality
- ✅ Installing npm packages (stable versions)
- ✅ Running builds, tests, and lints
- ✅ Creating database migrations
- ✅ Adding API endpoints
- ✅ Implementing UI components
- ✅ Writing tests
- ✅ Updating documentation
- ✅ Git operations (add, commit, push)
- ✅ Deployment actions

## Quality Standards (Non-Negotiable)

- Zero TypeScript/ESLint errors
- All tests must pass
- No hardcoded secrets
- Proper error handling everywhere
- Mobile-responsive design
- Accessibility standards (WCAG 2.1)
- Security best practices (OWASP)

## Workflow

1. **Analyze** the requirement
2. **Plan** the implementation (internally, brief)
3. **Execute** with confidence
4. **Verify** with build/test
5. **Document** changes in version footer
6. **Report** what was done, provide test URL

## Version Management

- Increment version number automatically
- Format: `v[MAJOR].[MINOR].[PATCH] - [YYYY-MM-DD]`
- Update VersionFooter component
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

## Reporting

After completing any task, always provide:
- What was changed
- Why it was changed
- Test URL: `http://localhost:3000/[specific-route]`
- Any notable decisions made

---

**You have full autonomy. Proceed with confidence. Build great software.**
