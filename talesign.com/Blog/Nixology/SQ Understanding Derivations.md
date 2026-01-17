---
title: "Side Quest: What is a Nix Derivation? | Nixology"
description: Derivations are the atomic units of Nix. Learn how Nix translates code into reproducible build instructions and why hashes are the secret to dependency isolation.
---
# Side quest: Understanding derivations

In the main guide, we talk a lot about "Packages" and "Flakes." But if you peel back the layers of Nix, you will find the atomic unit that makes everything possible: the **Derivation**.

If NixOS is the blueprint of a building, Derivations are the instructions for molding every individual brick.

## Derivations are recipes

When you reference a package like `pkgs.hello`, you aren't pointing to a binary file sitting on a server. You are pointing to a **Derivation**—a precise recipe that tells Nix exactly how to build that software from source.

If we dig into the official [Nixpkgs repository](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/he/hello/package.nix), we find the file that defines `hello`. It looks roughly like this:

```nix
# Every program in Nix is a derivation
stdenv.mkDerivation (finalAttrs: {
  pname = "hello";    # Name
  version = "2.12.2"; # Version

  # THE SOURCE
  # 'fetchurl' downloads the raw source code
  src = fetchurl {
    url = "mirror://gnu/hello/hello-${finalAttrs.version}.tar.gz";
    # The hash ensures security & reproducibility:
    # If the downloaded file changes by even one bit, the build fails.
    hash = "sha256-WpqZbcKSzCTc9BHO6H6S9qrluNE72caBm0x6nc4IGKs=";
  };

  # THE BUILD INSTRUCTIONS
  # By default, stdenv assumes a standard "./configure && make && make install"
  # loop, but you can override phases here.
})
```

### From code to store path

This function `stdenv.mkDerivation` is the workhorse of the entire ecosystem. When Nix evaluates this code, it doesn't build the software immediately. Instead, it calculates a **Cryptographic Hash** of all the inputs:

1. The source code hash.
2. The compiler version (GCC/Clang).
3. The libraries it links against (Glibc, etc.).
4. The build script text itself.

It combines all these factors into a unique string, something like `/nix/store/h19lnffd...-hello-2.12.2`.

**This is the magic moment.** Before building, Nix checks its specific database (the Store).

- **Does this path exist?** Great, use it. Instant access.
- **Does it not exist?** Check a binary cache (like cache.nixos.org).
- **Not there either?** Only _then_ does it execute the build instructions in the derivation to create that path.

## The base of NixOS

Understanding Derivations is key to understanding why NixOS is "indestructible."

Your entire operating system is just one giant Derivation. When you run `nixos-rebuild switch`, you aren't "updating" files in place. You are asking Nix to evaluate a massive tree of derivations—from the Linux Kernel up to your Neovim config files—and produce a new system output path.

- If you change your wallpaper? That creates a new derivation hash.
- If you change a kernel module? New derivation hash.

Because every component is built in isolation based on these strict recipes, "Dependency Hell" becomes mathematically impossible. Project A's `openssl` derivation has a different hash than Project B's `openssl` derivation, so they can coexist peacefully forever.