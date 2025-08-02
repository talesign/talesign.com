---
title: "Why I use NixOS: A developer's guide to sanity"
description: "How I manage projects environments in different languages without skipping a beat."
published: "2025-07-30"
updated: "2025-07-30"
---

If you're a developer, you know the chaos. Project A needs Node.js v18, but Project B requires v24. Your global Go version is perfect for one microservice but too new for another. It’s a constant, fragile dance of package managers, version managers, and hidden dependencies that can break your workflow at any moment. This is often called "dependency hell," and a while ago, I decided I'd had enough.

My solution was to switch my primary operating system to NixOS. At its core, NixOS is a Linux distribution that takes a radically different approach to system management. Instead of imperatively installing software and changing configs, you describe your entire system in a single file. This makes it:

- **Declarative:** You say _what_ you want your system to have, not _how_ to get it there.
- **Reproducible:** The same configuration file will produce the exact same system environment, every single time.

This simple shift in philosophy has brought order to my development world. Here’s how.

## One configuration to rule them all

The heart of my NixOS setup is a single file: `configuration.nix`. This file defines everything: my user account, networking settings, system-level packages, fonts, window manager—literally everything.

This gives me a complete bird's-eye view of my system. There's no "software pollution" from packages I installed once and forgot about. If it's not in the file, it's not permanently on my system. Because this is just a text file, I keep it in a Git repository. If my hard drive fails or I get a new machine, I can rebuild my entire development environment perfectly in a fraction of the time.

Here's a look at the structure of my configuration:

```nix
{ config, pkgs, inputs, ... }:

{
  imports = [
    ./hardware-configuration.nix
  ];

  nix.settings.experimental-features = [ "nix-command" "flakes" ];

  # Bootloader, Pipewire, OpenGL, Networking, etc.
  boot.loader.systemd-boot.enable = true;
  services.pipewire.enable = true;
  hardware.opengl.enable = true;
  networking.networkmanager.enable = true;

  # Timezone and Localization
  time.timeZone = "Europe/Rome";
  i18n.defaultLocale = "en_US.UTF-8";

  # Define my user and core settings
  users.users.oliviero = {
    isNormalUser = true;
    description = "Oliviero Taleghani";
    extraGroups = [ "networkmanager" "wheel" "audio" ];
    shell = pkgs.zsh;
  };

  # Allow non-free packages
  nixpkgs.config.allowUnfree = true;

  # Enable Hyprland and ZSH
  programs.hyprland.enable = true;
  programs.zsh.enable = true;

  # List of all system-wide packages
  environment.systemPackages = with pkgs; [
    # Basics
    neovim
    git
    lazygit
    # ... and many more
  ];

  system.stateVersion = "25.05";
}
```

## Isolated project environments with flakes

While `configuration.nix` defines my global system, the real magic for development comes from **Nix Flakes**. A Flake is a `flake.nix` file you put in a project's directory to define its exact dependencies. When you enter that environment those packages are available.

For example, here is a flake.nix for an Astro project:

```nix
{
  description = "Astro dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      # This defines a development shell
      devShells.${system}.default = pkgs.mkShell {
        # These packages will ONLY be available inside this shell
        packages = with pkgs; [
          nodejs_24
          pnpm
          nodePackages.prettier
          typescript-language-server
          # ... and other language servers
        ];
        # This command runs automatically when I enter the shell
        shellHook = ''
          tmux
        '';
      };
    };
}
```

With this file in my project folder, I can just type `nix develop`, and I get a perfect, isolated shell with `Node.js v24`, `pnpm`, and all the language servers I need. When I leave the shell, those packages are gone. My global system remains untouched. No more `nvm`, `asdf`, or `pyenv`.

For packages I just want to try once, I use `nix-shell -p <package-name>`. This gives me a temporary shell with that package, which is garbage collected later.

## From chaos to order

NixOS has a learning curve, there's no doubt about it. But the investment has paid off immensely. It has transformed my development process from a chaotic juggling act into a predictable, stress-free, and reproducible science. By defining my entire system and each project environment in code, I've gained a level of control and sanity that I don't think I could ever give up.
