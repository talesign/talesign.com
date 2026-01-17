---
title: "Nixology Part 3: The Nix Language Crash Course"
description: Nix syntax explained for developers. Learn about attribute sets, lists, with, inherit, and how to avoid the common semicolon syntax errors.
---

# Part 3: The Nix Language (Crash Course)

Before we touch any more settings, we need to address the elephant in the room: **Nix is a programming language.**

Most Linux distros use static files (INI, TOML, YAML) for configuration. You just list things. Nix is different because it uses **Functional Programming**.

But don't worry—you don't need a Computer Science degree to configure your WiFi. You just need to recognize patterns. We won't do a deep dive into the theory (we are pragmatic developers, after all). Instead, we will look at the specific syntax you will encounter 99% of the time in your `configuration.nix`.

## The file structure

If you look at the top of your `configuration.nix`, you will see something like this:

```nix
{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];
  # ... options
}
```

That top part isn't a "library import" in the traditional sense. It’s a **Function Definition**. The entire file is actually a function.

- **The Inputs:** `{ config, pkgs, ... }` are the arguments passed _into_ your file by the system.
- **The Output:** The second set of curly braces `{ ... }` is what the function returns: your system configuration.

**The Ellipsis (`...`):** This just means "ignore any other arguments passed to this function that I haven't explicitly named." It’s good practice to keep it there.

## The data structures

Nix is essentially JSON with functions. You only need to master two main structures.

### Attribute sets `{ ... }`

This is the building block of everything. An attribute set is a collection of key-value pairs. If you know JSON objects or Python Dictionaries, this is it.

The only difference is we use the equal sign `=` instead of a colon `:`.

```nix
{
  boot.loader.systemd-boot.enable = true;
  networking.hostName = "nixos";
}
```

You can access nested attributes using dots, which is why `boot.loader.systemd-boot.enable` works. It is shorthand for:

```nix
boot = {
  loader = {
    systemd-boot = {
      enable = true;
    };
  };
};
```

### Lists `[ ... ]`

This is an ordered collection of things, wrapped in square brackets. We use this for lists of packages, firewall ports, or users.

**CRITICAL RULE:** Items are separated by **spaces**, not commas!

```nix
# Correct
environment.systemPackages = [ vim git curl ];

# WRONG (This will throw an error)
environment.systemPackages = [ vim, git, curl ];
```

## Syntax sugar

Nix has a few keywords designed to make your life easier (or harder, if you don't know what they do).

### `with`

You will see this everywhere, specifically: `with pkgs; [ ... ]`. This creates a "scope." It tells Nix: "Look inside the `pkgs` set for any variables found in this list."

Without `with`:

```nix
environment.systemPackages = [ pkgs.vim pkgs.git pkgs.curl ];
```

With `with`:

```nix
environment.systemPackages = with pkgs; [ vim git curl ];
```

### `let ... in`

This allows you to define local variables for use within the block. It’s great for avoiding repetition.

```nix
let
  myVersion = "1.2.3";
in
{
  program.version = myVersion;
}
```

### `inherit`

This is the lazy developer's best friend. It takes a value from the scope above and assigns it to a key of the same name.

Instead of writing:

```nix
specialArgs = { inputs = inputs; };
```

You write:

```nix
specialArgs = { inherit inputs; };
```

## The semicolon

This is the number one cause of frustration. In Nix, **every expression must end with a semicolon.**

- Defining a variable? Semicolon.
- Closing a list definition? Semicolon.
- Importing a module? Semicolon.

If you get a generic "Syntax Error," 99% of the time, you missed a `;` at the end of a line.

## Multiline Strings

If you need to write a script or a long config file inline, use two single quotes `''`.

```nix
shellHook = ''
  echo "Hello from multi-line!"
  echo "This preserves indentation and newlines."
'';
```

## It's dangerous to go alone! Take this.

Since Nix is a language, you should treat it like one. Don't edit raw text without help. I strongly recommend installing these two tools in your `environment.systemPackages`:

1. **`nixfmt`**: An opinionated formatter (like Prettier/GoFmt). It keeps your curly braces sane.
2. **`nil`**: The Nix Language Server. If you use VS Code or Neovim, this gives you autocompletion and error detection _before_ you rebuild.

## Going beyond

Nix is a Turing-complete language. This means you _could_ technically write a video game or a web server entirely inside the configuration language. While theoretical computer scientists love this, as a pragmatic developer, try to keep your logic simple. Just because you _can_ write complex map/reduce functions to generate your firewall rules doesn't mean you _should_.

Keep your "Blueprint" readable. And leave the Doom port to others.

**Next step**: [[04 Configuration File]]
**Previous step**: [[03 Nix Language]]
**Go back to the index**: [[Nixology]]