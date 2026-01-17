---
title: "Side Quest: Managing Dotfiles with Home Manager"
description: Learn how to manage your dotfiles using Nix. A guide to setting up Home Manager with Flakes to declaratively configure Git, Zsh, and VS Code.
---
# Side Quest: Managing Dotfiles with Home Manager

So far, we have managed the **System** (drivers, root users, system services). Now, we tackle the **User** (your home folder).

**Home Manager** is a tool that allows you to declare your dotfiles (`.zshrc`, `.gitconfig`, `.vimrc`) and user-specific packages using Nix.

## Understanding the tradeoff

Home Manager is powerful, but it comes with a cost.

- **The Pro:** Your entire home directory is reproducible. You can delete your user, recreate it, and have your VSCode themes and Git aliases back instantly.
- **The Con:** You lose the ability to quickly tweak config files. Want to change a font size in VSCode? You can't just open Settings. You have to edit `home.nix`, rebuild the system, and wait.

**My advice:** If you are a single user on a single machine and you like tweaking your UI often ("ricing"), Home Manager might feel too rigid. But if you manage multiple machines or multiple users, it is a superpower.

## System Space vs. User Space

When should you use `configuration.nix` vs `home.nix`?

|**Feature**|**NixOS (configuration.nix)**|**Home Manager (home.nix)**|
|---|---|---|
|**Scope**|Entire OS (Kernel, Drivers, Daemons)|Your User (Files in `~`)|
|**Packages**|`docker`, `steam`, `gnome`, `drivers`|`vscode`, `firefox`, `nerdfonts`, `spotify`|
|**Dotfiles**|Cannot touch your home folder|**Killer Feature:** Generates `.gitconfig`, `.zshrc`|
|**Portability**|Only works on NixOS|Works on Ubuntu, macOS (with Nix)|

## Adding Home Manager to Your Flake

We will integrate Home Manager directly into your existing system flake. This means running `sudo nixos-rebuild switch` will update both your system _and_ your dotfiles simultaneously.

Open your `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    
    # Add Home Manager input
    home-manager.url = "github:nix-community/home-manager";
    # Critical: Force HM to use the same nixpkgs version as the system
    # to avoid downloading duplicate packages.
    home-manager.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, home-manager, ... }: {
    nixosConfigurations.default = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./hosts/default/configuration.nix
        
        # Import the Home Manager module
        home-manager.nixosModules.home-manager
        {
          home-manager.useGlobalPkgs = true;
          home-manager.useUserPackages = true;
          
          # Define the user config
          home-manager.users.oliviero = import ./hosts/default/home.nix;
        }
      ];
    };
  };
}
```

## The `home.nix` File

Now create the file `hosts/default/home.nix`. This is where the magic happens.

```nix
{ config, pkgs, ... }:

{
  # Metadata
  home.username = "oliviero";
  home.homeDirectory = "/home/oliviero";

  # User packages
  # These are installed only for this user.
  home.packages = with pkgs; [
    htop
    ripgrep
    vlc
    spotify
    nerd-fonts.fira-code
  ];

  # Program configuration (The "Manager" Part)
  
  # Git: Never manually edit .gitconfig again
  programs.git = {
    enable = true;
    userName = "Oliviero Taleghani";
    userEmail = "you@example.com";
    aliases = {
      st = "status";
      co = "checkout";
      ci = "commit";
    };
    extraConfig = {
      init.defaultBranch = "main";
      pull.rebase = true;
    };
  };

  # Zsh: Manage your shell environment
  programs.zsh = {
    enable = true;
    enableCompletion = true;
    autosuggestion.enable = true;
    syntaxHighlighting.enable = true;
    
    shellAliases = {
      ll = "ls -l";
      update = "sudo nixos-rebuild switch --flake .";
    };

    initExtra = ''
      echo "Welcome back, Commander."
    '';
  };

  # VS Code: Managing extensions and settings
  programs.vscode = {
    enable = true;
    package = pkgs.vscode; 
    extensions = with pkgs.vscode-extensions; [
      bbenoist.nix         # Nix syntax support
      dracula-theme.theme-dracula
    ];
    userSettings = {
      "editor.fontSize" = 14;
      "workbench.colorTheme" = "Dracula";
      "nix.enableLanguageServer" = true;
    };
  };

  # Environment Variables
  home.sessionVariables = {
    EDITOR = "nvim";
    BROWSER = "firefox";
  };

  # State Version (Do not change)
  home.stateVersion = "24.11"; 
}
```

## Infinite Options

As you can see, we aren't just installing Git; we are configuring it. The options available are vast.

Whenever you want to configure a program, search the Home Manager Option Search at this [link](https://home-manager-options.extranix.com/.).

## Is it worth it?

You can handle your whole configuration with Nix thanks to Home Manager. But remember the trade-off.

For a gaming PC or a dedicated work machine where stability is king? Absolutely.

For a machine where you constantly tweak CSS themes, change fonts, and experiment with ricing? Maybe not.

The beauty of Nix is that it's your choice. You can use Home Manager for Git and Zsh, but leave VS Code manual. You are the architect.