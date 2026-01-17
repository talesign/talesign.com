---
title: Nixploit
description: A reproducible penetration testing environment made with Nix, ready to launch with a single command.
type: Personal
---
# Nixploit

- **Source Code:** [GitHub Repository](https://github.com/otaleghani/nixploit)

Security environments are notoriously brittle. Dependencies conflict, updates break scripts, and maintaining a consistent toolkit across different machines is a challenge.

Nixploit leverages the power of **Nix Flakes** to solve this. It provides a purely declarative, reproducible penetration testing environment. Instead of maintaining a heavy virtual machine, Nixploit allows you to spin up a shell containing all your essential security tools with a single command. It guarantees that if it works on my machine, it will work on yours.

## Why Nix for Security?

- **Instant Provisioning:** No installation wizards or broken `apt-get` commands. The entire suite is downloaded and linked into an isolated environment automatically.
- **Zero Dependency Hell:** Nix ensures that tools with conflicting library requirements can coexist without issues.
- **Ephemeral or Permanent:** Use `nix develop` to drop into a temporary shell for a specific engagement, or install it into your profile for daily use.

## Usage

Nixploit is designed for speed and reliability. It abstracts the complexity of package management, allowing you to focus on the testing.

```bash
# Example: Launching the environment directly from GitHub
# This downloads dependencies and opens a shell with all tools ready
nix develop github:otaleghani/nixploit
```