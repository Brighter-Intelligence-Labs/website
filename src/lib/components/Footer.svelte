<footer class="footer">
	<div class="footer-inner">
		<div class="footer-brand-col">
			<div class="footer-brand">Brighter Intelligence Labs</div>
			<div class="footer-desc">We design and deploy bespoke AI systems that run real business workflows.</div>
		</div>
		<div class="footer-col">
			<div class="footer-col-title">Company</div>
			<a class="footer-link" href="/about">About</a>
			<a class="footer-link" href="/systems">Systems</a>
			<a class="footer-link" href="/contact">Contact</a>
		</div>
		<div class="footer-col">
			<div class="footer-col-title">Insights</div>
			<a class="footer-link" href="/insights">All Articles</a>
			<a class="footer-link" href="/insights?category=systems-thinking">Systems Thinking</a>
			<a class="footer-link" href="/insights?category=agent-design">Agent Design</a>
			<a class="footer-link" href="/insights?category=cost-governance">Cost & Governance</a>
		</div>
		<div class="footer-col">
			<div class="footer-col-title">Connect</div>
			<a class="footer-link" href="/contact">Book a Discovery Call</a>
		</div>
	</div>
	<div class="footer-bottom">
		<p>&copy; {new Date().getFullYear()} Brighter Intelligence Labs. All rights reserved.</p>
	</div>
</footer>

<style>
	.footer {
		background: var(--black);
		border-top: 1px solid #222;
	}

	.footer-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: var(--space-12) var(--section-padding-x);
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: var(--space-8);
	}

	.footer-brand {
		font-family: var(--font-ui);
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--white);
		margin-bottom: var(--space-3);
		letter-spacing: -0.01em;
		border-left: 7px solid var(--accent);
		padding-left: 10px;
	}

	.footer-desc {
		font-size: var(--text-xs);
		color: rgba(250, 249, 247, 0.35);
		line-height: 1.6;
		font-weight: 300;
	}

	.footer-col-title {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(250, 249, 247, 0.35);
		margin-bottom: var(--space-4);
	}

	.footer-link {
		display: block;
		font-size: var(--text-xs);
		color: rgba(250, 249, 247, 0.5);
		text-decoration: none;
		margin-bottom: var(--space-2);
		font-weight: 300;
		transition: color 0.15s ease;
	}

	.footer-link:hover {
		color: var(--white);
	}

	.footer-bottom {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: var(--space-6) var(--section-padding-x);
		border-top: 1px solid #222;
	}

	.footer-bottom p {
		font-size: var(--text-xs);
		color: rgba(250, 249, 247, 0.25);
		font-weight: 300;
	}

	@media (max-width: 768px) {
		.footer-inner {
			grid-template-columns: 1fr 1fr;
		}

		.footer-brand-col {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		.footer-inner {
			grid-template-columns: 1fr;
		}
	}
</style>
