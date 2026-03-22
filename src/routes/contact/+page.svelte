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
		<div class="contact-header">
			<div class="eyebrow">Get in touch</div>
			<h1>Let's talk</h1>
			<p class="contact-lead">Book a free 30-minute discovery call. No sales pitch. No obligation. Just a focused conversation about your specific situation.</p>
		</div>
	</div>
</section>

<section class="contact-body">
	<div class="contact-grid">
		<div>
			<div class="eyebrow" style="margin-bottom:10px">What to expect</div>
			<p class="expect-lead">A 30-minute call with a senior engineer, not a sales rep. We'll focus entirely on your situation.</p>
			<div class="expect-list">
				<div class="expect-item">
					<span class="expect-num">01</span>
					<span class="expect-text">A 30-minute call with a senior engineer</span>
				</div>
				<div class="expect-item">
					<span class="expect-num">02</span>
					<span class="expect-text">We'll ask about your current workflows and pain points</span>
				</div>
				<div class="expect-item">
					<span class="expect-num">03</span>
					<span class="expect-text">We'll share relevant examples from similar domains</span>
				</div>
				<div class="expect-item">
					<span class="expect-num">04</span>
					<span class="expect-text">If there's a fit, we'll propose a scoping engagement</span>
				</div>
				<div class="expect-item">
					<span class="expect-num">05</span>
					<span class="expect-text">If there isn't, we'll tell you honestly</span>
				</div>
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
	</section>

<style>
	.contact-header {
		max-width: 640px;
	}

	.contact-header h1 {
		margin-bottom: var(--space-4);
	}

	.contact-lead {
		font-size: 15px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.72;
		max-width: 560px;
	}

	.contact-body {
		padding: var(--sp);
		background: var(--surface);
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
	}

	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 14px;
	}

	.expect-lead {
		font-size: 14px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.72;
		margin-bottom: 24px;
	}

	.expect-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 0.5px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.expect-item {
		display: flex;
		align-items: baseline;
		gap: 14px;
		padding: 16px 18px;
		border-bottom: 0.5px solid var(--border);
		background: var(--surface);
	}

	.expect-item:last-child { border-bottom: none; }

	.expect-num {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--accent);
		flex-shrink: 0;
		width: 20px;
	}

	.expect-text {
		font-size: 13px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.5;
	}

	/* Form */
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field label {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		text-transform: uppercase;
	}

	.field input,
	.field textarea {
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 5px;
		padding: 10px 14px;
		font-size: 13px;
		font-weight: 300;
		color: var(--text-primary);
		font-family: var(--fb);
		outline: none;
		transition: border-color 0.18s;
		width: 100%;
	}

	.field input:focus,
	.field textarea:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(200,90,42,0.08);
	}

	.field textarea {
		resize: vertical;
		min-height: 120px;
		line-height: 1.6;
	}

	.btn-submit {
		width: 100%;
		text-align: center;
		padding: 13px;
		font-size: 13px;
		font-weight: 500;
		color: var(--surface);
		background: var(--text-primary);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-family: var(--fb);
		letter-spacing: -0.01em;
		transition: opacity 0.15s;
	}

	.btn-submit:hover { opacity: 0.85; }

	.form-subtext {
		font-size: 11px;
		color: var(--text-muted);
		text-align: center;
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
