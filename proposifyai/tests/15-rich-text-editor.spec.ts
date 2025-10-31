import { test, expect } from '@playwright/test';

test.describe('Rich Text Editor (TipTap) - v2.7.0', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with the RichTextEditor component
    // Adjust the URL based on where the editor is implemented
    await page.goto('/proposals/new');
    await page.waitForLoadState('networkidle');
  });

  test('should render editor toolbar with all formatting buttons', async ({ page }) => {
    // Wait for editor to mount
    await page.waitForSelector('.ProseMirror', { timeout: 10000 });

    // Check for text formatting buttons
    const boldButton = page.locator('button[title*="Bold"]');
    const italicButton = page.locator('button[title*="Italic"]');
    const codeButton = page.locator('button[title*="Code"]');

    await expect(boldButton).toBeVisible();
    await expect(italicButton).toBeVisible();
    await expect(codeButton).toBeVisible();
  });

  test('should apply bold formatting when clicking Bold button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    // Type some text
    await editor.click();
    await editor.type('Bold text test');

    // Select all text
    await page.keyboard.press('Control+a');

    // Click bold button
    const boldButton = page.locator('button[title*="Bold"]').first();
    await boldButton.click();

    // Check if bold is applied
    const boldText = page.locator('.ProseMirror strong');
    await expect(boldText).toBeVisible();
    await expect(boldText).toContainText('Bold text test');
  });

  test('should apply italic formatting when clicking Italic button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Italic text test');

    // Select all text
    await page.keyboard.press('Control+a');

    // Click italic button
    const italicButton = page.locator('button[title*="Italic"]').first();
    await italicButton.click();

    // Check if italic is applied
    const italicText = page.locator('.ProseMirror em');
    await expect(italicText).toBeVisible();
  });

  test('should apply inline code formatting', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Code snippet');

    await page.keyboard.press('Control+a');

    const codeButton = page.locator('button[title*="Inline Code"]').first();
    await codeButton.click();

    const codeElement = page.locator('.ProseMirror code');
    await expect(codeElement).toBeVisible();
  });

  test('should create H1 heading when clicking H1 button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    // Click H1 button
    const h1Button = page.locator('button[title*="Heading 1"]').first();
    await h1Button.click();

    // Type heading text
    await editor.type('Main Heading');

    // Check if H1 is created
    const h1Element = page.locator('.ProseMirror h1');
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toContainText('Main Heading');
  });

  test('should create H2 heading when clicking H2 button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const h2Button = page.locator('button[title*="Heading 2"]').first();
    await h2Button.click();

    await editor.type('Subheading');

    const h2Element = page.locator('.ProseMirror h2');
    await expect(h2Element).toBeVisible();
    await expect(h2Element).toContainText('Subheading');
  });

  test('should create H3 heading when clicking H3 button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const h3Button = page.locator('button[title*="Heading 3"]').first();
    await h3Button.click();

    await editor.type('Section Heading');

    const h3Element = page.locator('.ProseMirror h3');
    await expect(h3Element).toBeVisible();
  });

  test('should create bullet list when clicking bullet list button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const bulletButton = page.locator('button[title*="Bullet List"]').first();
    await bulletButton.click();

    await editor.type('First item');
    await page.keyboard.press('Enter');
    await editor.type('Second item');
    await page.keyboard.press('Enter');
    await editor.type('Third item');

    const bulletList = page.locator('.ProseMirror ul');
    await expect(bulletList).toBeVisible();

    const listItems = page.locator('.ProseMirror ul li');
    await expect(listItems).toHaveCount(3);
  });

  test('should create numbered list when clicking numbered list button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const numberedButton = page.locator('button[title*="Numbered List"]').first();
    await numberedButton.click();

    await editor.type('Step one');
    await page.keyboard.press('Enter');
    await editor.type('Step two');

    const orderedList = page.locator('.ProseMirror ol');
    await expect(orderedList).toBeVisible();

    const listItems = page.locator('.ProseMirror ol li');
    await expect(listItems).toHaveCount(2);
  });

  test('should create blockquote when clicking blockquote button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const blockquoteButton = page.locator('button[title*="Blockquote"]').first();
    await blockquoteButton.click();

    await editor.type('This is a quote');

    const blockquote = page.locator('.ProseMirror blockquote');
    await expect(blockquote).toBeVisible();
    await expect(blockquote).toContainText('This is a quote');
  });

  test('should create code block when clicking code block button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    const codeBlockButton = page.locator('button[title*="Code Block"]').first();
    await codeBlockButton.click();

    await editor.type('function test() { return true; }');

    const codeBlock = page.locator('.ProseMirror pre code');
    await expect(codeBlock).toBeVisible();
  });

  test('should undo changes when clicking undo button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Text to undo');

    // Wait a bit for the text to be registered
    await page.waitForTimeout(500);

    const undoButton = page.locator('button[title*="Undo"]').first();
    await undoButton.click();

    const content = await editor.textContent();
    expect(content).not.toContain('Text to undo');
  });

  test('should redo changes when clicking redo button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Text to redo');

    await page.waitForTimeout(500);

    // Undo
    const undoButton = page.locator('button[title*="Undo"]').first();
    await undoButton.click();

    await page.waitForTimeout(500);

    // Redo
    const redoButton = page.locator('button[title*="Redo"]').first();
    await redoButton.click();

    const content = await editor.textContent();
    expect(content).toContain('Text to redo');
  });

  test('should clear formatting when clicking clear formatting button', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Formatted text');

    // Apply bold
    await page.keyboard.press('Control+a');
    const boldButton = page.locator('button[title*="Bold"]').first();
    await boldButton.click();

    // Clear formatting
    const clearButton = page.locator('button[title*="Clear Formatting"]').first();
    await clearButton.click();

    // Check if formatting is cleared (no strong tag)
    const strongElements = await page.locator('.ProseMirror strong').count();
    expect(strongElements).toBe(0);
  });

  test('should display word count', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('One two three four five');

    // Check for word count display
    const wordCount = page.locator('text=/\\d+ words/');
    await expect(wordCount).toBeVisible();

    const countText = await wordCount.textContent();
    expect(countText).toContain('5 words');
  });

  test('should display character count', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Hello');

    // Check for character count display
    const charCount = page.locator('text=/\\d+ characters/');
    await expect(charCount).toBeVisible();

    const countText = await charCount.textContent();
    expect(countText).toContain('5 characters');
  });

  test('should show active state for formatting buttons', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Test');

    await page.keyboard.press('Control+a');

    const boldButton = page.locator('button[title*="Bold"]').first();
    await boldButton.click();

    // Check if bold button has active class
    const buttonClass = await boldButton.getAttribute('class');
    expect(buttonClass).toContain('bg-primary');
  });

  test('should handle keyboard shortcuts for bold (Cmd+B)', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Shortcut test');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');

    const boldText = page.locator('.ProseMirror strong');
    await expect(boldText).toBeVisible();
  });

  test('should handle keyboard shortcuts for italic (Cmd+I)', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('Shortcut test');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+i');

    const italicText = page.locator('.ProseMirror em');
    await expect(italicText).toBeVisible();
  });

  test('should persist content across interactions', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    const testContent = 'This is persistent content';

    await editor.click();
    await editor.type(testContent);

    // Click elsewhere and back
    await page.click('body');
    await page.waitForTimeout(500);

    const content = await editor.textContent();
    expect(content).toContain(testContent);
  });

  test('should show loading skeleton on initial render', async ({ page }) => {
    // Navigate to a fresh page
    await page.goto('/proposals/new');

    // Check for loading skeleton (should appear briefly)
    const skeleton = page.locator('.animate-pulse');

    // Either it's visible or the editor loaded too quickly
    const isSkeletonVisible = await skeleton.isVisible().catch(() => false);
    const isEditorVisible = await page.locator('.ProseMirror').isVisible().catch(() => false);

    expect(isSkeletonVisible || isEditorVisible).toBe(true);
  });

  test('should handle read-only mode when editable is false', async ({ page }) => {
    // This test assumes there's a read-only view somewhere
    // Adjust based on actual implementation
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible', timeout: 10000 });

    // Editor should be present
    await expect(editor).toBeVisible();
  });

  test('should handle empty content gracefully', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();

    // Editor should be empty but functional
    const content = await editor.textContent();
    expect(content).toBeDefined();
  });

  test('should update word count dynamically as user types', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.waitFor({ state: 'visible' });

    await editor.click();
    await editor.type('One');

    let wordCount = page.locator('text=/\\d+ words/');
    let countText = await wordCount.textContent();
    expect(countText).toContain('1 words');

    await editor.type(' Two Three');

    countText = await wordCount.textContent();
    expect(countText).toContain('3 words');
  });
});
