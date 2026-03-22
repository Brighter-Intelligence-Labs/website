<script lang="ts">
	import { onMount } from 'svelte'
	import { theme } from '$lib/stores/theme'

	let animEl: HTMLElement

	const TASKS = [
		{ title: 'Review vendor contract',      cat: 'Legal',      color: '#7c6aad', dur: 11000, saving: '3.5 hrs saved' },
		{ title: 'Process expense reports',     cat: 'Finance',    color: '#4a7aaa', dur: 6000,  saving: '48 min saved'  },
		{ title: 'Draft new client proposal',   cat: 'Sales',      color: '#c85a2a', dur: 8500,  saving: '2.1 hrs saved' },
		{ title: 'Triage support tickets',      cat: 'Operations', color: '#3a8a6a', dur: 5000,  saving: '34 min saved'  },
		{ title: 'Summarise board meeting',     cat: 'Executive',  color: '#aa6a4a', dur: 7500,  saving: '1.8 hrs saved' },
		{ title: 'Extract invoice line items',  cat: 'Finance',    color: '#4a7aaa', dur: 4800,  saving: '52 min saved'  },
		{ title: 'Regulatory compliance check', cat: 'Legal',      color: '#7c6aad', dur: 12000, saving: '4.2 hrs saved' },
		{ title: 'New hire onboarding pack',    cat: 'HR',         color: '#5a8a4a', dur: 7000,  saving: '1.4 hrs saved' },
		{ title: 'Weekly performance digest',   cat: 'Operations', color: '#3a8a6a', dur: 5500,  saving: '45 min saved'  },
		{ title: 'Customer feedback report',    cat: 'Marketing',  color: '#aa882a', dur: 8000,  saving: '2.3 hrs saved' },
	]

	function initKanban(el: HTMLElement): () => void {
		const queueCol = el.querySelector('[data-col="queue"]') as HTMLElement
		const procCol  = el.querySelector('[data-col="proc"]') as HTMLElement
		const doneCol  = el.querySelector('[data-col="done"]') as HTMLElement
		const countEl  = el.querySelector('[data-count]') as HTMLElement

		let state      = 'idle'
		let activeTask: typeof TASKS[0] | null = null
		let procStart  = 0
		let tasksDone  = 0
		let queueIdx   = 0
		let procIdx    = 0

		const taskHistory: Record<number, { startTime: number; timeTaken?: number; cost?: string; clock?: string }> = {}
		const timers: ReturnType<typeof setTimeout>[] = []
		const intervals: ReturnType<typeof setInterval>[] = []

		const OUTPUTS: Record<string, string> = {
			'Legal':      '3 high-risk clauses identified. Legal review recommended before signing.',
			'Finance':    '47 line items extracted. 2 anomalies flagged for manual review.',
			'Sales':      'Executive summary drafted. 3 service tiers and pricing table included.',
			'Operations': '124 tickets triaged. 18 critical. 61 auto-responded. 43 awaiting review.',
			'Executive':  '6 action items assigned with owners. Next review scheduled in 2 weeks.',
			'HR':         'Welcome doc, IT checklist, policy links and day-one schedule generated.',
			'Marketing':  '312 responses analysed. Top theme: onboarding. NPS score: +42.',
		}

		function fmtTime(ms: number) { return ms < 60000 ? (ms/1000).toFixed(1) + 's' : (ms/60000).toFixed(1) + 'm' }
		function fmtClock() {
			const n = new Date()
			return n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0')
		}

		/* Column focus system */
		const COLS   = ['queue', 'proc', 'done'] as const
		const ELCOLS: Record<string, HTMLElement> = { queue: queueCol, proc: procCol, done: doneCol }
		let focusedLane: string | null = null
		let autoCycleTimer: ReturnType<typeof setTimeout> | null = null
		let autoCycleInterval: ReturnType<typeof setInterval> | null = null
		let userActive = false

		const HEADER_COLORS: Record<string, string> = {
			queue: '#7c6aad',
			proc:  '#c85a2a',
			done:  '#3a8a6a',
		}

		const MUTED_OPACITY  = '0.28'
		const ACTIVE_OPACITY = '1'

		function isCardOpen(card: HTMLElement) {
			if (card.classList.contains('selected')) return true
			const openDrawer = card.querySelector('.card-queue-detail.open, .card-detail.open, .card-outcome.open')
			return !!openDrawer
		}

		function applyMuting() {
			Object.entries(ELCOLS).forEach(([lane, col]) => {
				const isFocused = lane === focusedLane
				Array.from(col.children).forEach((child) => {
					const card = child as HTMLElement
					if (card.style.transform && card.style.transform.includes('translateX')) return
					if (isCardOpen(card)) {
						card.style.opacity = ACTIVE_OPACITY
						return
					}
					card.style.opacity = isFocused ? ACTIVE_OPACITY : MUTED_OPACITY
				})
			})
		}

		function focusLane(lane: string, fromUser: boolean) {
			focusedLane = lane

			el.querySelectorAll('.col-header[data-lane]').forEach((h) => {
				const header = h as HTMLElement
				const isFocused = header.dataset.lane === lane
				header.style.color             = isFocused ? HEADER_COLORS[lane] : ''
				header.style.borderBottomColor = isFocused ? HEADER_COLORS[lane] : ''
				header.style.opacity           = isFocused ? '1' : '0.45'
			})

			applyMuting()

			if (fromUser) {
				userActive = true
				if (autoCycleTimer) clearTimeout(autoCycleTimer)
				autoCycleTimer = setTimeout(() => { userActive = false; startAutoCycle() }, 6000)
			}
		}

		function cycleNext() {
			if (userActive) return
			const idx = COLS.indexOf(focusedLane as typeof COLS[number])
			focusLane(COLS[(idx + 1) % COLS.length], false)
		}

		function startAutoCycle() {
			if (autoCycleInterval) clearInterval(autoCycleInterval)
			autoCycleInterval = setInterval(cycleNext, 3500)
			intervals.push(autoCycleInterval)
		}

		// Hook up header clicks
		el.querySelectorAll('.col-header[data-lane]').forEach((h) => {
			h.addEventListener('click', () => focusLane((h as HTMLElement).dataset.lane!, true))
		})

		// Start auto-cycle after initial seed delay
		const initTimer = setTimeout(startAutoCycle, 2000)
		timers.push(initTimer)
		focusLane('queue', false)

		/* makeCard */
		function makeCard(task: typeof TASKS[0], type: string, historyKey: number) {
			const d = document.createElement('div')
			d.className = 'card ' + type + '-card'
			const check = `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" style="flex-shrink:0"><circle cx="4.5" cy="4.5" r="4" fill="rgba(45,122,82,0.18)"/><path d="M2.5 4.5l1.5 1.5 2.5-2.5" stroke="#2d7a52" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

			if (type === 'active') {
				d.innerHTML = `
					<div class="card-cat" style="color:${task.color}"><span class="cat-dot" style="background:${task.color}"></span>${task.cat}</div>
					<div class="card-title">${task.title}</div>
					<div class="card-progress"><div class="card-fill"></div></div>
					<div class="card-detail">
						<div class="card-detail-inner">
							<div class="detail-row"><span class="detail-key">Elapsed</span><span class="detail-val" data-elapsed>0.0s</span></div>
							<div class="detail-row"><span class="detail-key">Est. cost</span><span class="detail-val" data-cost>$0.00</span></div>
							<div class="detail-row"><span class="detail-key">Category</span><span class="detail-val">${task.cat}</span></div>
							<div><button class="detail-cancel">&times; Cancel task</button></div>
						</div>
					</div>`
				d.addEventListener('click', (e) => {
					if ((e.target as HTMLElement).classList.contains('detail-cancel')) return
					const drawer = d.querySelector('.card-detail')!
					const opening = !drawer.classList.contains('open')
					drawer.classList.toggle('open', opening)
					d.style.opacity = opening ? ACTIVE_OPACITY : (focusedLane === 'proc' ? ACTIVE_OPACITY : MUTED_OPACITY)
				})

			} else if (type === 'done') {
				const hist      = taskHistory[historyKey] || {}
				const timeTaken = hist.timeTaken ? fmtTime(hist.timeTaken) : '\u2014'
				const cost      = hist.cost  || '\u2014'
				const clock     = hist.clock || fmtClock()
				const output    = OUTPUTS[task.cat] || 'Task completed successfully.'

				d.innerHTML = `
					<div class="card-cat" style="color:${task.color}"><span class="cat-dot" style="background:${task.color}"></span>${task.cat}</div>
					<div class="card-title">${task.title}</div>
					<div class="card-saving">${check}${task.saving}</div>
					<div class="card-outcome">
						<div class="outcome-inner">
							<div class="outcome-row"><span class="oc-key">Completed at</span><span class="oc-val">${clock}</span></div>
							<div class="outcome-row"><span class="oc-key">Time taken</span><span class="oc-val">${timeTaken}</span></div>
							<div class="outcome-row"><span class="oc-key">Cost</span><span class="oc-val">${cost}</span></div>
							<div class="outcome-summary">${output}</div>
						</div>
					</div>`

				let outcomeTimer: ReturnType<typeof setTimeout> | null = null
				d.addEventListener('click', () => {
					const drawer = d.querySelector('.card-outcome')!
					const opening = !drawer.classList.contains('open')
					if (opening) {
						drawer.classList.add('open')
						d.style.opacity = ACTIVE_OPACITY
						outcomeTimer = setTimeout(() => {
							drawer.classList.remove('open')
							d.style.opacity = focusedLane === 'done' ? ACTIVE_OPACITY : MUTED_OPACITY
						}, 5500)
						timers.push(outcomeTimer)
					} else {
						drawer.classList.remove('open')
						if (outcomeTimer) clearTimeout(outcomeTimer)
						d.style.opacity = focusedLane === 'done' ? ACTIVE_OPACITY : MUTED_OPACITY
					}
				})

			} else {
				// Waiting card
				d.innerHTML = `
					<div class="card-cat" style="color:${task.color}"><span class="cat-dot" style="background:${task.color}"></span>${task.cat}</div>
					<div class="card-title">${task.title}</div>
					<div class="card-queue-detail">
						<div class="queue-detail-inner">
							<div class="queue-detail-row"><span class="qd-key">Category</span><span class="qd-val">${task.cat}</span></div>
							<div class="queue-detail-row"><span class="qd-key">Est. duration</span><span class="qd-val">${fmtTime(task.dur)}</span></div>
							<div class="queue-detail-row"><span class="qd-key">Time saved</span><span class="qd-val">${task.saving}</span></div>
							<div class="queue-actions">
								<button class="q-btn q-btn-pause">\u23F8 Pause</button>
								<button class="q-btn q-btn-escalate">\u2191 Escalate</button>
							</div>
						</div>
					</div>`

				d.addEventListener('click', (e) => {
					const target = e.target as HTMLElement
					if (target.classList.contains('q-btn-pause')) {
						target.classList.toggle('paused')
						target.textContent = target.classList.contains('paused') ? '\u25B6 Resume' : '\u23F8 Pause'
						return
					}
					if (target.classList.contains('q-btn-escalate')) {
						if (d.parentNode) {
							queueCol.appendChild(d)
							target.textContent = '\u2713 Escalated'
							target.style.color = '#3a8a6a'
							target.style.borderColor = 'rgba(58,138,106,0.4)'
							const resetTimer = setTimeout(() => {
								target.textContent = '\u2191 Escalate'
								target.style.color = ''
								target.style.borderColor = ''
							}, 1800)
							timers.push(resetTimer)
						}
						return
					}
					// Toggle expand + opacity
					const drawer = d.querySelector('.card-queue-detail')!
					const opening = !drawer.classList.contains('open')
					drawer.classList.toggle('open', opening)

					if (opening) {
						d.classList.add('selected')
						d.style.opacity     = ACTIVE_OPACITY
						d.style.borderColor = task.color + '55'
						d.style.boxShadow   = `0 0 0 0.5px ${task.color}33, 0 2px 12px ${task.color}22`
					} else {
						d.classList.remove('selected')
						d.style.opacity     = focusedLane === 'queue' ? ACTIVE_OPACITY : MUTED_OPACITY
						d.style.borderColor = ''
						d.style.boxShadow   = ''
					}
				})
			}
			return d
		}

		/* addCard / dismiss */
		function addCard(col: HTMLElement, card: HTMLElement, max: number) {
			col.insertBefore(card, col.firstChild)
			const lane = Object.entries(ELCOLS).find(([, c]) => c === col)?.[0]
			const targetOpacity = lane === focusedLane ? ACTIVE_OPACITY : MUTED_OPACITY
			requestAnimationFrame(() => requestAnimationFrame(() => {
				card.classList.add('visible')
				card.style.opacity = targetOpacity
			}))
			const kids = [...col.children]
			kids.slice(max).forEach(c => {
				const el = c as HTMLElement
				el.style.transition = 'opacity 0.25s ease'
				el.style.opacity    = '0'
				const removeTimer = setTimeout(() => el.remove(), 260)
				timers.push(removeTimer)
			})
		}

		function dismiss(card: HTMLElement, cb?: () => void) {
			card.style.transition = 'opacity 0.22s ease, transform 0.22s ease'
			card.style.opacity    = '0'
			card.style.transform  = 'translateX(14px) scale(0.97)'
			const dismissTimer = setTimeout(() => { if (card.parentNode) card.remove(); if (cb) cb() }, 240)
			timers.push(dismissTimer)
		}

		/* State machine interval */
		const stateInterval = setInterval(() => {
			if (state === 'idle') {
				if (!queueCol.firstChild) return
				state = 'exiting'
				dismiss(queueCol.lastChild as HTMLElement, () => {
					activeTask = TASKS[procIdx % TASKS.length]
					const hKey = procIdx++
					state = 'entering'
					procCol.innerHTML = ''
					const aCard = makeCard(activeTask, 'active', hKey)
					procCol.appendChild(aCard)
					requestAnimationFrame(() => requestAnimationFrame(() => {
						aCard.classList.add('visible')
						aCard.style.opacity = procCol === ELCOLS[focusedLane!] ? ACTIVE_OPACITY : MUTED_OPACITY
						procStart = Date.now()
						taskHistory[hKey] = { startTime: procStart }
						;(procCol as any)._hKey = hKey
						state = 'running'
					}))
				})
			} else if (state === 'running') {
				const fill = procCol.querySelector('.card-fill') as HTMLElement | null
				if (!fill) { state = 'idle'; return }
				const elapsed = Date.now() - procStart
				const p  = Math.min(elapsed / activeTask!.dur, 1)
				const ep = p < 0.5 ? 2*p*p : -1 + (4-2*p)*p
				fill.style.width = (ep * 100).toFixed(1) + '%'
				const aCard = procCol.firstChild as HTMLElement | null
				if (aCard) {
					const elEl = aCard.querySelector('[data-elapsed]') as HTMLElement | null
					const coEl = aCard.querySelector('[data-cost]') as HTMLElement | null
					if (elEl) elEl.textContent = fmtTime(elapsed)
					if (coEl) coEl.textContent = '$' + (ep * activeTask!.dur / 1000 * 0.14).toFixed(2)
				}
				if (p >= 1) {
					state = 'finishing'
					const task  = activeTask!; activeTask = null
					const hKey  = (procCol as any)._hKey
					if (taskHistory[hKey]) {
						const tt = Date.now() - taskHistory[hKey].startTime
						taskHistory[hKey].timeTaken = tt
						taskHistory[hKey].cost  = '$' + (tt / 1000 * 0.14).toFixed(2)
						taskHistory[hKey].clock = fmtClock()
					}
					dismiss(procCol.firstChild as HTMLElement, () => {
						addCard(doneCol, makeCard(task, 'done', hKey), 3)
						tasksDone++
						countEl.textContent = String(tasksDone)
						applyMuting()
						state = 'idle'
					})
				}
			}
		}, 80)
		intervals.push(stateInterval)

		/* Seed queue */
		function spawnQueue() {
			addCard(queueCol, makeCard(TASKS[queueIdx % TASKS.length], 'waiting', queueIdx), 4)
			queueIdx++
			applyMuting()
		}
		for (let i = 0; i < 4; i++) {
			const seedTimer = setTimeout(spawnQueue, i * 300)
			timers.push(seedTimer)
		}
		const spawnInterval = setInterval(spawnQueue, 7000)
		intervals.push(spawnInterval)

		// Cleanup function
		return () => {
			intervals.forEach(id => clearInterval(id))
			timers.forEach(id => clearTimeout(id))
			if (autoCycleTimer) clearTimeout(autoCycleTimer)
			if (autoCycleInterval) clearInterval(autoCycleInterval)
		}
	}

	onMount(() => {
		const cleanup = initKanban(animEl)
		return cleanup
	})
</script>

<div
	class="hero-anim"
	class:hero-dark={$theme === 'dark'}
	class:hero-light={$theme === 'light' || $theme === 'auto'}
	bind:this={animEl}
>
	<div class="col-headers">
		<div class="col-header" data-lane="queue">Queued</div>
		<div class="col-header" data-lane="proc">Running</div>
		<div class="col-header" data-lane="done">Done</div>
	</div>
	<div class="cols">
		<div class="col" data-col="queue"></div>
		<div class="col" data-col="proc"></div>
		<div class="col" data-col="done"></div>
	</div>
	<div class="metrics">
		<div class="met">
			<div class="met-val">
				<span style="color:#3a8a6a;font-size:7px">&bull;</span>
				<span data-count>0</span> tasks done
			</div>
			<div class="met-lbl">Completed this session</div>
		</div>
		<div class="met">
			<div class="met-val">
				<span style="color:#c85a2a;font-size:7px">&bull;</span> ~60% less
			</div>
			<div class="met-lbl">Than doing it manually</div>
		</div>
		<div class="met">
			<div class="met-val">
				<span style="color:#4a7aaa;font-size:7px">&bull;</span> 24/7
			</div>
			<div class="met-lbl">Runs without anyone watching</div>
		</div>
	</div>
</div>

<style>
	/* ── Kanban layout ───────────────────────────────── */
	.hero-anim {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		overflow: hidden;
		font-family: 'DM Sans', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
		position: relative;
	}

	.col-headers {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		flex-shrink: 0;
	}

	.col-header {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		padding: 10px 12px 8px;
		border-bottom: 1.5px solid transparent;
		position: relative;
		cursor: pointer;
		user-select: none;
		transition: opacity 0.2s ease, border-bottom-color 0.2s ease;
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 6px 8px;
		min-height: 160px;
	}

	/* ── Cards ────────────────────────────────────────── */
	:global(.hero-anim .card) {
		border-radius: 6px;
		padding: 11px 13px 13px;
		position: relative;
		overflow: hidden;
		opacity: 0;
		transform: translateY(-8px) scale(0.98);
		transition: opacity 0.3s cubic-bezier(0.22,1,0.36,1),
		            transform 0.3s cubic-bezier(0.22,1,0.36,1);
	}

	:global(.hero-anim .card.visible) { opacity: 1; transform: translateY(0) scale(1); }

	:global(.hero-anim .card-cat) {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		margin-bottom: 5px;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	:global(.hero-anim .cat-dot) { display: inline-block; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

	:global(.hero-anim .card-title) { font-size: 11px; font-weight: 500; line-height: 1.35; }

	:global(.hero-anim .card-progress) {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		height: 2px;
		overflow: hidden;
	}

	:global(.hero-anim .card-fill) {
		height: 100%;
		width: 0%;
		background: linear-gradient(90deg, #c85a2a, #e8813a);
	}

	:global(.hero-anim .card-saving) {
		margin-top: 6px;
		font-size: 9px;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	/* ── Metrics strip ───────────────────────────────── */
	.metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		flex-shrink: 0;
		position: relative;
		z-index: 2;
	}

	.met { padding: 8px 12px; }

	.met-val {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1;
		margin-bottom: 3px;
		font-variant-numeric: tabular-nums;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	:global(.hero-anim .met-val em) { font-style: normal; color: #c85a2a; }
	.met-lbl { font-size: 9px; line-height: 1.35; font-weight: 300; }

	/* ── Interactive card states ─────────────────────── */

	/* Queue cards — clickable */
	:global(.hero-anim .card.waiting-card) {
		cursor: pointer;
		user-select: none;
		transition: opacity 0.3s cubic-bezier(0.22,1,0.36,1),
		            transform 0.3s cubic-bezier(0.22,1,0.36,1),
		            border-color 0.25s ease,
		            box-shadow 0.25s ease;
	}

	:global(.hero-anim .card.waiting-card.selected) {
		box-shadow: 0 2px 12px rgba(0,0,0,0.15);
	}

	/* Queue card expand drawer */
	:global(.hero-anim .card-queue-detail) {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.38s cubic-bezier(0.22,1,0.36,1),
		            opacity 0.3s ease,
		            margin-top 0.3s ease;
		opacity: 0;
		margin-top: 0;
	}

	:global(.hero-anim .card-queue-detail.open) {
		max-height: 170px;
		opacity: 1;
		margin-top: 9px;
	}

	:global(.hero-anim .queue-detail-inner) {
		padding-top: 9px;
		border-top: 0.5px solid rgba(128,128,128,0.15);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	:global(.hero-anim .queue-detail-row) {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	:global(.hero-anim .qd-key) { font-size: 9px; opacity: 0.45; font-weight: 400; }
	:global(.hero-anim .qd-val) { font-size: 9px; font-weight: 500; font-variant-numeric: tabular-nums; }

	:global(.hero-anim .queue-actions) {
		display: flex;
		gap: 5px;
		margin-top: 7px;
	}

	:global(.hero-anim .q-btn) {
		flex: 1;
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 4px 0;
		border-radius: 3px;
		border: 0.5px solid;
		cursor: pointer;
		text-align: center;
		font-family: inherit;
		transition: all 0.15s ease;
	}

	:global(.hero-anim .q-btn-pause)    { color: #b0aaa4; border-color: rgba(128,128,128,0.25); background: transparent; }
	:global(.hero-anim .q-btn-escalate) { color: #c85a2a; border-color: rgba(200,90,42,0.3);   background: rgba(200,90,42,0.06); }
	:global(.hero-anim .q-btn-pause:hover)    { border-color: rgba(128,128,128,0.5); color: #888; }
	:global(.hero-anim .q-btn-escalate:hover) { border-color: rgba(200,90,42,0.55); background: rgba(200,90,42,0.12); }
	:global(.hero-anim .q-btn-pause.paused)   { color: #3a8a6a; border-color: rgba(58,138,106,0.4); background: rgba(58,138,106,0.06); }

	/* Running card — clickable */
	:global(.hero-anim .card.active-card) {
		cursor: pointer;
		user-select: none;
	}

	:global(.hero-anim .card-detail) {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.38s cubic-bezier(0.22,1,0.36,1),
		            opacity 0.3s ease,
		            margin-top 0.3s ease;
		opacity: 0;
		margin-top: 0;
	}

	:global(.hero-anim .card-detail.open) {
		max-height: 140px;
		opacity: 1;
		margin-top: 9px;
	}

	:global(.hero-anim .card-detail-inner) {
		padding-top: 9px;
		border-top: 0.5px solid rgba(255,255,255,0.07);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	:global(.hero-anim .detail-row) {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	:global(.hero-anim .detail-key)  { font-size: 9px; font-weight: 400; opacity: 0.4; }
	:global(.hero-anim .detail-val)  { font-size: 9px; font-weight: 500; font-variant-numeric: tabular-nums; }

	:global(.hero-anim .detail-cancel) {
		margin-top: 7px;
		display: inline-block;
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(200,90,42,0.65);
		border: 0.5px solid rgba(200,90,42,0.25);
		border-radius: 3px;
		padding: 3px 8px;
		cursor: pointer;
		transition: all 0.15s;
		font-family: inherit;
		background: none;
	}

	:global(.hero-anim .detail-cancel:hover) { color: #c85a2a; border-color: rgba(200,90,42,0.5); }

	/* Done cards — clickable */
	:global(.hero-anim .card.done-card) { cursor: pointer; user-select: none; }

	:global(.hero-anim .card-outcome) {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.38s cubic-bezier(0.22,1,0.36,1),
		            opacity 0.3s ease,
		            margin-top 0.3s ease;
		opacity: 0;
		margin-top: 0;
	}

	:global(.hero-anim .card-outcome.open) {
		max-height: 180px;
		opacity: 1;
		margin-top: 9px;
	}

	:global(.hero-anim .outcome-inner) {
		padding-top: 9px;
		border-top: 0.5px solid rgba(45,122,82,0.2);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	:global(.hero-anim .outcome-row) {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	:global(.hero-anim .oc-key) { font-size: 9px; opacity: 0.4; font-weight: 400; }
	:global(.hero-anim .oc-val) { font-size: 9px; font-weight: 500; font-variant-numeric: tabular-nums; }

	:global(.hero-anim .outcome-summary) {
		margin-top: 6px;
		font-size: 9px;
		font-weight: 300;
		line-height: 1.5;
		opacity: 0.65;
		font-style: italic;
	}

	/* ═══ Dark variant ═══════════════════════════════ */
	.hero-dark {
		background: #0d0d0c;
	}

	.hero-dark::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
		background-size: 22px 22px;
		pointer-events: none;
	}

	.hero-dark::after {
		content: '';
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 300px;
		height: 200px;
		background: radial-gradient(ellipse, rgba(200,90,42,0.08) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero-dark .col-header { color: rgba(240,236,230,0.25); }

	:global(.hero-dark .card) {
		background: rgba(255,255,255,0.04);
		border: 0.5px solid rgba(255,255,255,0.07);
	}

	:global(.hero-dark .card.waiting-card .card-title) { color: #f0ece6; }
	:global(.hero-dark .card.waiting-card .card-cat)   { opacity: 0.7; }
	:global(.hero-dark .card-title) { color: #f0ece6; }

	:global(.hero-dark .card.active-card) {
		background: rgba(200,90,42,0.08);
		border-color: rgba(200,90,42,0.3);
		box-shadow: 0 0 0 0.5px rgba(200,90,42,0.15), 0 2px 14px rgba(200,90,42,0.08);
	}

	:global(.hero-dark .card.active-card::before) {
		content: '';
		position: absolute;
		top: 0; left: -100%; width: 50%; height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
		animation: shimmer 2.6s ease-in-out infinite;
	}

	@keyframes shimmer { to { left: 180%; } }

	:global(.hero-dark .card.done-card) {
		background: rgba(45,122,82,0.07);
		border-color: rgba(45,122,82,0.2);
	}

	:global(.hero-dark .card-progress) { background: rgba(200,90,42,0.12); }
	:global(.hero-dark .card-saving)   { color: #4ade80; }

	.hero-dark .metrics {
		border-top: 0.5px solid rgba(255,255,255,0.06);
		background: rgba(0,0,0,0.2);
	}

	.hero-dark .met      { border-right: 0.5px solid rgba(255,255,255,0.06); }
	.hero-dark .met:last-child { border-right: none; }
	.hero-dark .met-val  { color: #f0ece6; }
	.hero-dark .met-lbl  { color: rgba(240,236,230,0.3); }

	/* ═══ Light variant ══════════════════════════════ */
	.hero-light {
		background: #f3f0eb;
	}

	.hero-light::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, #cec9c3 1px, transparent 1px);
		background-size: 22px 22px;
		opacity: 0.55;
		pointer-events: none;
	}

	.hero-light .col-header { color: #c8c3be; }

	:global(.hero-light .card) {
		background: #faf9f7;
		border: 0.5px solid #e2ddd8;
		box-shadow: 0 1px 3px rgba(0,0,0,0.04);
	}

	:global(.hero-light .card.waiting-card .card-title) { color: #1a1a1a; }
	:global(.hero-light .card.waiting-card .card-cat)   { opacity: 0.7; }
	:global(.hero-light .card-title) { color: #1a1a1a; }

	:global(.hero-light .card.active-card) {
		background: #fff;
		border-color: rgba(200,90,42,0.35);
		box-shadow: 0 1px 12px rgba(200,90,42,0.07), 0 0 0 0.5px rgba(200,90,42,0.12);
	}

	:global(.hero-light .card.active-card::before) {
		content: '';
		position: absolute;
		top: 0; left: -100%; width: 50%; height: 100%;
		background: linear-gradient(90deg, transparent, rgba(200,90,42,0.04), transparent);
		animation: shimmer 2.6s ease-in-out infinite;
	}

	:global(.hero-light .card.done-card)  { background: #f6fbf8; border-color: #bdd9c8; }
	:global(.hero-light .card-progress)   { background: rgba(200,90,42,0.08); }
	:global(.hero-light .card-saving)     { color: #2d7a52; }

	.hero-light .metrics {
		border-top: 0.5px solid #e2ddd8;
		background: #f3f0eb;
		position: relative;
		z-index: 2;
	}

	.hero-light .met      { border-right: 0.5px solid #e2ddd8; }
	.hero-light .met:last-child { border-right: none; }
	.hero-light .met-val  { color: #1a1a1a; }
	.hero-light .met-lbl  { color: #b0aaa4; }

	/* Light variant detail overrides */
	:global(.hero-light .card-detail-inner)  { border-top-color: #e2ddd8; }
	:global(.hero-light .queue-detail-inner) { border-top-color: #e2ddd8; }
	:global(.hero-light .detail-key)         { color: #1a1a1a; }
	:global(.hero-light .detail-val)         { color: #1a1a1a; }
	:global(.hero-light .qd-key)             { color: #1a1a1a; }
	:global(.hero-light .qd-val)             { color: #1a1a1a; }
	:global(.hero-light .oc-key)             { color: #1a1a1a; }
	:global(.hero-light .oc-val)             { color: #1a1a1a; }
	:global(.hero-light .outcome-summary)    { color: #1a1a1a; }
	:global(.hero-light .outcome-inner)      { border-top-color: #c0deca; }
</style>
