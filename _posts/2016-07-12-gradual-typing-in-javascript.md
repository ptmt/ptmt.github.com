---
layout: post
title: "A little journey with types in JavaScript"
excerpt: A few live examples
tags:
  [
    javascript,
    flow,
    facebook,
    google,
    ecmascript,
    clojure,
    clojurescript,
    typescript,
  ]
comments: true
---

<style>
iframe {
  width: 100%; margin: 20px 0 50px 0
}
</style>

**TL;DR:** Types can be gradually applied. Gradual typing in JavaScript mostly meant Flow in the places where I worked. Flow helped us with several use cases: 1) Node.js backend and CLI tools, 2) accessing and managing state with React components tree and 3) maintaining a React Native fork. A few difficulties were out there, of course, including fast-moving JavaScript language, its idioms, and libraries (_"out-of-sync d.ts"_-problem), quite complex configs, and the lack of re-using the types in the runtime. And OCaml codebase still may sound scary and makes Flow less suitable for contributions from the wider audience (even though the latest tooling turns OCaml into the awesome language to work with).

![JavaScript and type systems](/images/2016/javascript-and-type-systems.png)
_One hell of a controversial slide about gradual typing_

## Node.js

Almost 18 months ago [we started to use Flow](2015/01/26/facebook-flow-on-server-and-client.html) in production. Feels like the eternity in the JavaScript era.
Back then we had a web server written in Node (because of the universal approach to rendering and other shared code) and Flow gave us some valuable suggestions thanks to its non-nullable by default types.

(Click on functions and variables to see type signatures if you lucky)

**the code snippet was removed due to tryflow.org domain expiration**

Should I remember the signature that node.js function or just google it? What if we haven't set up a fast-feedback coding infrastructure (e.g. live tests with mocked API or REPL)?

_(how it may look in the text editor)_

![alt](/images/2016/nuclide1.png)

Flow's embedded type definitions for language core, browser APIs and Node.js weren't good enough and the best that
you could do was sending a pull request to fix a file with the corresponding declarations.
I had even [contributed](https://github.com/facebook/flow/pull/151) a tiny feature to help to debug such cases and was very proud of it.
(my very first pull request to the significant open source project). Contributing is an
important step in getting more confident in the tool that you are using. And again, OCaml is a nice language to try and play with.

_To achieve static typing for interactions with 3-rd party APIs such as Sequelize that already have schema mechanism you might end up with duplicating information about the type structure (and add +1 for tests)_

**the code snippet was removed due to tryflow.org domain expiration**

_The year is 2014. `async` library is still heavily used to manage callbacks. How did it suppose to be typed? I didn't know._

**the code snippet was removed due to tryflow.org domain expiration**

What's the perfect case for Flow? The state manipulations. Accessing the state, mutating the state. Let's see at some scraper. Html is probably not the easiest thing to write type annotations for but still the idea is simple.

**the code snippet was removed due to tryflow.org domain expiration**

Flow let you guard (at least to pretend) most of the parts of your code from the outside world, and you can easily turn it off if you want to. Usually, people just don't care enough to cover 100% of your JavaScript codebase with tests, and neither do they with type annotations.

Isn't that how gradual typing supposed to work?

## React

It's 2015. React components are just some kind of functions (not necessarily pure) with arguments (`this.props`). Would be nice to have the way to validate these arguments. It will increase maintainability even you're the only developer in the team, because of the small amount of L1 cache in your brain.

_Imagine all these components from the [official tutorial](https://facebook.github.io/react/docs/tutorial.html) are in different files, with a way more properties._

**the code snippet was removed due to tryflow.org domain expiration**

_Let's update it to 2016: stateless components, redux, ES2015 syntax._

**the code snippet was removed due to tryflow.org domain expiration**

Isn't it verbose to add these types? Isn't configuring webpack, linters, and other things not enough for you?

"JavaScript-fatigue" will be remembered in the next generation. And yes it's not trivial sometimes to configure Flow properly and use it in the full strength. Don't worry, just guard everything you can, keep calm and carry on.

## React Native

And then React Native came up in February of 2015, and Flow had been heavily utilized there from the start. Remember FlowTypeCheckMiddleware? It's JavaScript running on the mobile device, you can't easily hotfix your code in the production ([you can now](https://github.com/Microsoft/code-push)) so let's eliminate `undefined` errors as possible in our "a 7-day prototype". At some degree, Objective-C is also the dynamic language with gradual typing. Powerful tandem, surely, for building apps a bit faster.

Consider you decide to fork React Native for any reason. You have a hundred React components and even more files with APIs. You change something, add, rename or delete, and then you try to synchronize with the latest changes from the upstream. Flow helps to maintain integrity. (Unit tests are also handy, but there are no unit tests for components, only integrations, and unit tests for a most complicated and important part such as react-packager)

## Next step

The most annoying bugs occur in places where two independent parts of a program communicate with each other. Like in the client-server protocol. Pure functions, dumb components and classes are fine, and nicely covered by Flow. But maybe the next step will be something like [babel-plugin-tcomb](https://github.com/gcanti/babel-plugin-tcomb) to re-use that types not only at the time of static analysis, and also in the runtime? Let's grab another nice thing from Clojure again.

I don't use Flow everywhere, but I do `flow init` and `/*@flow*/` right from the start when I have to use JavaScript.
