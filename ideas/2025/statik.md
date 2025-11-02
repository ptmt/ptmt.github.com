---
title: Statik
status: idea
summary: Static site generator
lang: en
image: /media/placeholder.jpg
tags: [prototype, demo]
---

A set of scripts that can transform a set of markdown into a web-site. I've put some low-effort llm documentation, but I realize it's probably have zero re-usability. 

Reasons, randomly:

- __Procrastinatination__. *Just one more feature, bro. Just one more feature* Instead of writing posts, you build your web-site.
- __No end goal__. To me, it's not a product I should ship. Don't care about value. Maybe should, but I don't. It's my garage, where I invite my friends sometimes. 

### Constraints

- **As low dependencies as possible**. Currently it's Kotlin itself, Amper — a build system. Kotlin serialization (extended standard library). Ktor web server. Handlebars and Markdown parser. These two can be rewritten.

### Why don't PHP? Why GitHub Pages?

I have an intention to make it fully dynamic, but also don't want to host it in cloud. I don't remember why, but 10 years ago I didn't like storing web-site in git