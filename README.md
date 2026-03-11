# Building Full-Stack AI Assistant with TypeScript

A TypeScript-based full-stack AI chatbot for Q&A interactions, built with CopilotKit, AG-UI, and Mastra to explore conversational AI, agent orchestration, and intelligent tool integrations.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (v10.18+)

## Utilities

This repo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Environment Variables**

   Ensure you copy `.env.example` to `.env` and fill in any required variables.

   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server**

   ```bash
   pnpm dev
   ```

   *This command leverages `concurrently` to run both the Mastra server (`pnpm mastra:dev`) and the Vite React app (`pnpm vite:dev`) in parallel.*

## Available Scripts

| Script | Description |
| ------ | ------------- |
| `pnpm dev` | Runs both Mastra and Vite in development mode. |
| `pnpm vite:dev` | Starts the Vite frontend server only. |
| `pnpm mastra:dev` | Starts the Mastra server only. |
| `pnpm vite:build` | Builds the Vite frontend. |
| `pnpm mastra:build` | Builds the Mastra server. |
| `pnpm lint` | Lints the codebase using ESLint. |
| `pnpm format` | Formats code with Prettier. |
| `pnpm preview` | Previews the production build of the Vite app locally. |

## Technical stacks

![Mastra Agent Architecture](https://mintcdn.com/tawkitai/p1KIIAcVU0goF39y/images/ag-ui-overview-with-partners.png?fit=max&auto=format&n=p1KIIAcVU0goF39y&q=85&s=62e8ee85a2e1623d1bfbbea76227ca99)

- [Radix UI](https://www.radix-ui.com/) (v1.2): Provides accessible, unstyled UI primitives for building customizable React components and design systems.
- [CopilotKit](https://www.copilotkit.ai/) (v1.51.3): Support adapter to communicate between Frontend and agents.
- [AG-UI](https://docs.ag-ui.com/introduction) (v0.0.44): Register agent to transition message from Frontend to agents and vice versa.
- [AI](https://ai-sdk.dev/) (v5.0.112): Provides API + helpers to work with LLM in JavaScript/TypeScript.
- [Mastra](https://mastra.ai/) (v1.10.0): Collect all agents, tools and setup memory/storage
- [Cloudflare](https://www.cloudflare.com/): Host server for agents
