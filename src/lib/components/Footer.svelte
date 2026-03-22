<script>
	import SubscribeForm from './SubscribeForm.svelte';
</script>

<footer class="footer">
	<div class="footer-grid">
		<div>
			<div class="footer-brand">Brighter Intelligence Labs</div>
			<div class="footer-desc">We design and deploy bespoke AI systems that run real business workflows.</div>
		</div>
		<div class="footer-col">
			<h5>Company</h5>
			<a class="footer-link" href="/about">About</a>
			<a class="footer-link" href="/systems">Systems</a>
			<a class="footer-link" href="/contact">Contact</a>
		</div>
		<div class="footer-col">
			<h5>Insights</h5>
			<a class="footer-link" href="/insights">All Articles</a>
			<a class="footer-link" href="/insights?category=systems-thinking">Systems Thinking</a>
			<a class="footer-link" href="/insights?category=agent-design">Agent Design</a>
			<a class="footer-link" href="/insights?category=cost-governance">Cost &amp; Governance</a>
		</div>
		<div class="footer-col">
			<h5>Connect</h5>
			<a class="footer-link" href="/contact">Book a Discovery Call</a>
		</div>
		<div class="footer-subscribe">
			<div class="footer-col-title">Stay in the loop</div>
			<SubscribeForm />
		</div>
	</div>
</footer>
<div class="footer-copy-wrap">
	<div class="footer-copy">© {new Date().getFullYear()} Brighter Intelligence Labs. All rights reserved.</div>
</div>

<style>
	.footer {
		background: var(--black);
		padding: clamp(40px,6vw,64px) 0;
	}

	.footer-grid {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 32px;
	}

	.footer-brand {
		font-size: 13px;
		font-weight: 600;
		color: var(--white);
		letter-spacing: -0.01em;
		margin-bottom: 10px;
	}

	.footer-desc {
		font-size: 12px;
		font-weight: 300;
		color: rgba(240,236,230,0.35);
		line-height: 1.6;
	}

	h5 {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(240,236,230,0.3);
		margin-bottom: 14px;
	}

	.footer-link {
		display: block;
		font-size: 12px;
		font-weight: 300;
		color: rgba(240,236,230,0.45);
		text-decoration: none;
		margin-bottom: 8px;
		transition: color 0.15s;
	}

	.footer-link:hover { color: var(--white); }

	.footer-copy-wrap {
		background: var(--black);
		border-top: 0.5px solid rgba(255,255,255,0.06);
	}

	.footer-copy {
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

	.footer-subscribe {
		grid-column: 1 / -1;
		padding-top: var(--space-6);
		border-top: 1px solid #222;
		margin-top: var(--space-4);
	}

	@media (max-width: 768px) {
		.footer-inner {
			grid-template-columns: 1fr 1fr;
		}

		.footer-brand-col {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 900px) {
		.footer-grid { grid-template-columns: 1fr 1fr; }
	}
</style>
