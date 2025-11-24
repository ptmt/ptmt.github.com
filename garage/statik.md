---
title: Statik
template: idea 
status: active
summary: Opionated single-purpose web-site generator
# image: /media/placeholder.jpg
link: https://potomushto.com/statik/
github: https://github.com/ptmt/statik
tags: kotlin, web, blog
---

A set of scripts that can transform a set of markdown into a web-site. I've put some low-effort llm documentation, but I realize it's probably have zero re-usability. And that's okay

Reasons, in no particular order:

- __Procrastinatination__. *Just one more feature, bro. Just one more feature and I'll do something really useful.* Classic! Instead of writing posts, you end up spending more time building your website
- __No clear end goal__. To me, Statik is not a product. I don't care about value. Maybe should, but I don't. It's a hobby project in my garage, where I invite my friends sometimes. And it's not most exciting thing there
- __Playground__. I still love Kotlin, and here I'm trying to try random things out. For example, [Amper](https://github.com/JetBrains/amper) - an experimental build system, instead of Gradle. It's so simple, that I could write my own subset of it if I needed to.  
- __Future-proofing__. The assumption is that in 10 years or in 20 years, I'll be still able to host it and maintain it.

### Constraints

- **As low dependencies as possible**. Currently there are plenty of dependencies, but controllable amount of them, like Markdown parsing or HTML parsing. It's all can be rewritten with the power of LLMs, in fact, I'm planning to use it as a benchmark — are current state of "blurry jpeg of Internet" is enough to reconstruct subset of features I need from such libraries and basically "serialize" it in the repository. 

- __Static__. It produces html, js and css that can be hosted in GitHub Pages and served very fast. Small attack surface. All that

- __Semi-dynamic__. JavaScript should be able to query datasources. 

### Why don't PHP? 

In order words, why not dynamic?

I don't remember why, but 10 years ago I didn't like storing web-site in git.
Would be nice to have easier post creation and editing process, than operating with Markdown files in git repository.
Could it be solved on top of the engine? Most likely yes, just do git commits afterwards. 

### Future of over-engineering

- Static web-site, generated, ss it is now.
- CMS that allows to modify the content, preview it, and publish the final version through git.

### Biggest missed oportunity

No *static* typing. In handlebars you are pretty often in the situation, when you should guess. I have various debug features like `{{debug}}` helper that prints all objects and its content.

In the end, I always saying myself it's a rare situation to get the blog up in the running. 

Just write posts afterwards.