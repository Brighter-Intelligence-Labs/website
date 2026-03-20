<footer class="footer">
	<div class="container">
		<div class="footer-grid">
			<div class="footer-brand">
				<p class="footer-logo">Brighter Intelligence Labs</p>
				<p class="footer-tagline">We design and deploy bespoke AI systems that run real business workflows.</p>
			</div>
			<div class="footer-col">
				<h4>Company</h4>
				<a href="/about">About</a>
				<a href="/systems">Systems</a>
				<a href="/contact">Contact</a>
			</div>
			<div class="footer-col">
				<h4>Insights</h4>
				<a href="/insights">All Articles</a>
				<a href="/insights?category=systems-thinking">Systems Thinking</a>
				<a href="/insights?category=agent-design">Agent Design</a>
				<a href="/insights?category=cost-governance">Cost & Governance</a>
			</div>
			<div class="footer-col">
				<h4>Connect</h4>
				<a href="/contact">Book a Discovery Call</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} Brighter Intelligence Labs. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-text);
		color: #D1D5DB;
		padding: var(--space-2xl) 0 var(--space-lg);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
	}

	.footer-logo {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.125rem;
		color: white;
		margin-bottom: var(--space-sm);
	}

	.footer-tagline {
		font-size: var(--text-sm);
		line-height: 1.6;
		max-width: 300px;
	}

	.footer-col h4 {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: white;
		margin-bottom: var(--space-sm);
	}

	.footer-col a {
		display: block;
		font-size: var(--text-sm);
		color: #9CA3AF;
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.15s ease;
	}

	.footer-col a:hover {
		color: white;
	}

	.footer-bottom {
		border-top: 1px solid #374151;
		padding-top: var(--space-md);
	}

	.footer-bottom p {
		font-size: var(--text-sm);
		color: #6B7280;
	}

	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-lg);
		}

		.footer-brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
