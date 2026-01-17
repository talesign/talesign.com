---
title: "Nixology Part 8: Perfect Dev Environments with Flakes"
description: Replace Docker and NVM with Nix Flakes. Learn how to create reproducible development environments (devShells) and build pipelines for Go, Node, and more.
---
# Part 8: Perfect Development Environments

We have used Flakes to build a system, but they can do so much more. In this article, we will see how to enclose your development tools inside a project.

**The Goal:**

- **No Pollution:** Tools exist only inside the project folder.
- **No Version Conflicts:** Project A uses Node 14, Project B uses Node 22. They never touch.
- **Zero Setup:** You clone the repo, run `nix develop`, and you are ready to code.

### The Problem with the "Old Way"

Let’s think about what you usually do when you start a project with Go, Node, and Python.

1. You install **Version Managers** (`nvm`, `gvm`, `pyenv`) because the system version is never the one you need.
2. You hope you remember to run `nvm use` every time you open a terminal.
3. You install global tools like `gopls` or `prettier`, hoping they match your compiler version.
4. Six months later, you try to run the project, but it breaks because you updated your global Node version.

This is "Dependency Hell." For a long time, the only solution was Docker. But Docker is heavy, slow, and isolates you from your file system.

**The Nix Way:** You drop a `flake.nix` in your project root.

- Type `nix develop` -> Everything appears.
- Type `exit` -> Everything vanishes.

## The development flake

As I said before, a flake can be so many things. So why not a development environment? Let’s build a real-world example. Suppose we are building a web app using **Go** (backend), **Node.js** (frontend), and **TailwindCSS**.

Run this in your project folder:

```bash
nix flake init
```

Now, edit `flake.nix`. Here is a complete setup (similar to what I use daily):

```nix
{
  description = "My Web App Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      # Helpers for the system architecture
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      # 'devShells' is the output used by 'nix develop'
      devShells.${system}.default = pkgs.mkShell {
        
        # The Tools
        packages = with pkgs; [
          # Go toolchain
          go
          gopls           # Go Language Server
          gofumpt         # Formatter
          air             # Live reload

          # Node for the frontend
          nodejs_22
          nodePackages.prettier
          tailwindcss_4
          typescript
          typescript-language-server # LSP for Neovim/VSCode
        ];

        # The Automation
        # This script runs automatically when you enter the shell
        shellHook = ''
          echo "Welcome to the dev environment!"
          
          # Fix path to run local npm binaries (like 'vite' or 'tailwind')
          export PATH="$PWD/node_modules/.bin:$PATH"

          # Example: Auto-start a Tmux session for this project
          if [ -z "$TMUX" ]; then
            tmux new-session -s my-project -d
            tmux send-keys 'nvim .' C-m
            tmux attach-session -t my-project
          fi
        '';
      };
    };
}
```

## The power of declaring everything

Declaring your development environment like this has many advantages: 

**1. The `packages` list** We requested `go`, `nodejs_22`, and specific Language Servers (`gopls`, `typescript-language-server`).

- Nix ensures that `gopls` is compatible with the `go` version we requested.
- We didn't install `typescript` globally. It exists _only_ here.
- Every version is pinned by the `flake.lock` file. If you share this repo with a colleague, they get the exact same binary of Node.js.

**2. The `shellHook`** This is where Nix shines. The `shellHook` is a bash script that runs the moment you enter the environment. In my example:

- **PATH Fixing:** I added `node_modules/.bin` to the PATH. Now I can run `tailwind` or `vite` directly without `npm run ...`.
- **Workflow Automation:** It checks if I'm in Tmux. If not, it creates a session, launches Neovim, and attaches to it.

**Try it:** Save the file and run:

```bash
nix develop
```

**In one second:**

1. Nix downloads Node 22 and Go.
2. It sets up your environment variables.
3. It launches Tmux and Neovim.
4. Your LSP starts working immediately because it found `gopls` in the path.

You are ready to code. No "Read the README," no manual installs.

---
## From Dev to Prod

`nix develop` is for _writing_ code. `nix build` is for _shipping_ it. To make that work, we need to add a `packages` output to our Flake.

Let's assume this is a Go application. We can use the `buildGoModule` helper function.

Add this inside your `outputs` block (before the closing brace of the `in` block):

```nix
  packages.${system}.default = pkgs.buildGoModule {
    pname = "my-web-app";
    version = "1.0.0";
    src = ./.; # Use the current directory as source

    # CRITICAL: The Vendor Hash
    # Nix builds are sandboxed. They cannot download Go modules from the internet
    # unless you provide the hash of those modules beforehand.
    # 
    # How to find it? Set it to 'fakeHash' first. 
    # The build will fail and Nix will print the REAL hash in the error message.
    # Copy that hash and paste it here.
    vendorHash = pkgs.lib.fakeHash; 
    
    # Need to generate CSS before compiling Go? Do it here.
    # nativeBuildInputs are tools needed ONLY at build time.
    nativeBuildInputs = [ pkgs.tailwindcss_4 ];
    
    preBuild = ''
      tailwindcss -i ./assets/input.css -o ./assets/style.css
    '';
  };
```

Now run:

```bash
nix build
```

The first time, it will fail (as expected) because of the `fakeHash`. Copy the correct hash from the error message, update your `flake.nix`, and run it again. You will see a `./result` symlink appear containing your compiled binary.

## Running the app 

Finally, if you want to let people run your app directly from GitHub without cloning the repo, you define an `apps` output.

```
  apps.${system}.default = {
    type = "app";
    # Point to the binary inside the package we defined above
    program = "${self.packages.${system}.default}/bin/my-web-app";
  };
```

Now, anyone in the world can run your app with one command:

```bash
nix run github:yourname/my-web-app
```

This allows you to ace even the build/run step of your project. Now think about how easy it could be to deploy with a flake? It's a matter of a one liner. No errors, no problems! The "It works in my machine" curse is no more!

## Summary

This is the holy grail of DevOps:

1. **Dev:** `nix develop` (A reproducible environment to write code).
2. **Build:** `nix build` (A reproducible binary artifact).
3. **Run:** `nix run` (Instant execution).

All defined in a single text file.

**You unlocked a side quest**: check out [[SQ Virtualization in NixOS]] to understand how to setup virtualization directly in your configuration.

**Next step**: [[09 Useful Scripts]]
**Previous step**: [[07 Nix commands]]
**Go back to the index**: [[Nixology]]