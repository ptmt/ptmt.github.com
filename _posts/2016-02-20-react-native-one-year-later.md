---
layout: post
title: "Four Stages of Living with React Native"
excerpt: "One year later"
tags: [react, react-native]
comments: true
published: true
feature-img: "images/2016/app-store-logo.jpg"
---

*TL;DR Come for the hype, stay for the confidence.*

# Stage One: The first date

Initial conditions:

- A legacy app written on top of some WebView hybrid framework, which
constantly [facing its limitations](http://potomushto.com/2015/03/02/webviews-are-hard.html).

- A completed web app in React. Hmm, so I can go with JSX, I can use this ecosystem.

- React conference where R**** Native has been announced.

<img src="/images/2016/react-native-announce.png" alt="Annnouncing React Native" style="width: 300px;"/>

Then one day you wake up in the morning, looking in the window at a very gloomy weather outside, you open the browser and see the news all over the internet: RN is released to public and the repo already has a thousand stars.

It's finally open to `npm install`.

# Stage Two: Obsession


After first two weeks there is only pure joy. The documentation is inconsistent, doesn't matter (there is an [awesome UIExplorer](https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ClipboardExample.js#L33)). Best practices doesn't exist: doesn't matter, some of such could be ported from the web, some could be used from other native frameworks. Not enough plugins: doesn't matter. You can write a plugin by yourself.

My first sensible [pull request](https://github.com/facebook/react-native/pull/1318) takes a few weeks of the fun process of contributing. Important lesson how to be more careful, after all. Objective C still scares sometimes, but it doesn't look weird anymore. Patterns, paradigms, idioms which were formed over decades. It's a new for you, unknown language which could teach you a lot.

It's kind of strange that ObjC doesn't have a strict popular linters like `eslint` and `jscs`, enforcing code styles. You even try [some of them](https://github.com/facebook/react-native/pull/1916), no luck:

```
React/Views/RCTNavItem.m:53:3: ivar assignment outside accessors or init P2

...

React/Modules/RCTUIManager.m:525:7: long variable name P3 Variable name with 21 characters is longer than the threshold of 20

...

React/Modules/RCTUIManager.m:1114:1: deep nested block P3 Block depth of 6 exceeds limit of 5

P1=0[0] P2=339[10] P3=545[20]
```

There is a strong expanding community, and you like it. Brent Vatne sends you [newsletter](http://brentvatne.ca/react-native-newsletter/) each week and you dream that you will be also part of it. And you finally [are](http://reactnative.cc/14-07-2015.html).

# Stage Three: Routine

So, you're married now, [honeymoon in Paris](http://localhost:4000/2015/07/30/react-europe.html) has ended a weeks ago. Welcome to the usual life.
Sometimes it's even called the **fatigue**.

At first, you realized, that React doesn't solve all problem with performance magically. Even you couldn't affect UI thread directly, and React gives you *cheap* updates, there are tons of a potential bottlenecks. JS Thread, for example.

<img src="/images/2016/speak-1.jpg" alt="Speak screenshot" style="width: 200px;"/>

So you profile, enforce pure components, cache reducers, write ObjectiveC.

![](/images/2016/speak-2.jpg)

Wow, such memory leaks from an almost empty project! Poor GC on JavascriptCore struggling with the
inexperienced developer.
It's nice that all XCode's instruments finally available and you always could rollback to low-level.
And by the way, nothing serious here, just an issue with the developer environment.

![](/images/2016/speak-3.png)
![](/images/2016/speak-4.jpg)

Your everyday routine is a forking almost every two `react-native-%plugin%` out there.
Your everyday routine is a writing your own `RCT_EXPORT_MODULE`.
Your everyday routine is upgrading react-native on the next version.

But at the end it's getting better and better everyday:

- [RNPM](https://github.com/rnpm/rnpm) is becoming a thing recently;

- State management solved for you: use either GraphQL/Relay ([Reindex](https://reindex.io)) or Redux + AsyncStorage. Ok, not quite solved, but it's also routine.

- [Ship your app 10 times](https://apphub.io) per day.

 — React gives you abstractions which feels more right than .xib, UIViewController, AutoLayout, CoreData. And it's up to you how much UI would be on the native side.

# Stage Four: Inspiration

It's February 2016. I'm working on the sixth iOS app, hoping it would be better then previous, such as [this](https://hash.ai), [this](http://wizearn.com/) and [this](http://hiflawless.com). And some other projects like [https://github.com/ptmt/react-native-desktop](https://github.com/ptmt/react-native-desktop) and [https://github.com/skeletcode](skelet).

I'm really used to react-native related issues. It's not a commercial software, and **bugs** are not felt as a something unexpected.
These very lines are written in Jekyll 3.0, and that ruby gem doesn't work great. Some combination of versions of an operation system, Ruby and Jekyll produce an bug affecting new post rendering. An hour on reading github issues, reinstalling Jekyll, and other voodoo tricks ("Ruby can't into timestamps").

I'd rather dig out into Jekyll source code to find and fix that problem by myself. Can I? I certainly can  with React Native now, and that is the reason I love it and that's makes me confident.

*INB4; Stage Five — Oh, see, there is another cool technology, let's go there!*
