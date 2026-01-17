---
title: Specter the Reaper
type: Personal
description: A Cuphead-inspired boss fight featuring a custom 2D animation engine I engineered in C# in Unity for high-fidelity, hand-drawn effects.
---
# Specter the Reaper

- **Source Code:** [GitHub](https://github.com/otaleghani/specter-the-reaper)
- **Play Online:** [talesign.itch.io](https://talesign.itch.io/specterthereaper)

Specter the Reaper is a tribute to the 1930s "rubber hose" animation style, channeled through the high-octane gameplay mechanics of Cuphead. The goal was to achieve high-fidelity, hand-drawn visuals without compromising on input responsiveness or frame precision.

## Engineering the Animation

Standard tools often hit a ceiling when dealing with complex, frame-by-frame 2D interactions. Finding Unity's native UI and animation tools too restrictive for the specific fluidity I needed, I engineered a **custom 2D animation engine in C#**.

This bespoke solution handles sprite rendering and frame timing directly, allowing for tighter control over the visual output and ensuring that the hand-drawn effects align perfectly with the gameplay logic.

## Game Architecture

Beyond the visuals, the game relies on a robust **Finite State Machine**. This architecture manages the complex behavior of the boss phases and the player's movement mechanics, ensuring that every dash, jump, and parry feels snappy and deterministic—crucial for this genre of difficult platformers.

## Play & Source

You can play the game directly in your browser or inspect the underlying architecture on GitHub.
<iframe frameborder="0" src="https://itch.io/embed/3467962?bg_color=000000&amp;fg_color=ffffff&amp;link_color=2aff20&amp;border_color=404040" width="552" height="167"><a href="https://talesign.itch.io/specterthereaper">Specter the Reaper by talesign</a></iframe>