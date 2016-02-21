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

Initial conditions: A legacy app written on top of some WebView hybrid framework, which
constantly [facing its limitations](http://potomushto.com/2015/03/02/webviews-are-hard.html).
A completed web app using `"react": "0.12.x"` (Hmm, so you can go with JSX, you can use this ecosystem).
A conference where React Native has been announced.

<img src="/images/2016/react-native-announce.png" alt="Annnouncing React Native" style="width: 300px;"/>

And you wait. Then one day you wake up in the morning, looking in the window at a very gloomy weather outside, you open the browser and see the news all over the internet: RN is released and the repo already has a thousand stars.

It's finally open to `npm install`.

# Stage Two: Obsession


After first two weeks there is only pure joy in the blood. Challenge accepted. Challenge to use fast-growing project in a pretty early stage accepted! The documentation is inconsistent, but it doesn't really matter (there is the [awesome UIExplorer](https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ClipboardExample.js#L33)). Best practices doesn't exist: doesn't matter, some of such could be ported from the web, some could be used from other native frameworks. Not enough plugins: you can write a plugin that you need by yourself. Apple has released new APIs for 3D Touch Quick Actions. Not a problem. You need more complicated maps than you get out-of-the-box? Let's wrap into JS APIs some of advanced native implementation.

It's inevitable that you soon get your first sensible [pull request](https://github.com/facebook/react-native/pull/1318) which could take a few weeks of the fun process of contributing. Important lesson how to be more careful, after all. Objective C still scares sometimes, but it doesn't look weird anymore, rather looks a pragmatic, including patterns, paradigms, idioms which were formed over the decades. It's a new, unknown language which could teach you a lot and refresh sweet memories of pure C. And there is Swift waiting for you.

You are full of energy. You want to apply somehow your previous experience from JS world. Why ObjC doesn't have a popular linters like `eslint` and `jscs`, which helps to strictly enforce code style? You even try [some of them](https://github.com/facebook/react-native/pull/1916):

~~~~~~~~
React/Views/RCTNavItem.m:53:3: ivar assignment outside accessors or init P2

...

React/Modules/RCTUIManager.m:525:7: long variable name P3 Variable name with 21 characters is longer than the threshold of 20

...

React/Modules/RCTUIManager.m:1114:1: deep nested block P3 Block depth of 6 exceeds limit of 5

P1=0[0] P2=339[10] P3=545[20]
~~~~~~~~

There is a strong expanding community, and you like it. Brent Vatne sends you [newsletter](http://brentvatne.ca/react-native-newsletter/) each week and you dream that you will be also part of it. And you finally [are](http://reactnative.cc/14-07-2015.html).

# Stage Three: Routine

So, you're married now, [the honeymoon at Paris](http://localhost:4000/2015/07/30/react-europe.html) has ended a weeks ago. Welcome to the everyday life, closing issues, one by one.

At first, you realized, that React doesn't solve all problems with performance magically. Consider that fact you couldn't affect UI thread directly, and React gives you *cheap* updates, there are tons of a potential bottlenecks. JS Thread, for example.

<img src="/images/2016/speak-1.jpg" alt="Speak screenshot" style="width: 200px;"/>

So you profile, enforce pure components, cache reducers, whatever generic strategy for optimizing the React performance, and always have an option: writing a low-level Objective C.

![](/images/2016/speak-2.jpg)
![](/images/2016/speak-3.png)
*Wow, such memory leaks from an almost empty project! Poor GC on JavascriptCore struggling with the
inexperienced developer.*

It's nice that all XCode's instruments Chrome Developer Tools finally available for you.
And by the way, nothing serious here, just an issue with the developer environment.

![](/images/2016/speak-4.jpg)

Your everyday routine is a forking almost every two `react-native-%plugin%` out there.
Your everyday routine is a writing your own `RCT_EXPORT_MODULE`.
Your everyday routine is upgrading npm modules on the next version.

But at the end it's getting better and better everyday:

- [RNPM](https://github.com/rnpm/rnpm) is becoming a thing recently;

- State management solved for you: use either GraphQL/Relay ([Reindex](https://reindex.io)) or Redux + AsyncStorage. Ok, not quite solved, but it's also just an another routine.

- [Ship your app 10 times](https://apphub.io) per day.

— React gives you familiar abstractions which feels more right than .xib, UIViewController, AutoLayout, CoreData. And it's **up to you** how much of your app would be on the native side.

# Stage Four: Inspiration

It's February 2016. You are working on your sixth iOS app, hoping it would be better than previous ones: like [hash.ai](https://hash.ai), [wizearn](http://wizearn.com/) or [flawless](http://hiflawless.com). And getting insipring for some other projects like [https://github.com/ptmt/react-native-desktop](https://github.com/ptmt/react-native-desktop) and [https://github.com/skeletcode](skelet).

It's really easy to get used to react-native related issues. It's not a commercial software, and **minor bugs** are not felt as something unexpected, whereas all conceptual things such as [assets management](http://facebook.github.io/react-native/docs/images.html#content) or Navigator develops in the transparent and clear way.

These very lines are written in Jekyll 3, and that ruby gem doesn't work great. Some combination of versions of an operation system, Ruby and Jekyll produce an bug affecting new post rendering (`future: true`). An hour on reading github issues, reinstalling Jekyll, and other voodoo tricks ("Ruby can't into timestamps").

I'd rather dig out into Jekyll source code to find and fix that problem by myself. Can I do that easily? I certainly can with React Native now, and that is the reason I love it and that's makes me confident.

*INB4; Stage Five — Oh, see, the trend has changed, there is another cool technology, let's go there!*
