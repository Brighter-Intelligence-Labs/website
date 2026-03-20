import { describe, it, expect } from 'vitest';

describe('Email validation', () => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	it('accepts valid email addresses', () => {
		expect(emailRegex.test('user@example.com')).toBe(true);
		expect(emailRegex.test('user.name@domain.co.uk')).toBe(true);
		expect(emailRegex.test('user+tag@example.org')).toBe(true);
	});

	it('rejects invalid email addresses', () => {
		expect(emailRegex.test('')).toBe(false);
		expect(emailRegex.test('not-an-email')).toBe(false);
		expect(emailRegex.test('@domain.com')).toBe(false);
		expect(emailRegex.test('user@')).toBe(false);
		expect(emailRegex.test('user @domain.com')).toBe(false);
	});
});

describe('Slug generation', () => {
	function generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	it('converts title to slug', () => {
		expect(generateSlug('Hello World')).toBe('hello-world');
	});

	it('removes special characters', () => {
		expect(generateSlug("Why AI Agents Fail: A Deep Dive")).toBe('why-ai-agents-fail-a-deep-dive');
	});

	it('collapses multiple dashes', () => {
		expect(generateSlug('This --- is  a  test')).toBe('this-is-a-test');
	});

	it('handles empty string', () => {
		expect(generateSlug('')).toBe('');
	});

	it('handles string with only special chars', () => {
		expect(generateSlug('!@#$%^&*()')).toBe('');
	});
});

describe('Read time calculation', () => {
	function calcReadTime(content: string): string {
		const wordCount = content.split(/\s+/).length;
		return `${Math.ceil(wordCount / 200)} min read`;
	}

	it('calculates read time for short content', () => {
		const words = Array(100).fill('word').join(' ');
		expect(calcReadTime(words)).toBe('1 min read');
	});

	it('calculates read time for longer content', () => {
		const words = Array(500).fill('word').join(' ');
		expect(calcReadTime(words)).toBe('3 min read');
	});

	it('calculates read time for very long content', () => {
		const words = Array(2000).fill('word').join(' ');
		expect(calcReadTime(words)).toBe('10 min read');
	});
});

describe('HTML escaping (contact form)', () => {
	function esc(s: string): string {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	it('escapes HTML special characters', () => {
		expect(esc('<script>alert("xss")</script>')).toBe(
			'&lt;script&gt;alert("xss")&lt;/script&gt;'
		);
	});

	it('escapes ampersands', () => {
		expect(esc('Tom & Jerry')).toBe('Tom &amp; Jerry');
	});

	it('leaves safe strings unchanged', () => {
		expect(esc('Hello World')).toBe('Hello World');
	});
});
