# Bettroi Proposal Generation - Quick Reference Guide

## 🎯 Simple Prompts to Use

### Quickest Way
```
Generate a Bettroi proposal for [Client Name] for [project description]
```

### Complete Prompt Template
```
Generate a Bettroi proposal with these details:

Client: [Company Name]
Email: [email]
Website: [website]

Project: [Project Title]
Investment: $[amount] USD
Duration: [X Months | Y Sprints | Z Phases]

Key features:
- [Feature 1]
- [Feature 2]
- [Feature 3]
```

## 📋 What Will Be Automatically Included

Every proposal will have these standardized sections:

1. ✅ Executive Summary
2. ✅ **Scope of Work**
   - **In-scope** (what IS included)
   - **Out-of-scope** (what IS NOT included)
3. ✅ Deliverables
4. ✅ Technology Stack
5. ✅ Project Plan and Milestones
6. ✅ Commercials (Year-1)
7. ✅ Client Responsibilities
8. ✅ Important Points
9. ✅ Division of Responsibilities
10. ✅ Acceptance Criteria
11. ✅ Data Privacy & Security
12. ✅ Assumptions
13. ✅ Change Control
14. ✅ Warranty, IP, and Terms
15. ✅ Letter of Intent (LOI)

## 🔑 Critical Section: Inclusions & Exclusions

**Every proposal MUST have:**

### In-scope
```markdown
In-scope
- Feature 1: description
- Feature 2: description
- Technical component: what it includes
- Integration work: specific scope
```

### Out-of-scope
```markdown
Out-of-scope
- What client owns
- Future phase work
- Third-party services not covered
- Specific exclusions
```

## 📝 Example Prompts That Work

### Example 1: AI Project
```
Generate a Bettroi proposal for Tesla Motors for an AI-powered
manufacturing quality control system. Investment is $250,000
over 8 months. Include vision AI, defect detection, and
real-time dashboards.
```

### Example 2: Web Application
```
Generate Bettroi proposal:
Client: Amazon Web Services
Project: Serverless E-commerce Platform
Budget: $150,000
Duration: 6 months | 12 sprints

Features:
- Product catalog with search
- Shopping cart and checkout
- Payment integration
- Admin dashboard
- Analytics and reporting
```

### Example 3: Mobile App
```
Create a proposal for Uber for a React Native driver
onboarding app. $75,000 budget, 4 months timeline.
Include document verification, training modules, and
compliance checks.
```

## 🎨 Standard Bettroi Branding

All proposals automatically include:
- ✅ Bettroi logo header
- ✅ "BETTROI: BETTER BUSINESS" tagline
- ✅ Professional blue color (#003DA5)
- ✅ Reference numbers (BETTROI K##)
- ✅ ERP references (SAL-QTN-YYYY-#####)
- ✅ Footer on every page at bottom
- ✅ 12-page professional format

## 📁 Where Templates Are Stored

```
/templates/bettroi/
├── template.html           # Main template
├── styles.css             # Bettroi styles
├── logo.jpg               # Company logo
├── config.json            # Configuration
├── standard-sections.json # Section definitions
├── section-templates.md   # Section examples
└── README.md              # Documentation
```

## 🛠️ How to Customize

### Update All Future Proposals
1. Edit `templates/bettroi/styles.css` → changes styling
2. Edit `templates/bettroi/config.json` → changes settings
3. Replace `templates/bettroi/logo.jpg` → changes logo

### Create New Template
1. Copy `/templates/bettroi/` to `/templates/[new-client]/`
2. Update branding in config.json
3. Replace logo.jpg
4. Modify styles.css as needed

## ✅ Quality Checklist

Before finalizing any proposal, verify:
- [ ] Executive Summary present
- [ ] **In-scope section exists**
- [ ] **Out-of-scope section exists**
- [ ] All mandatory sections included
- [ ] Client information correct
- [ ] Investment amount accurate
- [ ] Timeline realistic
- [ ] Deliverables specific
- [ ] LOI section at end
- [ ] 12 pages with proper structure
- [ ] Footer at bottom of each page

## 🚨 Common Mistakes to Avoid

❌ **Don't:** Skip the Out-of-scope section
✅ **Do:** Always list what's NOT included

❌ **Don't:** Be vague about deliverables
✅ **Do:** Be specific and measurable

❌ **Don't:** Forget client responsibilities
✅ **Do:** Clearly state what client must provide

❌ **Don't:** Skip assumptions
✅ **Do:** Document all project assumptions

## 📞 Next Time You Need a Proposal

Just say:
```
Generate a Bettroi proposal for [Client] - [Project] - $[Amount]
```

Claude Code will:
1. Ask for any missing details
2. Use the standardized template
3. Include all mandatory sections
4. Add In-scope and Out-of-scope
5. Generate professional 12-page document
6. Verify structure and quality
7. Save as HTML file

---

## 🎯 Remember

**The magic words:** "Generate a Bettroi proposal for..."

That's all you need! The template system handles everything else automatically.

---

**Version:** 1.1.0
**Updated:** November 12, 2025
**Status:** Ready to use! 🚀
