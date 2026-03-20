---
title: "Agent Orchestration: Why the Glue Layer Is the Hard Part"
slug: "agent-orchestration-the-glue-layer"
category: "Agent Design"
date: "2026-03-05"
author: "Richard"
excerpt: "Everyone focuses on the model. Nobody talks about the orchestration layer that connects agents, manages state, and handles failure. That's where systems actually break."
tags: ["orchestration", "agent-contracts", "architecture"]
readTime: "9 min"
featured: false
---

There's a pattern in every AI project we've seen. The team picks a model, builds a prototype, gets impressive results, and then spends the next six months trying to make it work reliably. Not because the model is wrong. Because everything around the model — the orchestration, the state management, the error handling, the coordination between agents — is harder than anyone expected.

We call this the glue layer. It's the infrastructure that connects intelligent components into a functioning system. And it's where most AI projects fail.

## What orchestration actually means

Orchestration is a broad term, so let's be specific. In the context of AI agent systems, orchestration covers:

**Task routing** — deciding which agent handles which task, based on capability, cost, and availability.

**Execution management** — running tasks in the right order, respecting dependencies, handling parallelism where possible.

**State management** — tracking what's been done, what's pending, what's failed, and what the current context is for each workflow.

**Error handling** — retries, fallbacks, circuit breaking, and graceful degradation when things go wrong.

**Human-in-the-loop** — pausing workflows for human review, managing approval gates, and resuming execution after human input.

None of these are model problems. All of them are systems engineering problems. And they're hard for the same reasons that distributed systems are always hard: concurrency, state, failure, and coordination.

## The pipeline trap

The simplest orchestration pattern is a pipeline: step A produces output that feeds step B, which feeds step C. Linear, predictable, easy to understand.

```
Input → Agent A → Agent B → Agent C → Output
```

Pipelines work for simple workflows. But real business processes aren't pipelines. They're directed acyclic graphs (DAGs) with branching logic, conditional execution, loops, and human checkpoints.

```
Input → Agent A ─┬─→ Agent B → Agent D ─┬─→ Output
                 │                       │
                 └─→ Agent C ────────────┘
                       ↑
                  [Human Review Gate]
```

The jump from pipeline to DAG is where most frameworks fall apart. Suddenly you need:

- Dependency resolution (which tasks can run in parallel?)
- State management (how do you pass context between branches?)
- Synchronisation (how do you wait for multiple branches to complete?)
- Error propagation (if Agent C fails, what happens to Agent D?)

These are well-understood problems in workflow engineering. But most AI agent frameworks treat them as afterthoughts, if they address them at all.

## Agent contracts

One pattern we've found essential is the concept of an **agent contract**. Instead of treating agents as opaque functions, we define a strict interface that every agent must implement:

```typescript
interface AgentContract {
  // What this agent can do
  capabilities: string[];

  // Input schema
  inputSchema: JSONSchema;

  // Output schema
  outputSchema: JSONSchema;

  // Execute a task
  execute(envelope: TaskEnvelope): Promise<TaskResult>;
}

interface TaskEnvelope {
  id: string;
  input: Record<string, unknown>;
  context: WorkflowContext;
  constraints: {
    maxCost: number;
    timeout: number;
    qualityThreshold: number;
  };
}

interface TaskResult {
  id: string;
  status: 'success' | 'failure' | 'needs_review';
  output: Record<string, unknown>;
  metadata: {
    cost: number;
    duration: number;
    model: string;
    confidence: number;
  };
}
```

This contract does several important things:

**It makes agents swappable.** If two agents implement the same contract, you can swap one for the other without changing the orchestration logic. This is essential for A/B testing, fallback strategies, and vendor migration.

**It enables cost tracking.** Every task result includes the actual cost, so the orchestrator can track spending in real time and enforce budget limits.

**It supports quality control.** The confidence score and quality threshold let the orchestrator decide whether to accept a result, retry with a different model, or escalate to human review.

**It decouples implementation from orchestration.** The orchestrator doesn't know or care whether an agent is backed by GPT-4, Claude, a local model, a Python script, or a human. It just sends a task envelope and gets back a result.

## The state problem

State management in agent systems is deceptively difficult. Consider a simple workflow: "Research a topic, summarise the findings, generate a report."

What state needs to be tracked?

- The original research query
- Which sources have been consulted
- The raw research findings
- Intermediate summaries
- The current state of each task (pending, running, complete, failed)
- Any human review decisions
- Cost accumulated so far
- Remaining budget

This state needs to be:

- **Persistent** — if the system crashes, you should be able to resume from where you left off, not start over.
- **Consistent** — if two agents are running in parallel, they need to see a consistent view of shared state.
- **Queryable** — you need to be able to ask "what's the current status of workflow X?" at any point.
- **Auditable** — for governance, you need a complete history of state changes, not just the current state.

Most teams store this state in memory. It works fine in development. In production, when the process restarts, all state is lost. Workflows that were mid-execution have to start over, or worse, get stuck in an inconsistent state.

## Error handling is orchestration

In a demo, you handle the happy path. In production, the error paths outnumber the happy path by a factor of ten.

Consider what can go wrong in a single agent task:

- The API rate-limits your request
- The model returns an error
- The model returns a valid response that doesn't match the expected schema
- The model returns a valid response that's factually wrong
- The model takes longer than the timeout
- The upstream data source is unavailable
- The context window is too small for the input
- The response confidence is below the quality threshold

Each of these requires a different handling strategy. Rate limits need exponential backoff. Timeouts need cancellation and retry. Schema mismatches need parsing with fallback. Low confidence needs escalation.

This error handling logic lives in the orchestration layer. It's not the agent's job to decide what happens when it fails — that's the orchestrator's responsibility. The agent just reports its result honestly, including failures.

## Human-in-the-loop

The least-discussed and most-important part of agent orchestration is human involvement. For any high-stakes workflow, you need approval gates — points where the workflow pauses and waits for human review before proceeding.

This sounds simple. It's not. Questions you need to answer:

- Who has permission to approve? (RBAC)
- What happens if nobody approves within a time limit? (Escalation)
- Can the approver modify the agent's output before the workflow continues? (Editing)
- Is the approval logged for audit purposes? (Governance)
- Can the workflow be cancelled at this point? (Abort handling)
- What context does the reviewer need to make a good decision? (UI)

A well-designed approval gate isn't just a "yes/no" button. It's a review interface that shows the reviewer what the agent did, why, what data it used, and what the consequences of approval are.

## Why frameworks aren't enough

LangChain, CrewAI, AutoGen — these frameworks provide useful primitives for building agent systems. But they're tools, not solutions. They give you the pieces; they don't tell you how to assemble them for your specific domain.

The orchestration challenges we've described — DAG execution, state management, error handling, human-in-the-loop — are domain-specific. A research pipeline has different orchestration needs than a document processing workflow. A content generation system has different error handling than a financial analysis tool.

This is why we build bespoke. Not because we enjoy reinventing wheels, but because the orchestration layer is where domain knowledge meets systems engineering. It's where you encode the rules of your business — which decisions need approval, which tasks can run in parallel, what quality threshold is acceptable, how much you're willing to spend.

## The orchestration advantage

Here's the counterintuitive insight: the orchestration layer is the most valuable part of an AI system. Models are increasingly commoditised — you can switch between GPT-4, Claude, and Gemini with minimal effort. But the orchestration logic — the workflows, the routing rules, the governance policies, the domain-specific error handling — that's where your competitive advantage lives.

The model is the engine. The orchestration is the vehicle. Without the vehicle, the engine is just noise.

If you're building an AI agent system, spend less time comparing model benchmarks and more time designing your orchestration layer. That's where production systems are won or lost.
