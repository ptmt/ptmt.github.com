---
layout: post
title: "Hybrid iOS development: WebView + native via AppGyver Supersonic"
excerpt: "Hybrid iOS development doesn't solve everything"
tags: [cordova, appgyver, ios, mobile]
comments: true
---

The year is 2014 and JavaScript running on the iOS outside the browser doesn't sound so strange anymore. It’s not only about the platform but about the ecosystem: paradigms, tools, build processes that you’ve already learned.

So when we had to pick the stack for a complimentary mobile app that can share the code between web and mobile we chose a WebView-based framework and that was a mistake.

At first, our app looked simple (just a catalog, a list view representation of a data set). AppGyver Supersonic (former Steroids) seemed really interesting — it combines WebViews with Javascript API which let you use native features such as transitions, animations, a few full native controls (navbar, tabbar, drawer, etc.).

But turned out it's much harder to build an app based on WebView than a plain web app with the equal complexity:

### 1. Cross-platform

How does Supersonic deal with that? You’ve got Native UI Components, for example, `NavigationBar`, which allows you to set buttons and title. That’s all. You can write:

```javascript
steroids.view.navigationBar.show(
  "The long-long title here and would be nice to split it into 2 lines"
);
```

And indeed see a fully native iOS navigation bar, not as a part of WebView. But you'll get only something like `The long-long tit..`. No text-wrapping. You can't place an input box there.
Android and the new exciting Material UI? Meh, no. Windows Phone? Forget about it. I mean you can’t use the same component for both platforms that would feel natural, but even worse, you don't have a choice. Meet an Android app which looks exactly the same as iOS, but it's not that one could expect from it.

### 2. Performance

Parsing thousand of LOC in JavaScript takes time. It's not a problem for 2012 MBP15 Core i7, but for the first iPad mini, it could take up to 4 seconds. In order to finish some tricky forms, you may have to include a lot of js libraries ( `cordova.js`, `supersonic.js` and many others such as for UI like `angular` or `backbone`, even jquery plugins, etc.).
And does contain a lot of webviews after all.

### 3. The lack of native APIs

You have an SDK for some fancy service written in Objective C? Good luck to adopt it for Cordova. Push Notifications, Facebook plugin, Google Analytics, Hockey app, etc.

### 4. Stability

A huge amount of WebViews, which contains a huge amount of js gives you quite a nice set of issues: memory leaks, js-parsing problems, and unpredictable UI event-loop freezing. Let's say you have 5 tabs with WebViews + InitialView + background WebView, and on each tab, and a user could push another view into the UI stack. 15 fat WebView components with js runtime in total. What’s could be wrong?

### 5. Cross-views channels

`Supersonic` solved this problem partially by adding a new abstraction level, unfortunately, it has a lot of constraints and serialization-penalty, see 4.

### 6. Not-native UX

Again, it does not feel native after 1 minute of using. Again. You must emulate, mimic many things using HTML/CSS/js, such as pull to refresh or input controls (see Ionic). The lack of control might be good or not, depends on the complexity of an app. When you look at the simple examples it really works. But after months the list of features that "difficult to implement" is growing really fast.

### 7. Deployment

Supersonic ships with their own hosted cloud build service for Supersonic apps, the cloud data providers, the cloud distribution - the whole AppGyver infrastructure. Sounds great? Bootstrapping is indeed great at first until you accidentally figure out that it doesn’t fit into your constraints. Inconsistent versions (cloud build / local steroids package) between AppGyver Scanner installed on your device versus CloudScanner (they have a stable build for it). Would like to distribute a test version of an app? Be ready for numbers of different actions such as downloading, uploading, and repeating it again. Let's count: You should use console at first to deploy a package, after you switch to the web browser and push the button "Build", then you wait, checking email over and over again, then download the package, then upload it to iTunes, after that be prepared to wait for the status updates and then press the button to make it available there.

### 8. Debugging.

Of course, and that really nice having WebViews you could build a debug version of your app and use Safari Web Inspector or Chrome Developer Tools to connect to the WebView. In this case, forget about using XCode for debugging for better or worse. Debugging plugins is also an interesting challenge. It also may help you to learn Objective-C and eventually you would be able to rewrite the whole application.

## Conclusion

We managed to publish the stable version of the app to AppStore. As a software engineer, I'm supposed to solve problems for business and I’m kinda failed in this case, because the quality was not even close to satisfiyng, and we spent at least 3 months working on it. There were good parts too about DX, but it's only suitable for a prototype.  
JavaScript on iOS and Android is not about giving up. I’m very excited about React Native and looking forward to making `git checkout -b react-native`.
