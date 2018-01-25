---
layout: post
title: Dive into Mobile Development from a React developer's perspective
tags:
  - react-native
  - wix
  - react
  - ios
  - android
  - java
  - expo
comments: false
---

![From React Web to Native](/images/2018/FromReactToNative.png)

# React (Native) Web

It's sunny here. All you need on the client device is a browser, which is a program that everyone has. The API available in those browsers gets through the standardization process, so the number is limited, but still quite enough for good bunch of tasks. Having Web Standards means another beneficial outcome: breaking changes are rare (although, only in comparison, so [still possible](http://tonsky.me/blog/chrome-intervention)). You have no control of user's browser version and sometimes it can be really outdated, and no fancy features available.

**Examples:** [Twitter Lite](https://mobile.twitter.com/), [Tinder PWA](https://tinder.com/)

**Examples of impossible apps at the moment:** A companion app for your IoC health device that uses HealthKit/GoogleFit integration. [Status Messenger](https://status.im)

# Expo.io

Use a custom lightweight browser, carefully shipped to you as an iOS and Android application. You don't have to worry much about maintenance of this browser, the world's top talents are doing this for you. You just need to write JavaScript (or ClojureScript) and it will ship to precompiled Expo apps. When you are ready, publish this browser with your bundle included to AppStore and Google Play. Mobile APIs available to you are also standardized, only the standardization process and implementation stages are both [more transparent](https://expo.canny.io/) and happen in a much faster fashion.

**Examples:** A camera app with effects and filters, notifications. An offline 2D game with the ads monetization. [Purify.](https://blog.expo.io/featured-pipefy-for-ios-and-android-24231723912b)

**Examples of impossible apps at the moment:** An app with the background location tracking, an app that requires subscriptions or in-app purchases to monetize.

# React Native

You finally decide to use React Native hoping for the mighty ecosystem of 3rd-party plugins and SDKs. Welcome to Xcode and Android Studio, you have a chance to use things such as lldb, Cocoapods, Proguard at this point. Breaking changes are constant, but you get used to it, inevitable becoming a part of open source community. Fork, debug, fix, test, send pull requests, repeat.

You can understand at least half of the jokes that you read on Twitter from Android and iOS developers. _Haha, I need iMac Pro for Gradle too!_. You are not ready to write a lot of native code yet sticking to js ecosystem as much as possible.

**Examples:** [Gyroscope](https://itunes.apple.com/app/apple-store/id1104085053?mt=8). ARKit-powered app.

**Examples of impossible apps at the moment:** Apps with the huge amount of screens and strict requirements to the initial load time. You can't split the js bundle yet in React Native.

# React Native+

Technically it's still the same React Native with some advanced usage of native libs, a.k.a "Wix stack" thanks for their wide adoption of such approach. These libraries usually have their JS alternatives, but may not suit you for various reasons. You can choose `react-native-gesture-handler` (it's in Expo too!) or `react-native-interactable` instead of PanResponder, or `https://github.com/bolan9999/react-native-largelist` instead of FlatList, etc. and most likely it would be your own Java/ObjC module. Feel that 60fps on Android 4.4 or iPhone with an old battery?

You heavily rely on native code, which is less flexible, much harder to maintain, but sometimes faster and closer to the metal. You have at least one full-time native developer on your team. You are not limited using mobile APIs in 90% cases, writing your own API wrappers and using all the power of your creative mind.

Apple announces something new at WWDC? Start using that tomorrow in Developer Beta in your React Native project!

**Examples** [Discord](https://blog.discordapp.com/using-react-native-one-year-later-91fd5e949933), [Wix](https://www.youtube.com/watch?v=abSNo2P9mMM), [Uber Eats](https://eng.uber.com/ubereats-react-native/)

# Embedded RN

You most likely have forked RN at this point. (It's good to get back upstream, though). RN is just a thing, a tool, that you use to render the boring parts of your interface for marketing, or an interface that needs to be shipped quickly and probably updated on-the-fly later. As a native developer, you are most likely focused on solving challenging tasks instead, such as startup performance, complicated fancy animations and Native <-> RN seamless integration.

**Examples:** [Facebook #1](https://code.facebook.com/posts/895897210527114/dive-into-react-native-performance/), [Facebook #2](https://www.youtube.com/watch?v=QOAoLF6FV7A), [Instagram](https://engineering.instagram.com/react-native-at-instagram-dd828a9a90c7), [Airbnb](https://www.youtube.com/watch?v=8qCociUB6aQ)

**Examples of impossible apps at the moment:** 64-bit Android app

# Inspired by React

It's really deep and dark. Not a single photon from the surface could reach here. But it's also nice, a plenty of interesting forms of live around. React-inspired mindset and its ecosystem alternatives in pure ObjC, Swift, Java and Kotlin. Familiar concepts without the need of JavaScript at all. ComponentKit for components, Redux-like libs for state management or Yoga for Flexbox layouts. But technically, it's pretty much the same usual native app, without JavaScript Core, NativeBridge, ViewManagers and other things from React Native.

# Platform

Finally, the true Native World in its purity. Use whatever you want as intended by official SDKs, IDEs, and documentation. (Storyboards, anyone?), all the riches of the mighty Platform at your disposal. If you are tired of long complication time for a small UI change, welcome back to the surface.
