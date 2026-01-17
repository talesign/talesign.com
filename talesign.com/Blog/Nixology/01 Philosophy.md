---
title: "Nixology Part 1: The Philosophy of NixOS"
description: Tired of "it works on my machine"? Learn why NixOS is the ultimate solution to dependency hell. A pragmatic, hybrid approach to declarative Linux systems.
---
# Part 1: The Philosophy of NixOS

If you are a developer, you know the chaos.

Project A needs Node.js v18, but Project B requires v24. Your global Go version is perfect for one microservice but too new for another. You install a library to test a feature, and three months later, you have no idea why it’s there or if deleting it will break your audio drivers.

It is a constant, fragile dance of version managers, global pollution, and "it works on my machine." This is the standard state of Linux development today: **Imperative Chaos.**

A while ago, I decided I’d had enough. Mostly because my Arch installation kept breaking. I know, I know—_git gud_. But after some time and plenty of frustration, my solution was to switch my primary operating system to **NixOS**. I realized I should have a machine that works for me, not the other way around.

However, I didn't do it the "purist" way. That would defeat the purpose of efficiency. I didn't spend weeks rewriting every single dotfile into a new language. Instead, I built a **hybrid workflow** that gives me the bulletproof stability of NixOS without sacrificing the speed of standard development tools.

This series is the simple guide I wish I had when I started. Because when you talk about NixOS, you aren't just talking about _another distro_. You are entering a confusing ecosystem with arguably terrible naming choices.

You have the language (Nix), the package manager (Nix), and the OS (NixOS). You have old commands (`nix-env`) versus new flake-based commands (`nix profile`). The sheer size of the ecosystem can be paralyzing. I've been looking at Nix for the better part of two years, and it feels infinite.

But if you look past the rough edges, Nix offers the best package repository, true reproducible builds, and unmatched stability. Once it clicks, it’s beautiful.

## Understanding the core differences

To understand why NixOS is different, let's look at a simple analogy.

**Traditional Linux is a Construction Site.** When you install software (e.g., `sudo apt install nginx`), you are changing the state of your machine _right now_. If you edit a config file, you are manually moving bricks. If you make a mistake, the wall collapses. If you want to replicate this setup on a new laptop, you have to remember every single command you ran over the last two years. Good luck with that.

**NixOS is a Blueprint.** NixOS takes a radically different approach. You don't install software; you _declare_ it. The same goes for adding users, managing drivers, or changing window managers.

Imagine you are on Plasma and want to try Gnome. On a traditional distro, installing a second desktop environment often pollutes your system with dependencies that are a nightmare to remove. You'd likely spin up a VM just to test it. In Nix, you just change a line in a configuration file. That's it. Want to revert? Remove the line, rebuild, and your system is immaculate again.

As I mentioned, in NixOS you describe your entire system in a single file (`configuration.nix`). In this file, you say:

- "I want these users."
- "I want these drivers."
- "I want these specific firewall rules."

When you want to change something, you edit the blueprint and tell NixOS to **switch**. Nix reads the plan and builds the system exactly as described.

This shift makes your OS:

1. **Declarative:** You say _what_ you want, not _how_ to install it.
2. **Reproducible:** The same file produces the exact same system, every time.
3. **Indestructible:** Every time you rebuild, NixOS creates a new "Generation." If you break your system, you just reboot and select the previous generation from the boot menu. It is essentially a time machine for your OS.

## Easing into the Ecosystem

Nix is not just an operating system; it is a vast ecosystem. You have **NixOS** (the OS), **Nixpkgs** (the repo), **Flakes** (project dependency management), and tools like **Home Manager** (user dotfiles).

The biggest mistake beginners make is trying to learn all of these at once. I was there, and it was painful: trying to write a theoretically pure configuration that manages everything from kernel modules down to the hex color of a terminal cursor. The result? Weeks spent reading documentation and fighting syntax errors instead of writing code. This is the infamous "Nix learning curve."

**My goal with this guide is to give you a sensible default.** We are going to take a **gradual approach** to get you up and running without the headaches:

1. **NixOS for the System:** We will use Nix where it offers the highest ROI: system stability, drivers, and package management.
2. **Standard Configs for the User:** We will keep your familiar workflow for dotfiles (`.config/nvim`, `.zshrc`). This means you don't have to relearn how to configure your favorite tools just to use this OS.
3. **Flakes for Projects:** We will use Nix to solve "dependency hell" in your actual development work.

This is not a rejection of the "pure" Nix way (tools like Home Manager are fantastic). It is simply a way to **ease into the ecosystem**. By keeping your user configuration standard, you lower the barrier to entry. You get a bulletproof, reproducible operating system today, and you can slowly adopt more advanced Nix features tomorrow—when you are ready.

**Next step**: [[02 Installation]]
**Go back to the index**: [[Nixology]]