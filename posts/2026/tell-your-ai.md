---
title: Ask Your AI To Fill This
description: <input type="ai">
published: 2026-02-10T10:00
lang: en
---

## Problem

I have [a service](/garage/weirdstats) for additional stats for activities from Strava. It's for personal use. Mostly. Among other features I want to be able to mute repetitive activities from other users' feed. For that I need _rules_ 

## Constructor UI

A rule can consist of different stats, like distance. All of them can be combined. I need a special UI. First version looked this:
![old ui for rules](/media/2026/weirdstats_rules.png)

But I quickly understood I need even more complicated engine. Do not want to implement, do not want to use.

## Text-editor with parser, validator and auto-complete

Why not instead adding a single huge text area, give some example for pseudo-language that can express condition, add validation and autocomplete? 

A code editor. Something from the work. This I can deal with. Could be _fun_.

## Natural Language input

Ok, now in 2026 writing _formal_ expressions is considered old-fashion and waste of keystrokes. People probably never will write regexes, Excel formulas and home brew DSL rules again. Not at the site like this.

It's simple. Let's add a request that some LLM on the backend will transform into a rule? But I don't want to deal with LLM keys, and local ones that I'm able to run on my [tiny server](/garage/tinyserve) are bad. And what will be with that LLM in two years?

## Ask Your AI

Okay, don't want to embed any AI, but can't ignore it. Just a copyable json schema and an input - past to UI and ask for writing. Last model, no complicated copyright. 

![/media/2026/weirdstats_ask_ui.png](weirdstats ask ui)

This is where I ended up. But it requires copy pasting, and still ocassionaly break. Not a big of a problem, and it's future proof in a way that agents can use it too.

## Browser or OS-level standard in the future

Temporary, in the old era, if LLM progress were frozen, we would have eventually something like this:

```
<input type="ai" validation="schema.json">
```

A special input, that browser recognizes and use AI that is tailored to you, making it very simple to create a rule.

But really, no need. All browsers soon if not already will be able to do it anyway, without any _hints_ from developers and just help with any kind of input everywhere.

And even then, only useful until the Singlarity.