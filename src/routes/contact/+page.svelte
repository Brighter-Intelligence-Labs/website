<script lang="ts">
	let formStatus = $state('idle');
	let formError = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		formStatus = 'loading';
		formError = '';

		const form = e.target as HTMLFormElement;
		const data = new FormData(form);

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: data.get('name'),
					email: data.get('email'),
					company: data.get('company'),
					message: data.get('message')
				})
			});

			if (res.ok) {
				formStatus = 'success';
				form.reset();
			} else {
				const err = await res.json();
				formError = err.error || 'Something went wrong.';
				formStatus = 'error';
			}
		} catch {
			formError = 'Network error. Please try again.';
			formStatus = 'error';
		}
	}
</script>

<svelte:head>
	<title>Contact — Brighter Intelligence Labs</title>
	<meta name="description" content="Book a free 30-minute discovery call. We'll discuss your workflows, challenges, and whether a bespoke AI system makes sense for your business." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="contact-grid">
			<div class="contact-content">
				<div class="eyebrow">Get in touch</div>
				<h1>Let's talk</h1>
				<p class="contact-lead">
					Book a free 30-minute discovery call. We'll discuss your workflows, challenges, and whether a bespoke AI system makes sense for your business.
				</p>
				<p class="contact-note">
					No sales pitch. No obligation. Just a focused conversation about your specific situation.
				</p>

				<div class="contact-details">
					<h3>What to expect</h3>
					<ul>
						<li>A 30-minute call with a senior engineer</li>
						<li>We'll ask about your current workflows and pain points</li>
						<li>We'll share relevant examples from similar domains</li>
						<li>If there's a fit, we'll propose a scoping engagement</li>
						<li>If there isn't, we'll tell you honestly</li>
					</ul>
				</div>
			</div>

			<div class="contact-form-wrapper">
				{#if formStatus === 'success'}
					<div class="success-message">
						<h3>Message sent</h3>
						<p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
					</div>
				{:else}
					<form class="contact-form" onsubmit={handleSubmit}>
						<div class="form-group">
							<label for="name">Name</label>
							<input type="text" id="name" name="name" required />
						</div>
						<div class="form-group">
							<label for="email">Email</label>
							<input type="email" id="email" name="email" required />
						</div>
						<div class="form-group">
							<label for="company">Company</label>
							<input type="text" id="company" name="company" />
						</div>
						<div class="form-group">
							<label for="message">Tell us about your project</label>
							<textarea id="message" name="message" rows="5" placeholder="What workflows are you looking to automate? What challenges are you facing?"></textarea>
						</div>
						{#if formError}
							<p class="form-error">{formError}</p>
						{/if}
						<button type="submit" class="btn-primary" disabled={formStatus === 'loading'}>
							{formStatus === 'loading' ? 'Sending...' : 'Send Message'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-16);
		align-items: start;
	}

	.contact-content h1 {
		margin-bottom: var(--space-4);
	}

	.contact-lead {
		font-size: var(--text-base);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		margin-bottom: var(--space-3);
		max-width: 480px;
	}

	.contact-note {
		color: var(--text-muted);
		font-size: var(--text-sm);
		font-weight: 400;
		margin-bottom: var(--space-10);
	}

	.contact-details h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-4);
	}

	.contact-details ul {
		list-style: none;
		padding: 0;
	}

	.contact-details li {
		padding: var(--space-2) 0;
		padding-left: var(--space-5);
		position: relative;
		color: var(--text-primary);
		font-size: var(--text-sm);
		font-weight: 400;
	}

	.contact-details li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 13px;
		width: 6px;
		height: 6px;
		background: var(--accent);
		border-radius: 50%;
	}

	.contact-form {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
	}

	.form-group {
		margin-bottom: var(--space-5);
	}

	label {
		display: block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		margin-bottom: var(--space-2);
		color: var(--text-primary);
	}

	input,
	textarea {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		font-family: var(--font-body);
		font-size: var(--text-base);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg);
		color: var(--text-primary);
		transition: border-color 0.15s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--text-secondary);
	}

	textarea {
		resize: vertical;
	}

	.form-error {
		color: #b91c1c;
		font-size: var(--text-sm);
		margin-bottom: var(--space-3);
	}

	.success-message {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
		text-align: center;
	}

	.success-message h3 {
		color: #059669;
		margin-bottom: var(--space-2);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
