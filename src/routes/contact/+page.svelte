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
					<button type="submit" class="btn-primary">Send Message</button>
				</form>
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
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.7;
		margin-bottom: var(--space-3);
		max-width: 480px;
	}

	.contact-note {
		color: var(--text-muted);
		font-size: var(--text-sm);
		font-weight: 300;
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
		color: var(--text-secondary);
		font-size: var(--text-sm);
		font-weight: 300;
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

	@media (max-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
