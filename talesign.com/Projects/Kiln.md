---
title: Kiln
description: An Obsidian static website generator made in Go that takes your Obsidian vault and makes it a blazingly fast website.
type: Personal
---
# Kiln

- **Source Code:** [GitHub](https://github.com/otaleghani/kiln)
- **Documentation:** [kiln.talesign.com](https://kiln.talesign.com/)

Kiln was born out of a specific need: true feature parity with Obsidian. While other generators exist, and even Obsidian Publish exists, I needed a tool that could seamlessly handle the complex features of a modern Vault—including Canvases and Bases—without friction.

Kiln transforms your local Obsidian vault into a high-performance static website, preserving your knowledge graph's integrity while offering build speeds that only Go can provide.

## Key Features

- **Complete Feature Parity:** Unlike standard Markdown parsers, Kiln natively understands Obsidian-specific formats, including Canvases, Callouts, Wikilinks and Bases support.
- **Single Binary Architecture:** Built with Golang, Kiln compiles into a single, dependency-free executable. It runs natively on Windows, Linux, and macOS (Intel & Apple Silicon).
- **Headless CMS Mode:** Kiln also has a `custom mode` that treats your vault as a structured database. By defining content collections in a JSON file, Kiln enforces schema validation on your Frontmatter. If a field requires a relation but receives a date, the build fails safely—ensuring your data integrity before deployment. After that it renders the content using a user define layout.

## Engineering & Deployment

The core philosophy of Kiln is portability. Being a single binary means it integrates effortlessly into any CI/CD pipeline.

I engineered the release process using GitHub Actions to cross-compile for all major architectures automatically upon tagging a release. This allows for trivial deployment on platforms like Cloudflare Pages using a simple script to fetch the latest binary and build:

```bash
# Example: Deploying on Cloudflare Pages
# Automatically fetches the latest Kiln binary and builds the site
LATEST_TAG=$(curl -s https://api.github.com/repos/otaleghani/kiln/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
curl -L -o ./kiln "https://github.com/otaleghani/kiln/releases/download/${LATEST_TAG}/kiln_linux_amd64"
chmod +x ./kiln

./kiln generate --input "./docs" --output ./public --name "Kiln"
```