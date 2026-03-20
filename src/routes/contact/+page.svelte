<svelte:head>
	<title>Contact — Brighter Intelligence Labs</title>
	<meta name="description" content="Book a free 30-minute discovery call. We'll discuss your workflows, challenges, and whether a bespoke AI system makes sense for your business." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="contact-grid">
			<div class="contact-content">
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
				<form class="contact-form" method="POST" action="https://formspree.io/f/placeholder">
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
					<button type="submit" class="btn btn-primary">Send Message</button>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2xl);
		align-items: start;
	}

	.contact-content h1 {
		margin-bottom: var(--space-md);
	}

	.contact-lead {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-sm);
	}

	.contact-note {
		color: var(--color-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-xl);
	}

	.contact-details h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-sm);
	}

	.contact-details ul {
		list-style: none;
		padding: 0;
	}

	.contact-details li {
		padding: 0.4rem 0;
		padding-left: 1.5rem;
		position: relative;
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.contact-details li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.75rem;
		width: 8px;
		height: 8px;
		background: var(--color-accent);
		border-radius: 50%;
	}

	.contact-form {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
	}

	.form-group {
		margin-bottom: var(--space-md);
	}

	label {
		display: block;
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: 0.375rem;
		color: var(--color-text);
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		font-family: var(--font-body);
		font-size: var(--text-base);
		border: 1.5px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		color: var(--color-text);
		transition: border-color 0.15s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	textarea {
		resize: vertical;
	}

	@media (max-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
