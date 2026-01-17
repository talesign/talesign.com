---
title: "Nixology Part 7: Mastering the New Nix CLI"
description: Stop using legacy commands. Master the modern Nix workflow with nix run, nix shell, nix develop, and nix build. The definitive guide to the Flake CLI.
---
# Part 7: Mastering the New Nix CLI

Now that you have enabled "Flakes" and "Nix Command", you have unlocked a modern, unified command-line interface.

If you thought `nix-shell`, `nix-env`, and `nixos-rebuild` felt like a disjointed mess of legacy tools, you were right. The new CLI unifies everything under the single `nix` command.

Here is the cheat sheet mapping the old world to the new one:

|**Legacy Command**|**Modern Flake Command**|**Explanation**|
|---|---|---|
|`sudo nixos-rebuild switch`|**`sudo nixos-rebuild switch --flake .`**|Rebuilds your system using the `flake.nix` in the current directory.|
|`nix-channel --update`|**`nix flake update`**|Updates the `flake.lock` file to the latest commit hashes.|
|`nix-shell -p pkg`|**`nix shell nixpkgs#pkg`**|Starts a temporary shell with the package installed.|
|`nix-collect-garbage`|**`nix store gc`**|Runs the garbage collector to delete unused store paths.|
But the new CLI isn't just a rename. It introduces a powerful new workflow. Here are the **5 Essential Commands** you need to know.

## `nix run`

This allows you to download, build, and execute a package **without** installing it into your profile or modifying your shell environment. It is perfect for one-off tasks.

```bash
nix run nixpkgs#cowsay -- "Hello Nix!"
```

**What happens:** Nix checks if `cowsay` is in your store. If not, it downloads it, runs it, and exits. You get the app output without the system pollution.

**Running Flakes:** This is where it gets powerful. You can run _any_ flake directly from the internet. This effectively turns any GitHub repository into an executable app store.

```bash
# Run the 'default' app in the current directory
nix run .

# Run a specific output from a remote repo
nix run github:nixos/nixpkgs#hello
```

## `nix shell`

This is the younger, smarter brother of `nix-shell -p`. It modifies your `$PATH` for the current session to include specific tools.

**The Scenario:** You need `ripgrep`, `jq`, and `ffmpeg` to manipulate some files right now, but you don't want to install them permanently.

```
nix shell nixpkgs#ripgrep nixpkgs#jq nixpkgs#ffmpeg
```

**The Difference:** Unlike `nix run` (which executes one command and exits), `nix shell` drops you into a bash/zsh session where these commands exist. When you type `exit`, they vanish.

## `nix develop

**This is the most important command for developers.** While `nix shell` gives you _tools_, `nix develop` gives you an _environment_.

It looks at the `devShell` output of a `flake.nix` and sets up everything needed to hack on that project: compilers, language servers, linters, and environment variables.

**The Scenario:** You are working on a Go project. You need `go`, `gopls` (language server), and `golangci-lint`. Instead of installing these globally (and dealing with version conflicts between projects), you define them in the project's flake.

```bash
nix develop
```

This drops you into a **Development Environment**:

- It sets environment variables (e.g., `GOPATH`).
- It provides tools that exist _only_ for this project.
- It keeps your global system clean.

We will write our first Development Flake in **Part 8**, but just know that this command replaces tools like `virtualenv`, `nvm`, and `rustup`.

## `nix build`

When you are done coding and want to ship the binary to a server or a friend, you need a production artifact. `nix build` compiles your flake output and places the result in a local `./result` symlink.

```bash
nix build
```

**The Magic of `./result`:** When you run this, Nix compiles your software in a **strictly isolated sandbox** (no internet access, no access to `/usr/bin`).

If you look at `./result/bin/my-app`, that is your final production artifact.

- **Minimal:** It does not contain the Go compiler or the linter (unlike `nix develop`). It only contains the binary and the runtime libraries it needs.
- **Reproducible:** Because it was built in a sandbox, it is mathematically guaranteed to run exactly the same way on your server as it does on your laptop.

**The Pipeline:**

- **Dev:** `nix develop` (Everything you need to _write_ code).
- **Prod:** `nix build` (Only what you need to _run_ code).

## `nix flake ...`

These are the commands to manage the flake itself.

- **`nix flake init`**: Creates a boilerplate `flake.nix` in the current folder.
- **`nix flake update`**: Checks the internet for updates to your inputs (e.g., the latest NixOS Unstable) and updates the `flake.lock` file.
- **`nix flake check`**: A linter for your flake. It ensures your outputs are valid and error-free.

|**Goal**|**Old Command**|**New Command**|
|---|---|---|
|**Run a tool once**|`nix-shell -p pkg --run cmd`|**`nix run nixpkgs#pkg`**|
|**Get a temporary toolbox**|`nix-shell -p pkg`|**`nix shell nixpkgs#pkg`**|
|**Start coding**|`nix-shell`|**`nix develop`**|
|**Compile for release**|`nix-build`|**`nix build`**|
|**Install permanently**|`nix-env -i pkg`|_(Don't do this. Edit configuration.nix)_|

**Next step**: [[08 Development Environment]]
**Previous step**: [[06 Flakes]]
**Go back to the index**: [[Nixology]]