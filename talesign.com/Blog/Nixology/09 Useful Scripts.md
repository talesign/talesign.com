---
title: "Nixology Part 9: Automating Your Workflow with Scripts"
description: "Don't type long commands. Use these bash scripts to automate system updates, project creation, and environment switching. Plus: Survival tips for when things break."
---
# Part 9: Automating the Workflow

We have built a system that is powerful, reproducible, and isolated. But let's be honest: typing `nix develop` or long rebuild commands every day is tedious.

Efficiency isn't just about build times; it's about reducing friction. In this article, I’ll share the custom scripts I use to turn complex Nix operations into instant keystrokes.

## Instant config access (`edit-system`)

When I want to change my system, I usually need two things:

1. My editor open to `configuration.nix`.
2. A browser open to `search.nixos.org` (to find package names).

I don't want to open these manually. I use a script bound to `SUPER+CTRL+U`.

```bash
#!/usr/bin/env bash

# Open Terminal (I use Ghostty, replace with Alacritty/Kitty as needed)
# This launches a new window, creates a tmux session, and opens Neovim.
ghostty --working-directory="$HOME/.config/flake" \
    --command="tmux new-session 'nvim hosts/default/configuration.nix'" &

# Open the browser documentation
chromium "https://search.nixos.org/packages" &
```

**The Result:** I hit one key combo, and my entire "System Admin" workspace loads in half a  second.

## The one-click update (`update-system`)

Why remember the long rebuild command? I wrap the entire update process in a function that I can call from anywhere.

```bash
#!/usr/bin/env bash

update_system() {
  echo "Updating NixOS System..."
  
  # Rebuild the system using the flake in my config folder
  # (Adjust the path if your flake is named differently)
  if sudo nixos-rebuild switch --flake ~/.config/flake#default; then
      echo "System Updated Successfully!"
      notify-send "NixOS" "System Updated Successfully"
  else
      echo "❌ Update Failed!"
      read -r -p "Press Enter to inspect errors..."
  fi
}

export -f update_system
# Launch it in a new terminal window so I can see the logs
ghostty -e bash -c "update_system"
```

I bind this to `SUPER+SHIFT+U`. Now, updating my OS is just a reflex. It handles the `sudo` prompt, shows me the build log, and waits for confirmation only if things go wrong.

## The project launcher (`open-project`)

I have dozens of projects in `~/workspace`. I don't want to `cd` into them manually. I want a Spotlight-like interface to pick a project and instantly drop into its `nix develop` shell.

This script combines `find`, `fzf` (fuzzy finder), and `nix develop`:

```bash
#!/usr/bin/env bash
open_project() {
  set -e

  # List all directories in my workspace
  PROJECTS=$(find ~/workspace/* -maxdepth 0 -type d)
  
  if [ -z "$PROJECTS" ]; then
    notify-send "No projects" "No projects found in ~/workspace"
    exit 1
  fi

  # Use fzf to pick one
  # We show only the folder name, but keep the full path for the command
  SELECTED_PATH=$(echo "$PROJECTS" | fzf --format=path)

  if [ -z "$SELECTED_PATH" ]; then
    exit 0
  fi

  # Launch the dev shell
  # We enter the folder and replace the current shell with the Nix environment
  cd "$SELECTED_PATH"
  echo "Entering nix devshell for $(basename "$SELECTED_PATH")..."
  exec nix develop -c "$SHELL"
}

export -f open_project
ghostty -e bash -c "open_project"
```

**The Workflow:**

1. I hit `SUPER+SHIFT+A`.
2. A window pops up with a fuzzy list of all my projects.
3. I type "zig" and hit Enter.
4. Boom—I am inside the `zigboy` project environment with the compiler and LSP ready.

## The project generator (`init-project`)

Creating a new project usually involves the same boring dance: make folder, git init, flake init, gitignore... Let's automate it to take 5 seconds.

```bash
#!/usr/bin/env bash

init_project() {
  set -e
  WORKSPACE_DIR="$HOME/workspace"

  # Ask for name
  read -r -p "Enter project name: " project_name
  PROJECT_DIR="$WORKSPACE_DIR/$project_name"
  
  mkdir -p "$PROJECT_DIR"
  cd "$PROJECT_DIR"

  # Create the flake
  echo "Initializing nix flake..."
  nix flake init

  # Setup git
  echo "Initializing git..."
  git init
  echo "/result" >> .gitignore
  echo ".direnv" >> .gitignore

  # Open editor immediately
  exec nvim flake.nix
}

export -f init_project
ghostty -e bash -c "init_project"
```

I bind this to `SUPER+CTRL+A`.

**Next step**: [[SQ Gaming on NixOS]]
**Previous step**: [[08 Development Environment]]
**Go back to the index**: [[Nixology]]