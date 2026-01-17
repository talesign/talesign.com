---
title: "Nixology Part 6: Migrating NixOS to Flakes"
description: The ultimate guide to converting NixOS to Flakes. Move your config to /home, set up Git version control, and create your first flake.nix for reproducible builds.
---
# Part 6: Migrating NixOS to Flakes

Okay, now we have the big one: **Flakes**.

Up until now, you’ve been editing files in `/etc/nixos/`. This is fine for a set-and-forget server, but for a developer workstation, it has two massive problems:

1. **No Version Control:** If you delete a line and save, it's gone.
2. **No Lockfile:** If you update your system today, you get today's versions. If you update tomorrow, you get tomorrow's. You have no guarantee of exactly _which_ version of a package you are running.

In this part, we are going to move your entire operating system configuration into your home directory, wrap it in **Git**, and lock it down with **Flakes**.

## Enabling flakes

Flakes are technically still "experimental" (an inside joke in the community, as everyone uses them). To use them, we first need to tell your _current_ Nix installation to allow them.

Edit your current config one last time:

```bash
sudo nano /etc/nixos/configuration.nix
```

Add this line:

```nix
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

Rebuild your system to apply this change:

```bash
sudo nixos-rebuild switch
```

Now your system speaks "Flake". We are ready to move.

## The New Home

We are going to abandon `/etc/nixos`. Instead, we will use a standard folder in your config directory. I personally keep everything in `~/.config` so I can bundle it with my other dotfiles.

Here is the structure we are building:

```
.config
└── flake
    ├── flake.nix
    ├── flake.lock (generated automatically)
    └── hosts
        └── default
            ├── configuration.nix
            └── hardware-configuration.nix
```

Create this structure:

```bash
mkdir -p ~/.config/flake/hosts/default
cd ~/.config/flake
```

Now, copy your existing configuration files from the system folder to your new home. We need `sudo` to read them, but we want to own the new files:

```bash
sudo cp /etc/nixos/hardware-configuration.nix ./hosts/default/
sudo cp /etc/nixos/configuration.nix ./hosts/default/
sudo chown -R $USER ./hosts/default
```


## Understanding flakes

Now we are ready to create our first flake. The easiest way to start is with the initialization command:

```bash
nix flake init
```

This creates a `flake.nix` file in your current folder (`~/.config/flake/`). This file is the entry point. It tells Nix exactly which version of Nixpkgs to use and what to produce. For now, it contains placeholders, but they allow us to understand the anatomy of a flake.

Here is what a basic flake looks like, with comments explaining every part:

```nix
{
  # Metadata about the flake
  description = "A very basic flake";

  # Inputs: Sources you want to download and use
  inputs = {
    # We point to the official NixOS package repository (unstable branch)
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  # Outputs: A function that produces the actual data
  # It takes 'self' (the flake itself) and 'nixpkgs' (defined in inputs)
  outputs = { self, nixpkgs }: {

    # We define a package to be exported for x86_64-linux systems
    # The name of the package is 'hello'
    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    # We define the 'default' package.
    # This is what runs when you don't specify a package name.
    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;
  };
}
```

**Recap:**

1. **Inputs:** It downloads the `nixpkgs` repository (specifically the `unstable` branch).
2. **Outputs:** It defines two packages (`hello` and `default`). The `hello` package is just a reference to the one already inside the Nix repository.

## Declaring your system with flakes

Flakes can output packages, apps, or even entire OS configurations. We are going to replace the dummy `flake.nix` with one that defines your system.

Here is the configuration we will use:

```nix
{
  description = "System flake";

  inputs = {
    # We use the unstable branch for bleeding-edge software
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  # The @inputs syntax captures all arguments into a single variable
  outputs = { self, nixpkgs }@inputs: {
    
    nixosConfigurations = {
      # "default" is the hostname. 
      # If your computer has a different hostname, change this key!
      default = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";

        # specialArgs passes the 'inputs' variable down to your modules.
        # This allows your configuration.nix to access other flakes 
        # (like home-manager) in the future.
        specialArgs = { inherit inputs; };

        modules = [
          # We import your existing config
          ./hosts/default/configuration.nix
        ];
      };
    };
  };
}
```

### Connecting `hardware-configuration.nix`

We have connected the Flake to `configuration.nix`, but we need to ensure `configuration.nix` connects to `hardware-configuration.nix`.

Open `./hosts/default/configuration.nix` and check the imports at the top:

```nix
imports = [ ./hardware-configuration.nix ];
```

### The rebuild

Now we can rebuild the system using the Flake. We use the familiar command, but with a twist:

```
sudo nixos-rebuild switch --flake .
```

**How it works:**

- `--flake .` tells Nix to look in the current directory.
- It looks for a `nixosConfiguration` matching your current hostname.
- If you wanted to build a specific host (e.g., if you defined a `laptop` config), you would run:

```bash
sudo nixos-rebuild switch --flake .#laptop
```

**The Lockfile:** After running this, you will see a `flake.lock` file appear. This file "pins" the exact commit of `nixpkgs` you used. If you share this folder with a friend, they will get the **exact** same version of every package you have. That is true reproducibility.

## Git initialization

Nix Flakes has a strict rule: **It cannot see files that are not in Git.** If you create a new file but forget to `git add` it, Nix will complain that the file doesn't exist.

Let's initialize the repo:

```bash
git init
git add .
```

### Strategy: The Reverse Gitignore

Since this folder is inside `~/.config`, you might be tempted to commit all your dotfiles. But dotfiles are noisy. Programs dump cache and random data there.

I recommend a **Reverse Gitignore** strategy. We tell Git to ignore _everything_ by default, and then we whitelist only what we want.

Create a `.gitignore`:

```gitignore
# Ignore everything
*

# Whitelist git files
!.gitignore

# Whitelist the Flake
!flake.nix
!flake.lock

# Whitelist your NixOS config folder
!hosts/
!hosts/**

# Example: Whitelist specific dotfiles you want to track
# !nvim/
# !nvim/**
```

Now commit your system:

```bash
git add .
git commit -m "Initial flake migration"
```

## Managing Updates

In the old method, you ran `nix-channel --update`. With Flakes, you update the lockfile:

```bash
# Downloads the latest package list and updates flake.lock
nix flake update

# Applies the update to your system
sudo nixos-rebuild switch --flake .#default
```

**You unlocked a side quest**: check out [[SQ Gaming on NixOS]] if you are interested in gaming on NixOS.

**Next step**: [[07 Nix commands]]
**Previous step**: [[05 Basic commands]]
**Go back to the index**: [[Nixology]]