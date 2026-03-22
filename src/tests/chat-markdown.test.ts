import { describe, it, expect } from 'vitest';

// Test the inline markdown renderer used in MessageBubble
function renderMarkdown(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`(.+?)`/g, '<code>$1</code>')
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
		.replace(/\n/g, '<br>');
}

describe('Chat markdown renderer', () => {
	it('escapes HTML to prevent XSS', () => {
		const result = renderMarkdown('<script>alert("xss")</script>');
		expect(result).not.toContain('<script>');
		expect(result).toContain('&lt;script&gt;');
	});

	it('renders bold text', () => {
		expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
	});

	it('renders italic text', () => {
		expect(renderMarkdown('*italic*')).toContain('<em>italic</em>');
	});

	it('renders inline code', () => {
		expect(renderMarkdown('`code`')).toContain('<code>code</code>');
	});

	it('renders links with safe attributes', () => {
		const result = renderMarkdown('[text](http://example.com)');
		expect(result).toContain('href="http://example.com"');
		expect(result).toContain('target="_blank"');
		expect(result).toContain('rel="noopener"');
	});

	it('converts newlines to <br>', () => {
		expect(renderMarkdown('line1\nline2')).toContain('line1<br>line2');
	});

	it('handles combined formatting', () => {
		const result = renderMarkdown('**bold** and *italic* with `code`');
		expect(result).toContain('<strong>bold</strong>');
		expect(result).toContain('<em>italic</em>');
		expect(result).toContain('<code>code</code>');
	});

	it('escapes ampersands', () => {
		expect(renderMarkdown('Tom & Jerry')).toContain('Tom &amp; Jerry');
	});
});

// Test the article page markdown renderer
function renderArticleMarkdown(md: string): string {
	return md
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/^### (.+)$/gm, '<h3>$1</h3>')
		.replace(/^## (.+)$/gm, '<h2>$1</h2>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
		.replace(/\n\n/g, '</p><p>')
		.replace(/^/, '<p>')
		.replace(/$/, '</p>')
		.replace(/<p><h([23])>/g, '<h$1>')
		.replace(/<\/h([23])><\/p>/g, '</h$1>');
}

describe('Article markdown renderer', () => {
	it('renders h2 headings', () => {
		expect(renderArticleMarkdown('## Introduction')).toContain('<h2>Introduction</h2>');
	});

	it('renders h3 headings', () => {
		expect(renderArticleMarkdown('### Subsection')).toContain('<h3>Subsection</h3>');
	});

	it('wraps paragraphs in <p> tags', () => {
		const result = renderArticleMarkdown('First paragraph\n\nSecond paragraph');
		expect(result).toContain('<p>First paragraph</p>');
		expect(result).toContain('<p>Second paragraph</p>');
	});

	it('escapes HTML in article content', () => {
		const result = renderArticleMarkdown('<img src=x onerror=alert(1)>');
		expect(result).not.toContain('<img');
		expect(result).toContain('&lt;img');
	});
});
