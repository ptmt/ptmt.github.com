---
layout: post
title: "Javascript on mobile phones via AppGyver Supersonic"
excerpt: "Hybrid iOS development doesn't solve everything"
tags: [javascript, flowtype, facebook, atscript, google, ecmascript, clojure, clojurescript, typescript]
comments: true
---
Javascript on the iOS? I’m not kidding. It’s not only about platform, but about the language itself, paradigms, build processes that you’ve already learnt. Instead of fully native development we chose WebView-based, because of many reasons, basically at first look our app looks simple (just a catalog, representation of data set). AppGyver Supersonic (former Steroids) seemed really interesting — it combines WebViews with Javascript API which let you use native features: transitions, animations, a few native controls (navbar, tabbar, drawer).

But turned out it much harder to build app based on WebView than plain web app with equal complexity:

### 1. Cross-platform

How Supersonic is deal with it? You’ve got Native UI Components, for example `NavigationBar`, which allows you to set buttons and title. That’s all. You can make:

```javascript
steroids.view.navigationBar.show('The long-long title here and would be nice to split it into 2 lines')
```
But you've got only something like `The long-long tit..`. No text-wrapping. You can't place an input box there.
Android and the exciting Material UI? Meh, no. Windows Phone? Forget about it. I mean you can’t use the same component for both platforms that feels native, but even worse, you haven’t choice. Meet Android app which looks exactly the same as iOS, but feels worse!

### 2. Performance

Parsing Javascript's thousand of lines takes a time. For your MBP15 Core i7 not so much, but for the first iPad mini it could take 4 seconds. You have to include a lot js libraries ( `cordova.js`, `supersonic.js` and many others such as `angular` or `backbone`, jquery plugins, etc.).

### 3. Plugins

You have got a SDK for some fancy service written in Objective C. Good luck to adopt it for Cordova. Push Notifications, Facebook plugin, Google Analytics, Hockey app, etc.

### 4. Stability

A huge amount of WebViews, which contains a huge amount of js give you quite a nice set of issures: memory leaks, js-parsing problems and unpredictable UI freezing. Let's say you have 5 tabs with WebViews + InitialView + background WebView, and on each tab user could push another view into the UI stack. 15 fat WebView components with js runtime in total. What’s could be wrong? (Sarcasm)

### 5. Cross-views channels

`Supersonic` solved this problem partially adding new abstraction level, but basically it's just very constraint, see 4.

### 6. Not-native

It’s not feel native after 1 minute of using. Again. You must emulate, mimic many things using html/css/js, such as pull to refresh or input controls (see Ionic). The lack of control might be good or not, depends of complexity of app. When you look at the simple examples it really works. But after months the list of features that "difficult to implement" is growing really fast.

### 7. Cloud

Supersonic ships with the their own hosted cloud build service for Supersonic apps, the cloud data providers, the cloud distribution - the whole AppGyver infrastracture. Sounds great? Bootstrapping is good at first, then you accidentally figure out that it doesn’t fit into your constraints. Inconsistent versions (cloud build / local steroids package) between AppGyver Scanner installed on your device versus CloudScanner (they have stable build for it). Would like to distribute test version of an app? Be ready to a lot of downloading, uploading, uh. Let's see: You should use console at first to deploy package, after you switch to web browser and push the button "Build", then you wait, checking email over and over again, then download the package, then upload it to iTunes, then be prepare to waiting for status updates and then press button to make it available there. Such automation.

### 8. Debugging.

Of course, you could build debug version of the app and use Safari Web Inspector or awesome Chrome Developer Tools to connect to the WebView, but in this case forget about using XCode for debugging. Debugging plugins is also an interesting challenge, good luck with that. It also helps you to learn ObjectiveC and eventually you would be able to rewrite the whole application.


Yes, we've managed to publish stable version of the app to AppStore. As a software engineer I supposed to solve the problem for business and I’m kinda failed, because the quality is not satisfiyng, and we spent at least 3 months working on it. But Javascript is not giving up. I’m very excited about React Native and looking forward to make `git checkout -b react-native`.
