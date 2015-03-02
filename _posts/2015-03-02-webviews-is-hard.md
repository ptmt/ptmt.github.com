---
layout: post
title: "Javascript on the mobile via AppGyver Supersonic"
excerpt: "Hybrid iOS development sounds great, but not solving everything"
tags: [javascript, flowtype, facebook, atscript, google, ecmascript, clojure, clojurescript, typescript]
comments: true
---
Javascript on the iOS? I’m not kidding. It’s not only about platform, but about the language itself, paradigms, build processes that you’ve already learnt. Instead of fully native development we chose WebView-based, because of many reasons, basically at first look our app looks simple (just a catalog, representation of data set). AppGyver Supersonic (former Steroids) seemed really interesting — it combines WebViews with Javascript API which let you use native features: transitions, animations, a few native controls (navbar, tabbar, drawer). 

But turns out it much harder to build app based on WebView than plain web app with equal complexity:

### 1. Cross-platform

How Supersonic is deal with it? You’ve got Native UI Components, for example `NavigationBar`, which allows you to set buttons and title. That’s all. You can make:

```javascript
steroids.view.navigationBar.show('The long-long title here and would be nice to split it into 2 lines');
```
But you've got something like `The long-long ti..`. And you can't place an input box there. 
Android and theirs exciting Material UI? Meh, no. Windows Phone? Forget about it. I mean you can’t use the same component for both platforms that feels native, but even worse, you haven’t choice. So meet Anroid app which looks exactly the same as iOS.

### 2. Performance

Parsing Javascript's thousand of lines takes a time. For your MBP15 Core i7 not so much, but for the first iPad mini it could take 4 seconds. You have to include a lot js libraries (from `cordova.js`, `supersonic.js` to many others such as `angular` or `backbone`).

### 3. Plugins 

You have got a SDK for some fancy service written in Objective C. Good luck to adopt it for Cordova. Push Notifications, Facebook plugin, Google Analytics, Hockey app, etc. 

### 4. Stability

A huge amount of WebViews, which contains a huge amount of js gives you: memory leaks, js-parsing problems and unpredictable UI freezing. Let's say you have 5 tabs with WebViews + InitialView + background WebView + on each tab user could push another view into stack. What’s could be wrong? (Sarcasm)

### 5. Cross-views channels

It’s sucks that you have to deal with it, because adds new abstract layer. Though, `Supersonic` solved this problem partially.

### 6. Not-native

It’s not feels native. Again. You have to emulate many tings, from pull to refresh to input controls (see Ionic). The lack of total control might be good or not, depends of complexity of app. When you look at the simple examples it really works. But after months the list of features that "difficult to implement" is growing really fast.

### 7. Cloud 

Supersonic ships with the cloud build service, the cloud data providers, the cloud distribution. Bootstrapping is good at first, then you accidentally figuring out that it doesn’t fit into your limits. Inconsistent versions (cloud build / local steroids package). Want to distribute test version of app? Downloading, uploading, uh. You should use console at first to deploy package, and after you have to go to web, then checking email over and over again, then download the package, then upload it to iTunes, then wait for status and make it available there. Such automation. 

### 8. Debugging. 

Yep, you could build debug app and use Safari Web Inspector or awesome Chrome Developer Tools, but forget about XCode debugging. Debuggin plugin is also the interesting challenge.


Yes, we've managed to publish stable version of the app to AppStore. As a software engineer I supposed to solve the problem for business and I’m kinda failed, because the quality is not satisfiyng, and I spent 3 months on it. But Javascript is not giving up. I’m very exciting about React Native and looking forward to make `git checkout -b react-native`. 
