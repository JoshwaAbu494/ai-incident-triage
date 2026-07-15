# AI-Powered Autonomous Incident Triage System

An AI-powered DevOps tool that takes a software error log, automatically finds the relevant source code using Retrieval-Augmented Generation (RAG), identifies the likely root cause, and proposes a minimal fix -- displayed on a web dashboard.

## Problem

When an error hits production, an engineer has to manually trace the stack trace back to the responsible code before they can even start diagnosing it. That triage step is repetitive, time-consuming, and pulls senior engineers away from feature work every time something breaks.

## Solution

A pipeline of three focused AI agents automates the triage step: one parses the error log into structured data, one retrieves the actual relevant code from the codebase and explains the root cause, and one proposes a minimal, reviewable fix. The system never edits code automatically -- it only suggests changes for a human to review, the same way a colleague would leave a comment on a bug.

## Architecture

Error Log
   |
   v
Agent 1: Log Analyzer          -> structured error info (type, file, line, severity, search query)
   |
   v
Agent 2: Codebase RAG Analyzer -> relevant code (via embeddings + cosine similarity) + root cause
   |
   v
Agent 3: Fix Suggestion Agent  -> minimal fix suggestion (original vs. suggested code)
   |
   v
Dashboard Result

The React frontend submits the error log to an Express backend, which runs the three agents in sequence through a single orchestrator (agents/orchestrator.js) and persists the incident and its analysis in PostgreSQL.

## Multi-Agent Pipeline

Each agent is a plain async function wrapping exactly one focused LLM call, with a fixed input/output contract:

- Log Analyzer (agents/logAnalyzer.js) -- takes { title, log }, returns structured JSON (error type, file, line, function, severity, a search query for the next stage).
- Codebase RAG Analyzer (agents/codebaseRagAgent.js) -- takes the search query, retrieves the top matching code chunks from the vector index, and asks the LLM to identify the actual root cause using that real code.
- Fix Suggestion Agent (agents/fixSuggestionAgent.js) -- takes the root cause and proposes the smallest possible code change that fixes it.

The orchestrator (agents/orchestrator.js) runs these three in sequence -- no branching, no parallelism -- deliberately simple so the flow is easy to trace and explain.

## RAG Workflow

1. Indexing (ml-integration/indexRepository.js) -- reads every .js file in a target repository, splits it into chunks at function boundaries, and generates an embedding for each chunk using Google's Gemini embedding API.
2. Storage -- chunks and embeddings are stored in a local JSON file (ml-integration/vector-index.json) acting as a simple vector store.
3. Retrieval (ml-integration/retrieveCode.js) -- when an incident comes in, its search query is embedded the same way, then compared against every stored chunk using cosine similarity. The top 5 highest-scoring chunks are passed to the RAG agent as candidates.

This is retrieval-augmented generation in the literal sense: instead of asking an LLM to reason about a codebase it's never seen, the actual relevant code is fetched and placed directly in the prompt.

## Technology Stack

- Frontend: React (Vite), JavaScript, CSS, React Router
- Backend: Node.js, Express.js
- LLM: Groq (llama-3.3-70b-versatile) -- used for all three agents' reasoning
- Embeddings: Google Gemini (gemini-embedding-001) -- Groq doesn't offer a public embeddings API, so this one piece uses a separate provider
- Vector store: a local JSON file with in-process cosine similarity search
- Database: PostgreSQL

## Project Structure

ai-incident-triage/
  frontend/                  React dashboard (Vite)
    src/
      pages/                 Dashboard, AnalyzeIncident, IncidentHistory, IncidentResult
      App.jsx
      App.css
  backend/                   Express API
    src/
      routes/
      controllers/
      services/              incidentStore.js (PostgreSQL queries)
  agents/                    The three-agent pipeline
    logAnalyzer.js
    codebaseRagAgent.js
    fixSuggestionAgent.js
    orchestrator.js
  ml-integration/            RAG plumbing
    llmClient.js
    embeddingService.js
    indexRepository.js
    retrieveCode.js
  database/
    schema.sql
  sample-repository/         Intentionally buggy app used to test retrieval
  .env.example
  README.md

## Setup Instructions

Requires Node.js 18+ and PostgreSQL installed locally.

git clone https://github.com/JoshwaAbu494/ai-incident-triage.git
cd ai-incident-triage

Create the database and apply the schema:
psql -U postgres -c "CREATE DATABASE incident_triage;"
psql -U postgres -d incident_triage -f database/schema.sql

Copy the environment template and fill in your own keys:
cp .env.example .env

## Environment Variables

Set these in a .env file at the project root (never commit this file -- see .env.example for the template):

- GROQ_API_KEY -- API key from console.groq.com/keys -- used by all three agents
- GROQ_MODEL -- model name, defaults to llama-3.3-70b-versatile
- GEMINI_API_KEY -- free API key from aistudio.google.com/apikey -- used only for embeddings
- DATABASE_URL -- PostgreSQL connection string, e.g. postgresql://postgres:yourpassword@localhost:5432/incident_triage

## Running the Backend

cd backend
npm install
npm start

Runs on http://localhost:4000

## Running the Frontend

cd frontend
npm install
npm run dev

Opens on http://localhost:5173 (or the next available port)

## Indexing the Sample Repository

Before submitting an incident, the sample repository needs to be indexed once, by sending a POST request to http://localhost:4000/api/repository/index with a JSON body of { "repositoryName": "sample-repository" }.

## Submitting a Test Incident

Either through the Analyze Incident page in the dashboard, or by sending a POST request to http://localhost:4000/api/incidents/analyze with a JSON body containing a title and a log.

## Example Input

Title: User API Error

Log:
TypeError: Cannot read properties of undefined (reading name)
    at getUserProfile (src/services/userService.js:19:15)
    at getProfile (src/controllers/userController.js:7:19)

## Example Output

incidentId: 2
status: completed
logAnalysis.errorType: TypeError
logAnalysis.file: src/services/userService.js
logAnalysis.functionName: getUserProfile
logAnalysis.line: 19
logAnalysis.severity: high
ragAnalysis.rootCause: The function accesses user.name without checking whether findUserById returned a valid user, which is undefined when the requested id does not exist.
ragAnalysis.confidence: 0.9
fixSuggestion.originalCode: return user.name;
fixSuggestion.suggestedCode: return user?.name ?? null;
fixSuggestion.risk: low

## Screenshots

To be added -- see the Incident Result, Analyze Incident, and Incident History pages.

## Demo Video

To be added.

## Future Improvements

- Trigger analysis automatically from a real GitHub Issue webhook, instead of a manual form submission
- A fourth agent that opens a real pull request with the suggested fix on a target repository, with the PR itself (not an auto-merge) acting as the human review checkpoint
- Move the vector store from a local JSON file into PostgreSQL (e.g. with pgvector) so it survives redeploys
- Replace function-boundary regex chunking with a real AST parser for more accurate code splitting
- Support languages beyond JavaScript
- Deploy the full stack (Vercel + Render + Neon)
