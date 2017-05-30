---
layout: post
title: React Native alternatives to Bootstrap
tags:
  - react-native
comments: true
---

_"Let's do it as quickly as possible, not caring about design too much for now"._

Should I use UI kits for React Native? If you worked on small apps a few years ago it was annoying to solve the similar problems every time: re-creating buttons, cards, managing flex layout or APIs, incapsulating differences between iOS and Android into the single component. Time passed, now React Native is much more mature out-of-the-box, but still, the idea starting with ready-to-use kit looks appealing. You just don't need to care about pixel-perfect design much, if you are just validating the idea. And you don't even need to use the whole stack, just use these kits as a source for some of the concepts: themes, layouts, navigation. Remember, you always can eject, as soon as limits and restrictions become more important than budget.

Here is a list of bootstrap projects:

1. Shoutem UI: <https://github.com/shoutem/ui> (demo: [https://expo.io/@community/shoutem-ui-examples](mailto:https://expo.io/@community/shoutem-ui-examples)). High quality, complex, with very good marketing and additional visual tools to bootstrap. There are a lot of low-level components for layout (View, Row, ScrollView, Image, Tile, Divider). Support for themes which looks like scss.
2. React Native Elements: <https://github.com/react-native-training/react-native-elements> (demo: [https://expo.io/@community/react-native-elements-starter](mailto:https://expo.io/@community/react-native-elements-starter)). This one is also popular, well-maintained by a community. It can be a good start, and certainly worth looking for some of the components.
3. NativeBase.io ([https://getexponent.com/@community/native-base](mailto:https://getexponent.com/@community/native-base)). I have some problems with dropped frames in expo demo on iPhone 6, but this is not a problem of components itself. There is also a pretty great set of base components (Container, Button, H3, Text, Body, Right, List, ListItem, some of them feels like you're using styled-components). Uses shoutem themes. There is also a marketplace, which is a really sweet idea, I hope the market will evolve. <https://market.nativebase.io/> ($100-$500). NativeBase has <http://reazyframework.io/> as a full-featured framework solution, but I 've never tried it.
4. Pepperoni <https://github.com/futurice/pepperoni-app-kit> more about the full pack starter solution for React Native than UI components.
5. <https://github.com/avocode/nachos-ui> Looks pretty basic to me, maybe it was supposed to fit the certain project.
6. <https://github.com/xinthink/react-native-material-kit> - components that fit Material UI. Very high quality in terms of feels, but they are implemented as a fully native, so be ready to spend some time with setup.
7. Something new in the list: <https://react-native.shop/> - costs $25\. Based on NativeBase.io and positioned as a responsive UI for React Native.
