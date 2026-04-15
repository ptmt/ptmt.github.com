---
title: Ask Your AI To Fill This
description: What if <input type="ai">
published: 2026-02-10T10:00
lang: en
---
I have [a small web-site in the garage](/garage/weirdstats) that calculates additional stats for Strava activities. Mostly for cycling. And also mute repetitive activities from other users' feed. For that muting I need _rules_. A rule can be very complex. Might consist of different stats, like distance. All of them can be combined, but I started small. 

### Constructor UI

So I need a special UI. First version looked like this:
![old ui for rules](/media/2026/weirdstats_rules.png)

It can be polished, thought-out, optimized. 

But I quickly understood I need even more complicated engine. Do not want to implement it, will not want to use it.

### Code editor

Why not instead adding a single huge text area, give some example for pseudo-language that can express condition, add validation and autocomplete? 

A code editor. Something I have experience with. This I can deal with. Could be _fun_. Text-editor with parser, validator and auto-complete. It could have been an assignment task a 5 years back. 

### Natural Language input

In 2026 writing _formal_ expressions is considered old-fashion and waste of keystrokes. People probably will never write regexes, Excel formulas and home brew DSL rules again. Almost certainly, tot at the site like this.

It's simple. Let's add a request that some LLM on the backend will transform into a rule? But I don't want to deal with LLM keys, and local ones that I'm able to run on my [tiny server](/garage/tinyserve) are bad. And what will happen with that LLM in two years?

Local LLM compiled in browser? That's much better. At the time of writing this, it's not yet there, but someday.

### Just Ask Your AI

Okay, don't keen on embedding LLMs, but can't ignore it. Instead: just a copyable json schema and an input - past to UI and ask for writing. Last model, no complicated copyright. 

![weirdstats ask ui](/media/2026/weirdstats_ask_ui.png)

This is what I ended up with. Requires copy pasting, and still ocassionaly break. Not a problem, and it's future proof in a way that agents can use it too.

### Browser or OS-level standard in the future

If LLM progress were frozen, we would have eventually something like this:

```
<input type="ai" validation="schema.json">
```

A special input, that browser recognizes and use AI that is tailored to you, making it very simple to create a rule.

But really, no need to bother. All browsers soon if not already will be able to do it anyway, without any _hints_ from developers and just help with any kind of input everywhere.

And even then, only useful we have traditional interfaces. If OpenClaw shown us anything, we may rethink the whole idea and people will just interact with the single entity. It'll solve prloblems by implementing Weirdstats under the hood, but you'll never even know about it. 