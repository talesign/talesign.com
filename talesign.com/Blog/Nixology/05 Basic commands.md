---
title: "Nixology Part 5: Essential NixOS Commands"
description: Master the core NixOS commands. Learn the difference between rebuilding and upgrading, how to use temporary nix-shells, and how to clean up your disk space.
---
# Part 5: Essential NixOS Commands

You have your config, and you know the language. Now, let's master the tools. These are the four commands you will use 99% of the time.

## Applying changes (`nixos-rebuild switch`)

This is your daily driver. Whenever you edit `configuration.nix` (to add a package, change a user, or tweak a setting), you run this:

```bash
sudo nixos-rebuild switch
```

It does three things atomically:

1. **Builds** your new configuration.
2. **Creates** a new "Generation" in the boot menu.
3. **Switches** the running system to the new config immediately.

**The "Test" Variant:** If you are tweaking something risky (like network drivers or kernel modules), use:

```bash
sudo nixos-rebuild test
```

This switches to the new configuration **without** adding it to the boot loader. If you break your WiFi, just reboot, and you are back to the previous stable state automatically.

## Updating packages (`nix-channel`)

This is where Nix differs from Arch or Debian. Running `nixos-rebuild switch` **does not update your package versions**. It only rebuilds your config based on the _current_ definition of packages it downloaded weeks ago.

To actually update your system (get the latest Firefox, Kernel, etc.), you need to update the definitions first:

```bash
# Download the latest package list
sudo nix-channel --update

# Rebuild your system against this new list
sudo nixos-rebuild switch
```

**The Shorthand:** You can do both in one command:

```bash
sudo nixos-rebuild switch --upgrade
```

## Temporary shells (`nix-shell`)

Need `htop` for five minutes? Need `python` to run one script? **Do not install them globally.**

Polluting your global config with one-off tools defeats the purpose of Nix. Instead, pop into a temporary shell:

```bash
nix-shell -p htop
```

This downloads `htop`, drops you into a shell where it exists, and when you type `exit`, it is gone.

### The `shell.nix` file

You can save these environments into a file called `shell.nix` to share with your team. This is the ancestor of Flakes (which we will cover next), but it's still useful to know.

Create a file named `shell.nix`:

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # List packages available in this shell
  packages = with pkgs; [
    python3
    python311Packages.requests
    git
    neofetch
  ];

  # Set environment variables
  MY_PROJECT_ROOT = "/tmp/my-project";

  # Run this automatically when entering the shell
  shellHook = ''
    echo "------------------------------------------------"
    echo "Welcome to the custom dev environment!"
    echo "------------------------------------------------"
    alias run="python3 app.py"
  '';
}
```

Now, navigate to that folder and run just `nix-shell`. Nix detects the file, builds the environment, and drops you in.

### The script magic

You can even write standalone scripts that fetch their own dependencies. This is magic for portability.

Create a file `myscript.sh`:

```bash
#! /usr/bin/env nix-shell
#! nix-shell -i bash -p cowsay figlet

# The lines above tell Nix to fetch 'cowsay' and 'figlet'
# BEFORE running the rest of the script.

figlet "It Works!"
cowsay "No global install needed!"
```

## Cleaning up (`nix-collect-garbage`)

Because Nix never deletes files (it just creates new versions), your disk **will** fill up. Old versions of Firefox and Kernel modules stick around in the Nix Store to allow rollbacks.

To delete old generations and free up space:

```bash
# Delete everything not currently in use by the running system
sudo nix-collect-garbage -d
```

**Warning:** Once you run this, you cannot rollback to yesterday’s config anymore. Only do this when your system is stable!

**Next step**: [[06 Flakes]]
**Previous step**: [[04 Configuration File]]
**Go back to the index**: [[Nixology]]