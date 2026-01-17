---
title: "Side Quest: Virtualization (Docker & VMs)"
description: Enable Docker, Podman, and KVM/Virt-Manager on NixOS. Learn how to manage user permissions and declarative OCI containers.
---
# Side Quest: Virtualization (Docker & VMs)

As a developer, you rarely work on a "naked" operating system. You need containers for your database, maybe a Kubernetes cluster for testing, or a full Windows VM to test that one weird bug in Internet Explorer.

On traditional distros, setting up KVM or Docker involves installing packages, adding users to groups manually, and enabling systemd services. On NixOS, it's just a switch in your config.

## Containers (Docker/Podman)

You have two main choices here.

**Option A: Docker (The Standard)** If you need compatibility with existing tools that explicitly look for the Docker daemon, use this.

Add this to `configuration.nix`:


```nix
  virtualisation.docker.enable = true;
  
  # Useful for pruning images automatically
  virtualisation.docker.autoPrune.enable = true;
```

**Option B: Podman (The Modern Choice)** Podman is a daemonless, rootless alternative to Docker. It’s often preferred in the Nix ecosystem because it integrates better with systemd. It is command-line compatible with Docker.

```nix
  virtualisation.podman = {
    enable = true;
    # Create a "docker" alias so you can still type "docker run ..."
    dockerCompat = true;
    # DNS name resolution for containers
    defaultNetwork.settings.dns_enabled = true;
  };
```

**The "Gotcha": Permissions** By default, you need `sudo` to run docker commands. To fix this, you must add your user to the correct group.

Update your user config:

```nix
  users.users.oliviero = {
    # ... existing config
    # Add "docker" (if using Docker) or "podman" (if using Podman)
    extraGroups = [ "networkmanager" "wheel" "docker" ]; 
  };
```

_Note: You need to logout and login again for group changes to take effect._

## Virtual machines (KVM/QEMU)

For running full operating systems (like Windows or another Linux distro), **VirtualBox** is the old way. The Linux native way is **KVM/QEMU** with **Virt-Manager**. It’s faster (near-native performance) and built into the kernel.

To enable the backend (Libvirtd) and the frontend (Virt-Manager), add this:

```nix
  # Enable the background service
  virtualisation.libvirtd.enable = true;

  # Enable the GUI
  programs.virt-manager.enable = true;
```

**The "Gotcha": Permissions again** Just like Docker, you need to be in the `libvirtd` group to manage VMs without typing a password every time.

```nix
  users.users.oliviero = {
    extraGroups = [ "libvirtd" ... ]; 
  };
```

## OCI Containers

This is a bit advanced, but I want to show you the power of NixOS. Instead of running `docker run -d -p 5432:5432 postgres` and hoping it restarts when you reboot, you can **declare** containers in your system configuration.

This creates a systemd service that automatically downloads and runs the container on boot.

```nix
  virtualisation.oci-containers.containers = {
    my-postgres = {
      image = "postgres:15";
      ports = [ "5432:5432" ];
      environment = {
        POSTGRES_PASSWORD = "mysecretpassword";
      };
      # NixOS handles the auto-start and restart logic via systemd
    };
  };
```

This is perfect for setting up local databases that you want to always be available in the background.