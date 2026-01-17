---
type: Personal
title: Zigboy
description: An exploration into systems programming and hardware emulation by building a Gameboy (DMG) emulator in Zig.
---
# Zigboy

- **Source Code:** [GitHub Repository](https://github.com/otaleghani/zigboy)

Building an emulator is one of the most rigorous ways to learn a new language. Zigboy started as a deep dive into **Zig**, aiming to understand its manual memory management and compile-time capabilities by replicating the architecture of the original Gameboy (DMG).

It was a complex engineering challenge that required bridging the gap between modern software design and 1989 hardware constraints.

## System Architecture

The emulator faithfully recreates the core components of the console:

- **CPU (SM83):** A complete implementation of the Sharp SM83 instruction set (a Z80 variant), handling all opcodes and timing quirks required for logic execution.
- **PPU (Picture Processing Unit):** The graphics pipeline supports background tiles, window rendering, and sprites, allowing many classic titles to render correctly.
- **Memory & Cartridges:** Beyond simple ROM-only games, Zigboy supports **MBC1 (Memory Bank Controller 1)**, enabling the bank switching necessary for larger, more complex games.
- **APU (Audio):** A basic implementation of the sound hardware is included. _Note: Audio is currently experimental and can be disabled at build time to prioritize emulation speed._

## Debugging & Verification

To ensure accuracy, I integrated rigorous debugging tools. The emulator includes flags to dump the CPU state, generating logs compatible with **Gameboy Doctor**. This allowed me to compare my emulator's execution tick-by-tick against verified logs to squash logic bugs.