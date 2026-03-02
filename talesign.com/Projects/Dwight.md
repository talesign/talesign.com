---
title: dwight.nvim
description: An AI-powered development companion for Neovim. Orchestrates autonomous agents to plan, build, test, and ship code directly inside your editor using tightly scoped feature pragmas.
type: Open source
---
# dwight.nvim

- **Source Code:** [GitHub](https://github.com/otaleghani/dwight.nvim) 
- **Documentation:** [dwight.talesign.com](https://dwight.talesign.com)

Dwight was born from a common friction point in modern development: AI coding tools either act as glorified autocomplete or force you out of your editor into a browser chat, losing critical context. Developers end up manually managing massive context windows or copy-pasting code back and forth.

Dwight solves this by turning Neovim into an AI-powered orchestrator. It doesn't replace the editor; it supercharges it by utilizing autonomous agents that plan, write, test, and verify code—all without leaving your terminal.

## Key Features

- **Code-Scoped Context:** Instead of blindly feeding entire codebases into an LLM, Dwight uses pragma comments (e.g., `// @feature:auth`) and Treesitter to extract precise signatures. The AI sees exactly what it needs for a specific feature, keeping context windows tight and outputs highly accurate.
- **Autonomous Execution Loop:** Give Dwight a prompt, and it breaks the work into sub-tasks. It then executes each step, runs your test suite as a verification gate, and creates a Git checkpoint upon passing. If a step fails, it reads the error and self-corrects.
- **Persistent Skill System:** Dwight learns your codebase. You can encode project-specific patterns, anti-patterns, and conventions into reusable Markdown "skills." These are automatically injected into the agent's context, ensuring the AI writes code your way.
- **Session Replay Time-Travel:** AI shouldn't be a black box. Dwight includes a debugger-like replay interface where you can step through past agent sessions, reviewing every tool call, thought process, and file diff.

## Engineering & Architecture

Dwight is written in Lua for Neovim 0.10+ and acts as an integration layer between the editor, the file system, and external AI CLI agents (like Claude Code, OpenAI Codex, or Gemini CLI).

A major engineering challenge was building a reliable, stateful workflow engine inside a text editor. Dwight achieves this by leveraging Git as its state machine. Every successful task execution triggers an automatic Git commit, allowing Dwight to easily roll back the codebase if an agent hallucination causes tests to fail down the line.

Furthermore, Dwight is designed for ultimate extensibility. It natively integrates with the Model Context Protocol (MCP), allowing developers to attach external tools—like database querying clients or custom linters—directly into the AI's toolbelt, dramatically expanding what the agents can accomplish autonomously.