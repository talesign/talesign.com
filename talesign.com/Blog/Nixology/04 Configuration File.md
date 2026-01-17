---
title: "Nixology Part 4: Your First NixOS Configuration"
description: Configure users, enable proprietary software, and prepare for Flakes. Learn the difference between system packages and programs, and why you should never touch stateVersion.
---
# Part 4: Your First NixOS Configuration

You know the language. Now it is time to write the blueprint.

In this part, we are going to edit `/etc/nixos/configuration.nix` to set up a functional, daily-driver system. We will define your user, your core tools, and—crucially—prepare the system for the modern "Flakes" workflow we will adopt in the next article.

Open your configuration file:

```nix
sudo nvim /etc/nixos/configuration.nix
```

## The bootloader & networking

At the top of the file, you will see the bootloader settings. The installer usually gets this right, but it's good to verify.

```nix
{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  # Use systemd-boot (Modern, fast, works great with UEFI)
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # Networking
  networking.hostName = "nixos"; # Define your computer's name
  networking.networkmanager.enable = true; # Use the standard NetworkManager
}
```

**Pragmatic Tip:** Do not mess with manual `networking.wireless` configurations unless you are setting up a headless server. `networkmanager` gives you the `nmcli` tool and the GUI applet you are used to on Ubuntu/Fedora. It just works.

## User management

NixOS forces you to declare your user explicitly. **Warning:** If you delete this block and rebuild, you literally lock yourself out of the system.

```nix
  users.users.oliviero = {
    isNormalUser = true;
    description = "Oliviero Taleghani";
    # "wheel" allows 'sudo', "networkmanager" allows using the wifi GUI
    extraGroups = [ "networkmanager" "wheel" "audio" ];
    shell = pkgs.zsh; # We will enable ZSH in Section 6
  };
```

## The "allow unfree" switch

This is the first "Gotcha" for new users. By default, NixOS follows the Free Software Foundation's philosophy strictly. It will **refuse** to install proprietary software like Steam, Spotify, Discord, or NVIDIA drivers.

You probably want these. Add this line:

```nix
  nixpkgs.config.allowUnfree = true;
```

## System packages vs. project tools

This is where our "Pragmatic" philosophy kicks in. In `environment.systemPackages`, we only want **utilities** that are useful globally. We do **NOT** want specific language versions (like Node.js v18 or Python 3.11) here, because those belong in project folders (which we will cover in the next parts).

Add your core survival tools:

```nix
  environment.systemPackages = with pkgs; [
    # Editors
    neovim
    git

    # Utilities
    wget
    curl
    unzip
    ripgrep   # A faster grep
    fzf       # Fuzzy finder
    btop      # System monitor

    # Terminal
    tmux
  ];
```

## Enabling the future

We are going to migrate to **Nix Flakes** in the next few articles. To do that, we need to tell the current Nix installation that it is allowed to use them (since they are technically still "experimental").

**Add this block now.** It is essential for the rest of this series:

```nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

## The programs block

Some complex programs need more than just "installing"—they need system-level configuration (setting up `/etc/` files, environment variables, etc.).

For example, just adding `pkgs.zsh` to packages isn't enough; you need to tell NixOS to configure the shell environment.

```nix
  # Enable ZSH (so our user shell defined above actually works)
  programs.zsh.enable = true;

  # Example: Enable Hyprland (only if you want a tiling window manager)
  # programs.hyprland.enable = true;
```

## The trap: `system.stateVersion`

Scroll to the bottom of the file. You will see something like `system.stateVersion = "24.11";`. This is the most misunderstood line in NixOS.

**1. What you _think_ it does:** "This sets my OS version. If I want to upgrade to the next release, I change this number."
**2. What it _actually_ does:** It tells NixOS: _"I was originally installed as version 24.11, so please keep my database locations and config defaults compatible with 24.11."_

It exists to prevent data corruption. If PostgreSQL changes its default data directory in the next version, NixOS checks this number. If it sees the old version, it uses the old paths so you don't lose your data.

### When should you change it?

**Almost never.**

Even if you upgrade your entire system to a new release, you should **leave `system.stateVersion` exactly as it is**. You only change it if you are formatting the disk and doing a fresh install.

```nix
# Do not change this unless you know what you are doing!
system.stateVersion = "24.11";
```

## The feedback loop

Now that you have edited the file, save it. It is time to run the magic command:

```bash
sudo nixos-rebuild switch
```

**What just happened?**

1. **Parsing:** Nix read your file and checked for syntax errors (did you miss a semicolon?).
2. **Fetching:** It downloaded Zsh, Btop, and their dependencies.
3. **Building:** It constructed a new system environment.
4. **Switching:** It atomically swapped the symlinks.

If the command finished without red text, congratulations. You have successfully configured NixOS.

**You unlocked a side quest**: check out [[SQ Understanding Derivations]] to understand what derivations actually are and how the are used as the building block of NixOS. 

**Next step**: [[05 Basic commands]]
**Previous step**: [[03 Nix Language]]
**Go back to the index**: [[Nixology]]
