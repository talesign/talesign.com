---
title: Prism
description: An opinionated, state-first NixOS distribution that refracts your operating system into distinct, purpose-driven identities.
type: Open source
---
# Prism

- **Source Code:** [GitHub](https://github.com/otaleghani/prism)
- **Documentation:** [prism.talesign.com](https://prism.talesign.com)

Prism was born from a rejection of digital entropy. Most Linux distributions start clean but inevitably succumb to "clutter"—work tools mix with gaming libraries, and system configs drift into instability. I needed an OS that could adapt to _me_, rather than forcing me to manage _it_.

Prism refracts a single machine into multiple, isolated **profiles**. Whether I am compiling code, penetration testing, or gaming, the system reconfigures itself to that specific identity. Built on the atomic reliability of NixOS, it treats the entire operating system state as a single, reproducible equation.

## Key Features

- **The Profile Engine:** Prism eliminates context switching overhead by enforcing distinct environments. The **Developer** persona provides flake-powered toolchains; the **Gamer** persona optimizes the kernel for low-latency input and Gamescope; and the **Custom** persona offers a minimalist blank slate for purists.
- **Keyboard-First Workflow:** Designed for speed, Prism integrates **Hyprland** with a "Home Row" philosophy. Windows are managed via dynamic groups, and essential tools like the terminal (**Ghostty**) and file manager (**Yazi**) are treated as first-class citizens, instantly accessible without lifting a hand.
- **Reactive UI Engine:** Unlike distributions that rely on standard desktop environments, Prism features a bespoke shell built with **Quickshell**. This allows for a UI that communicates directly with kernel primitives—bypassing standard bloat to render real-time system metrics and audio visualizations at 60fps with negligible resource usage.

## Engineering & Reliability

Prism is not just a collection of dotfiles; it is a platform built on modern engineering primitives.

To solve the fragility of rolling-release distributions, I engineered a custom update mechanism (`prism-update`) that acts as a gatekeeper for system stability. Instead of blindly pulling the latest upstream changes, Prism fetches maintainer-verified tags from GitHub, modifies the system's declarative configuration in real-time, and performs an atomic rebuild.

This approach ensures that every update is fully reversible. If a new configuration fails to build, the system state remains untouched. If a boot fails, the atomic nature of Nix allows for an instant rollback to the previous generation.

```bash
# The Prism Update Logic
# A custom-engineered wrapper that ensures atomic, verifiable system updates.
# It queries the GitHub API for stable releases, allowing the user to "refract" 
# their system to a specific snapshot interactively.

#!/usr/bin/env bash
RELEASES=$(curl -s "https://api.github.com/repos/otaleghani/prism/releases")
TAGS=$(echo "$RELEASES" | jq -r '.[].tag_name')

# Interactive fuzzy selection prevents typos and version mismatches
SELECTED=$(echo "$TAGS" | fzf --prompt="Select Prism Refraction > " --layout=reverse)

# Modifies the system flake in-place to lock dependencies to the chosen tag
sed -i "s|prism.url = \".*\";|prism.url = \"github:otaleghani/prism/$SELECTED\";|" /etc/prism/flake.nix

# Triggers a NixOS atomic rebuild
nixos-rebuild switch --flake "/etc/prism#prism"
```