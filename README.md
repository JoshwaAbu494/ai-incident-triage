# AI-Powered Autonomous Incident Triage System

An AI-powered DevOps tool that takes a software error log, automatically finds the relevant source code using Retrieval-Augmented Generation (RAG), identifies the likely root cause, and proposes a minimal fix — displayed on a web dashboard.

## Problem

When an error hits production, an engineer has to manually trace the stack trace back to the responsible code before they can even start diagnosing it. That triage step is repetitive and time-consuming.

## Solution

A pipeline of three focused AI agents automates the triage step: one parses the error log, one retrieves the relevant code and finds the probable root cause, and one proposes a minimal fix. The system never edits code automatically — it only suggests changes for a human to review.

## Architecture

```
Error Log
   |
   v
Agent 1: Log Analyzer          -> structured error info
   |
   v
Agent 2: Codebase RAG Analyzer -> relevant code + root cause
   |
   v
Agent 3: Fix Suggestion Agent  -> minimal fix suggestion
   |
   v
Dashboard Result
```

## Tech stack

- Frontend: React, JavaScript, CSS
- Backend: Node.js, Express.js
- AI: LLM API + Embeddings API (RAG)
- Vector store: ChromaDB (or a simple local vector store)
- Database: PostgreSQL

## Status

In active development, built in phases. See commit history for progress.

## Setup

Instructions will be added as each part is implemented (backend in Phase 3, frontend in Phase 10).