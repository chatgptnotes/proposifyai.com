# Accessibility Implementation Guide

## Overview

This guide provides comprehensive documentation for implementing and using accessibility features in Proposify AI. The application follows WCAG 2.1 Level AA standards for accessibility.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Features](#core-features)
3. [Components](#components)
4. [Utilities](#utilities)
5. [React Hooks](#react-hooks)
6. [CSS Accessibility](#css-accessibility)
7. [Testing Accessibility](#testing-accessibility)
8. [Best Practices](#best-practices)

## Quick Start

### Basic Setup

The accessibility features are already integrated into the root layout:

```tsx
import SkipLinks from "@/components/SkipLinks";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SkipLinks />
        <main id="main-content" role="main">
          {children}
        </main>
        <footer id="footer" role="contentinfo">
          <VersionFooter />
        </footer>
      </body>
    </html>
  );
}
```

## Core Features

### 1. Skip Links

Allow keyboard users to skip to main content sections.

**Features:**
- Only visible on keyboard focus
- Smooth scroll to target
- Customizable link list
- Handles focus management

**Usage:**
```tsx
import SkipLinks from "@/components/SkipLinks";

// Default skip links (main content, navigation, footer)
<SkipLinks />

// Custom skip links
<SkipLinks
  links={[
    { id: 'skip-main', label: 'Skip to content', href: '#main-content' },
    { id: 'skip-search', label: 'Skip to search', href: '#search' }
  ]}
/>
```

### 2. Visually Hidden Content

Hide content visually while keeping it accessible to screen readers.

**Features:**
- Screen reader only content
- Focusable variant (visible on focus)
- Customizable element type
- Accessible by default

**Usage:**
```tsx
import { VisuallyHidden } from "@/components/VisuallyHidden";

// Screen reader only
<VisuallyHidden>
  Additional context for screen readers
</VisuallyHidden>

// Visible on focus
<VisuallyHidden focusable>
  Press Enter to activate
</VisuallyHidden>

// Custom element
<VisuallyHidden as="h2">
  Hidden heading for structure
</VisuallyHidden>
```

### 3. Semantic HTML Landmarks

Proper structure for assistive technology navigation:

```tsx
<header role="banner">
  <nav id="main-nav" role="navigation">
    {/* Navigation */}
  </nav>
</header>

<main id="main-content" role="main">
  {/* Main content */}
</main>

<footer id="footer" role="contentinfo">
  {/* Footer */}
</footer>
```

## Components

### Accessible Button

```tsx
import { getButtonAriaProps } from "@/lib/accessibility/aria-helpers";

function AccessibleButton({ onClick, disabled, pressed }) {
  const ariaProps = getButtonAriaProps("Save changes", {
    disabled,
    pressed,
    describedBy: "save-help"
  });

  return (
    <button onClick={onClick} {...ariaProps}>
      Save
    </button>
  );
}
```

### Accessible Modal/Dialog

```tsx
import { useModal } from "@/lib/accessibility/hooks";

function Modal({ isOpen, onClose }) {
  const { modalProps, titleProps, descriptionProps } = useModal(isOpen);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div {...modalProps} className="modal">
        <h2 {...titleProps}>Modal Title</h2>
        <p {...descriptionProps}>Modal description</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### Accessible Tabs

```tsx
import { useTabs } from "@/lib/accessibility/hooks";

function TabComponent() {
  const {
    selectedTab,
    getTabProps,
    getTabPanelProps,
    getTabListProps,
    setTotalTabs
  } = useTabs(0);

  // Set total tabs for navigation
  setTotalTabs(3);

  return (
    <div>
      <div {...getTabListProps()}>
        <button {...getTabProps(0, "First Tab")}>Tab 1</button>
        <button {...getTabProps(1, "Second Tab")}>Tab 2</button>
        <button {...getTabProps(2, "Third Tab")}>Tab 3</button>
      </div>

      <div {...getTabPanelProps(0, "First Tab")}>
        Content 1
      </div>
      <div {...getTabPanelProps(1, "Second Tab")}>
        Content 2
      </div>
      <div {...getTabPanelProps(2, "Third Tab")}>
        Content 3
      </div>
    </div>
  );
}
```

### Accessible Disclosure (Expandable)

```tsx
import { useDisclosure } from "@/lib/accessibility/hooks";

function ExpandableSection() {
  const { isOpen, toggle, buttonProps, panelProps } = useDisclosure(false);

  return (
    <div>
      <button {...buttonProps}>
        {isOpen ? 'Collapse' : 'Expand'} Details
      </button>
      <div {...panelProps}>
        {isOpen && <p>Hidden content</p>}
      </div>
    </div>
  );
}
```

### Accessible Menu

```tsx
import {
  getMenuAriaProps,
  getMenuItemAriaProps
} from "@/lib/accessibility/aria-helpers";

function DropdownMenu() {
  const menuProps = getMenuAriaProps("Options", {
    expanded: true
  });

  const menuItemProps = getMenuItemAriaProps("Edit", {
    disabled: false
  });

  return (
    <div {...menuProps}>
      <button {...menuItemProps}>Edit</button>
      <button {...getMenuItemAriaProps("Delete")}>Delete</button>
    </div>
  );
}
```

## Utilities

### ARIA Helpers

Located in `lib/accessibility/aria-helpers.ts`

#### Generate Unique IDs

```tsx
import { generateAriaId } from "@/lib/accessibility/aria-helpers";

const labelId = generateAriaId('label');
const inputId = generateAriaId('input');

<label id={labelId} htmlFor={inputId}>Name</label>
<input id={inputId} aria-labelledby={labelId} />
```

#### Screen Reader Announcements

```tsx
import { announceToScreenReader } from "@/lib/accessibility/aria-helpers";

function handleSave() {
  // Save logic...
  announceToScreenReader("Changes saved successfully", "polite");
}

function handleError() {
  // Error handling...
  announceToScreenReader("Error saving changes", "assertive");
}
```

### Keyboard Navigation

Located in `lib/accessibility/keyboard-nav.ts`

#### Arrow Key Navigation

```tsx
import { handleArrowNavigation } from "@/lib/accessibility/keyboard-nav";

function ListComponent({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    handleArrowNavigation(event, {
      currentIndex,
      itemCount: items.length,
      onNavigate: setCurrentIndex,
      orientation: 'vertical',
      loop: true
    });
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <div
          key={item.id}
          tabIndex={currentIndex === index ? 0 : -1}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

#### Focus Trap (for Modals)

```tsx
import { createFocusTrap } from "@/lib/accessibility/keyboard-nav";

function Modal({ isOpen }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      trapRef.current = createFocusTrap(modalRef.current);
      trapRef.current.activate();
    }

    return () => {
      trapRef.current?.deactivate();
    };
  }, [isOpen]);

  return <div ref={modalRef}>{/* Modal content */}</div>;
}
```

#### Keyboard Shortcuts

```tsx
import { KeyboardShortcutManager } from "@/lib/accessibility/keyboard-nav";

const shortcutManager = new KeyboardShortcutManager();

// Register shortcuts
shortcutManager.register({
  id: 'save',
  key: 's',
  ctrl: true,
  description: 'Save document',
  callback: () => handleSave()
});

shortcutManager.register({
  id: 'search',
  key: '/',
  description: 'Focus search',
  callback: () => searchInput.focus()
});

// Activate shortcuts
shortcutManager.activate();

// Deactivate when needed
shortcutManager.deactivate();
```

## React Hooks

### useFocusTrap

```tsx
import { useFocusTrap } from "@/lib/accessibility/hooks";

function Modal({ isOpen }) {
  const containerRef = useFocusTrap(isOpen);

  return (
    <div ref={containerRef}>
      {/* Focus trapped here when isOpen is true */}
    </div>
  );
}
```

### useAriaId

```tsx
import { useAriaId } from "@/lib/accessibility/hooks";

function FormField() {
  const labelId = useAriaId('label');
  const inputId = useAriaId('input');
  const helpId = useAriaId('help');

  return (
    <div>
      <label id={labelId} htmlFor={inputId}>Name</label>
      <input
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={helpId}
      />
      <span id={helpId}>Enter your full name</span>
    </div>
  );
}
```

### useScreenReader

```tsx
import { useScreenReader } from "@/lib/accessibility/hooks";

function SaveButton() {
  const announce = useScreenReader();

  const handleSave = async () => {
    try {
      await saveData();
      announce("Changes saved successfully", "polite");
    } catch (error) {
      announce("Error saving changes", "assertive");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### useKeyboardShortcuts

```tsx
import { useKeyboardShortcuts } from "@/lib/accessibility/hooks";

function Editor() {
  useKeyboardShortcuts([
    {
      id: 'save',
      key: 's',
      ctrl: true,
      description: 'Save',
      callback: handleSave
    },
    {
      id: 'undo',
      key: 'z',
      ctrl: true,
      description: 'Undo',
      callback: handleUndo
    }
  ], true);

  return <div>{/* Editor content */}</div>;
}
```

### useAutoFocus

```tsx
import { useAutoFocus } from "@/lib/accessibility/hooks";

function SearchModal({ isOpen }) {
  const inputRef = useAutoFocus(isOpen);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Search..." />
    </div>
  );
}
```

### useRestoreFocus

```tsx
import { useRestoreFocus } from "@/lib/accessibility/hooks";

function Modal({ isOpen }) {
  // Automatically restores focus when modal closes
  useRestoreFocus();

  if (!isOpen) return null;

  return <div>{/* Modal content */}</div>;
}
```

### useReducedMotion

```tsx
import { useReducedMotion } from "@/lib/accessibility/hooks";

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: prefersReducedMotion ? 0 : 20
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3
      }}
    >
      Content
    </motion.div>
  );
}
```

### useLiveRegion

```tsx
import { useLiveRegion } from "@/lib/accessibility/hooks";

function StatusMessage({ message, priority = "polite" }) {
  useLiveRegion(message, priority);

  return <div>{message}</div>;
}
```

### useInViewport

```tsx
import { useInViewport } from "@/lib/accessibility/hooks";

function LazyLoadComponent() {
  const { ref, isInView } = useInViewport({ threshold: 0.5 });

  return (
    <div ref={ref}>
      {isInView ? <ExpensiveComponent /> : <Placeholder />}
    </div>
  );
}
```

## CSS Accessibility

### Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus):not(:focus-within) {
  /* Same as sr-only */
}
```

### Focus Visible Styles

```css
*:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  * {
    border-color: currentColor;
  }

  button,
  a {
    text-decoration: underline;
  }
}
```

### Disabled State

```css
button:disabled,
[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

### Loading State

```css
[aria-busy="true"] {
  cursor: wait;
}
```

## Testing Accessibility

### Keyboard Navigation Testing

1. **Tab Navigation**
   - Tab through all interactive elements
   - Verify focus order is logical
   - Check focus indicators are visible

2. **Arrow Key Navigation**
   - Test arrow keys in menus and lists
   - Verify Home/End keys work
   - Check Page Up/Page Down

3. **Keyboard Shortcuts**
   - Test all registered shortcuts
   - Verify shortcuts don't conflict
   - Check modal focus trapping

### Screen Reader Testing

1. **VoiceOver (macOS)**
   ```bash
   # Enable: Cmd + F5
   # Navigate: Control + Option + Arrow keys
   # Interact: Control + Option + Space
   ```

2. **NVDA (Windows)**
   ```bash
   # Start: Control + Alt + N
   # Navigate: Arrow keys
   # Interact: Enter/Space
   ```

3. **JAWS (Windows)**
   ```bash
   # Start: JAWS application
   # Navigate: Arrow keys
   # Forms mode: Enter/Space
   ```

### Testing Checklist

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Heading hierarchy is correct (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Keyboard navigation works without mouse
- [ ] Focus indicators are visible
- [ ] Skip links are present
- [ ] ARIA labels are meaningful
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Modals trap focus
- [ ] Reduced motion is respected

### Automated Testing Tools

1. **axe DevTools Browser Extension**
   - Install from Chrome/Firefox store
   - Run on each page
   - Fix all violations

2. **Lighthouse (Chrome DevTools)**
   - Run accessibility audit
   - Target 95+ score
   - Address all issues

3. **pa11y (CLI)**
   ```bash
   npm install -g pa11y
   pa11y http://localhost:3000
   ```

4. **jest-axe (Unit Tests)**
   ```tsx
   import { axe, toHaveNoViolations } from 'jest-axe';
   expect.extend(toHaveNoViolations);

   test('should not have accessibility violations', async () => {
     const { container } = render(<Component />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

## Best Practices

### 1. Semantic HTML

✅ **Good:**
```tsx
<button onClick={handleClick}>Submit</button>
<nav><ul><li><a href="/">Home</a></li></ul></nav>
```

❌ **Bad:**
```tsx
<div onClick={handleClick}>Submit</div>
<div><div><span><a href="/">Home</a></span></div></div>
```

### 2. Keyboard Accessibility

✅ **Good:**
```tsx
<button onKeyDown={handleKeyDown} onClick={handleClick}>
  Action
</button>
```

❌ **Bad:**
```tsx
<div onClick={handleClick}>Action</div>
```

### 3. ARIA Labels

✅ **Good:**
```tsx
<button aria-label="Close dialog">×</button>
<input aria-describedby="email-help" />
```

❌ **Bad:**
```tsx
<button>×</button>
<input />
```

### 4. Focus Management

✅ **Good:**
```tsx
// Restore focus after modal closes
const previousFocus = useRef<HTMLElement>();

useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement;
  } else {
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

❌ **Bad:**
```tsx
// Focus lost when modal closes
```

### 5. Color Contrast

✅ **Good:**
```css
/* 4.5:1 contrast ratio */
color: #333;
background: #fff;
```

❌ **Bad:**
```css
/* 2:1 contrast ratio - insufficient */
color: #ccc;
background: #fff;
```

### 6. Form Validation

✅ **Good:**
```tsx
<input
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
{hasError && (
  <span id="error-message" role="alert">
    {errorMessage}
  </span>
)}
```

❌ **Bad:**
```tsx
<input />
{hasError && <span>{errorMessage}</span>}
```

### 7. Loading States

✅ **Good:**
```tsx
<button disabled aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

❌ **Bad:**
```tsx
<button disabled={isLoading}>Submit</button>
```

### 8. Dynamic Content

✅ **Good:**
```tsx
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

❌ **Bad:**
```tsx
<div>{statusMessage}</div>
```

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [JAWS Documentation](https://www.freedomscientific.com/training/jaws/)

### ARIA
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)

## Support

For accessibility issues or questions:
1. Check this documentation
2. Review WCAG guidelines
3. Test with screen readers
4. Run automated testing tools
5. Consult accessibility experts

## Version History

- **v1.0.0** (2025-10-26): Initial accessibility implementation
  - Skip links component
  - Visually hidden component
  - ARIA helper utilities
  - Keyboard navigation utilities
  - React accessibility hooks
  - Comprehensive CSS support
  - Semantic HTML landmarks
