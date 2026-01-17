---
title: "Nixology: A Practical Guide to NixOS and Flakes"
description: Welcome to Nixology. A complete, pragmatic series to mastering NixOS, from installation to Flakes and reproducible development environments. Stop the "it works on my machine" chaos.
---
# Nixology: A Practical guide to NixOS and flakes

_"It works on my machine."_

It is the most expensive sentence in software development. We have spent decades trying to fix it with version managers (`nvm`, `pyenv`, `gvm`), virtual environments (`venv`), and containers (`Docker`). But these are just bandages. Underneath, your operating system is still a mutable, fragile mess of global libraries and conflicting dependencies.

**NixOS changes the paradigm.**

It treats your entire operating system like a git commit. You declare the state you want in a text file, and Nix builds it. If it breaks? You revert to the previous "commit" in the boot menu. If you need to share a project? You share a file, and your colleague gets the _exact_ same toolchain, bit-for-bit.

## Why this guide?

Learning Nix is notoriously difficult. The learning curve is a vertical wall. The documentation is vast but often academic. The ecosystem is split between "legacy" commands (`nix-env`) and "modern" commands (`nix flake`). Tutorials often lead you down the wrong rabbit hole, teaching you methods that were deprecated three years ago.

**Nixology is the pragmatic guide I wish I had.**

This is not a deep dive into functional programming theory. This is a roadmap for developers who want to get work done. We take a **"Flakes-First"** approach, skipping the legacy confusion and going straight to the modern standard for reproducible builds.

## The roadmap

We have broken this journey down into 9 core parts and several "Side Quests" for specific needs.

### Phase 1: The Foundation

- **[[01 Philosophy]]** Why do we need reproducible builds? The difference between the "Construction Site" (Linux) and the "Blueprint" (NixOS).
- **[[02 Installation]]** Installing NixOS the right way. Understanding the Read-Only Store and the Safety Net (Generations).
- **[[03 Nix Language]]** A crash course in Nix syntax. No theory, just the patterns you need to configure your system.
- **[[04 Configuration File]]** Writing your first system blueprint. Managing users, packages, and unfree software.
- **[[05 Basic commands]]** Survival tools. How to update, clean garbage, and use temporary shells.

### Phase 2: The Modern Workflow (Flakes)

- **[[06 Flakes]]** The turning point. Moving your config to Git and locking your dependencies for true reproducibility.
- **[[07 Nix commands]]** Mastering the modern tools: `nix run`, `nix shell`, and `nix build`.
- **[[08 Development Environment]]** The killer feature. Replacing Docker and NVM with project-specific development shells.
- **[[09 Useful Scripts]]** Scripts and workflows to make managing NixOS fast and ergonomic.

### Side Quests (Optional)

- **[[SQ Understanding Derivations]]** A peek under the hood at the atomic units of Nix.
- **[[SQ Gaming on NixOS]]** Setting up Steam, Nvidia drivers, and Proton-GE.
- **[[SQ Virtualization in NixOS]]** Docker, Podman, and KVM/Virt-Manager.
- **[[SQ Home Manager]]** Managing your dotfiles (`.zshrc`, `.vimrc`) declaratively.

### Who is this for?

This series is written for **Software Engineers** and **Power Users**. You don't need to be a Linux wizard, but you should be comfortable with a terminal. If you are tired of fragile systems and want to reclaim control over your computing environment, you are in the right place.

Let's begin: [[01 Philosophy]]