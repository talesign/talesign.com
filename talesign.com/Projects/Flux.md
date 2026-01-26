---
title: Flux
description: A privacy-first form backend written in Go. Features a unique SSH-based TUI, AES-GCM encryption, and native HTMX integration. The secure alternative to SaaS forms.
type: Personal
---
# Flux

- **Source Code:** [GitHub](https://github.com/otaleghani/flux)
- **Documentation:** [flux.talesign.com](https://flux.talesign.com)

Flux was born from a common frustration in the static site ecosystem: the "Contact Form" problem. While static site generators (like Hugo or Kiln) are perfect for content, they lack a backend. Developers are often forced to choose between fragile serverless functions or expensive SaaS providers that hoard user data.

Flux solves this by acting as a self-hosted "Form Appliance." It runs as a single, zero-dependency binary on your VPS, providing a secure, GDPR-compliant backend that you own entirely.

## Key Features

- **The "Hardware" Interface (TUI):** Unlike traditional web apps, Flux has no web-based dashboard that can be probed by bots. Management is handled entirely via a secure SSH Text User Interface (TUI). You connect via `ssh admin@your-server` to configure forms, view logs, and manage secrets, leveraging the [Charm](https://charm.sh/) ecosystem.
- **Paranoid Security Model:** Flux uses **AES-GCM** to encrypt all sensitive credentials (SMTP passwords, API keys) at rest. The master decryption key is derived via Argon2id and held **only in RAM**. If the server reboots, the database automatically enters a "Sealed" state until manually unlocked, ensuring data safety even if the disk is compromised.
- **HTMX Native:** Flux doesn't just collect JSON; it serves pre-rendered HTML fragments. By dropping a simple HTMX snippet into your static site, you get instant validation, loading states, and error handling without writing a single line of client-side JavaScript.

## Engineering & Architecture

Flux is built on a **Hexagonal Architecture** (Ports and Adapters) pattern using Go. This ensures strict separation between the core domain logic (validation, consent), the driving adapters (HTTP & SSH Servers), and the driven adapters (SQLite, SMTP).

One of the primary engineering challenges was integrating the management layer directly into the binary without exposing a vulnerable web panel. By embedding a custom SSH server (using `charmbracelet/wish`) alongside the HTTP server, Flux achieves a unique security profile: the management port (`:2222`) supports full public-key authentication, while the public port (`:8080`) remains write-only for submissions.