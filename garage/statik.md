---
title: Statik
template: idea 
status: active
summary: Opionated single-purpose web-site generator
# image: /media/placeholder.jpg
link: https://potomushto.com/statik/
github: https://github.com/ptmt/statik
tags: [kotlin, web]
---

A set of scripts that can transform a set of markdown into a web-site. I've put some low-effort llm documentation, but I realize it's probably have zero re-usability. 

Reasons, randomly:

- __Procrastinatination__. *Just one more feature, bro. Just one more feature* Instead of writing posts, you build your web-site.
- __No end goal__. To me, it's not a product I should ship. Don't care about value. Maybe should, but I don't. It's my garage, where I invite my friends sometimes. 

### Constraints

- **As low dependencies as possible**. Currently there are plenty of dependencies, but controllable amount of them, like Markdown parsing or HTML parsing. It's all can be rewritten with the power of LLMs, in fact, I'm planning to use it as a benchmark — are current state of "blurry jpeg of Internet" is enough to reconstruct subset of features I need from such libraries and basically "serialize" it in the repository. 

### Why don't PHP? Why GitHub Pages?

I have an intention to make it fully dynamic, but also don't want it to be hosted it in cloud. I don't remember why, but 10 years ago I didn't like storing web-site in git

### Biggest missed oportunity

No *static* typing. In handlebars you are pretty often in the situation, when you should guess.