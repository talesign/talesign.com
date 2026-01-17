---
title: "Side Quest: Gaming on NixOS (Steam, Nvidia & Proton)"
description: Turn NixOS into a gaming machine. A guide to enabling Steam, proprietary Nvidia drivers, Gamescope, and installing Proton-GE for maximum compatibility.
---
# Side Quest: Gaming on NixOS

There is a myth that Linux gaming is hard. On NixOS, it's actually easier than on Windows in some ways. Why? Because you declare your drivers, your Steam configuration, and your optimizations in one file. If you mess it up, you just rollback.

Here is how to turn your developer workstation into a gaming rig.

## Hardware acceleration

First, we need to ensure the kernel allows applications to use your GPU for rendering. Add this to your `configuration.nix`:

```nix
  # Enable OpenGL/Vulkan
  hardware.graphics = {
    enable = true;
    enable32Bit = true; # Crucial for running 32-bit games (like Wine/Proton)
  };
```

## Video drivers

You need to tell NixOS which kernel modules to load.

**For AMD:** It usually "just works" with the open-source stack, but we explicitly enable it for XServer/Wayland.

```nix
  services.xserver.videoDrivers = [ "amdgpu" ];
```

**For NVIDIA:** This is where Linux usually gets messy, but NixOS simplifies it. _Note: Ensure you allowed unfree packages as shown in Part 4._

```
  services.xserver.videoDrivers = [ "nvidia" ];
  
  # Essential Nvidia settings
  hardware.nvidia = {
    modesetting.enable = true;
    open = false; # Use proprietary drivers (better performance for games)
  };
```

_If you are on a laptop with Hybrid Graphics (Intel CPU + Nvidia GPU), you need "Optimus." Check the [NixOS Wiki](https://nixos.wiki/wiki/Nvidia) for the specific `hardware.nvidia.prime` configuration._

## Steam and its optimizations

We don't just want Steam; we want the optimized Linux gaming stack. Steam on Linux relies on **Proton**, a compatibility layer that translates Windows DirectX calls into Vulkan.

Add this block to enable everything at once:

```nix
  programs.steam = {
    enable = true;
    remotePlay.openFirewall = true; # Open ports for Steam Remote Play
    dedicatedServer.openFirewall = true; # Open ports for Source Dedicated Server
    
    # Enable Gamescope (the micro-compositor used on the Steam Deck)
    gamescopeSession.enable = true;
  };

  # Optimize system performance for gaming on demand
  programs.gamemode.enable = true;
```

**What is Gamemode?** It's a daemon that allows games to request a set of optimizations (like CPU governor performance mode) temporarily. Many games auto-detect this.

## Advanced: Proton-GE

The standard Proton built into Steam works for 90% of games. But for the bleeding edge (or stubborn older titles), you want **Proton-GE** (`GloriousEggroll`).

Since Proton-GE updates weekly (faster than Nixpkgs), it is painful to manage purely declaratively. We will use a pragmatic, hybrid approach.

**Step 1: Install the helper tool** Add this to your `environment.systemPackages`:

```nix
  environment.systemPackages = with pkgs; [
    protonup
  ];
```

**Step 2: Tell Steam where to look** We need to set an environment variable so Steam knows where to find the custom compatibility tools we are about to install.

```nix
  environment.sessionVariables = {
    STEAM_EXTRA_COMPAT_TOOLS_PATHS = "\${HOME}/.steam/root/compatibilitytools.d";
  };
```

**Step 3: Install it (Imperatively)** After rebuilding your system (`sudo nixos-rebuild switch --flake .`), open a terminal and run:

```bash
protonup
```

This tool downloads the latest Proton-GE and places it in the folder we defined. Restart Steam, right-click a game, go to **Properties > Compatibility**, and you will now see `GE-Proton` in the list.