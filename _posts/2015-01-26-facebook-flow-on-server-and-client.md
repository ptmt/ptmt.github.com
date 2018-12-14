---
layout: post
title: Trying to heal Node.js app with Facebook Flow
excerpt: "Typechecking for all your javascript code, including Node.js"
tags: [flow, node, javascript, ecmascript, facebook]
modified: 2015-01-26
comments: true
feature-img: "img/sample_feature_img.png"
---

Recently, Facebook released a library that quickly became the lastest frontend sensation. The project, ReactJS, brings a fresh approach to maintaining the viewing part of web applications. Facebook is well known for building tools which help improve all types of legacy, including languages, codebase, developers (Hip-hop, HHVM and Hack).

And now, meet the awesome [Facebook Flow](http://flowtype.org/) — a static typechecker for Javascript.

## Getting started

Flow binaries can be installed via npm:

```
npm install flow-bin -g
```

There are tons of ways to do this. Either install as OPAM package, download binaries from the official site, or install it via brew as follows:

```
brew install flow
```

I am also working on [tryflow](https://github.com/ptmt/tryflow) (**UPDATE: it's obsolete**). I hope to get to a place where it is possible to play with Flow and see it in action.

However, when you decide to use Flow on a really huge project, you need to build it from [flow git repository](https://github.com/facebook/flow) to be able to change a source code.

The first example is simple yet very exciting. Consider you have a function like this:

```javascript
/* @flow */
function length(x) {
  return x.length;
}

var a = null,
  b = 10;
console.log(length("Hello") + length(a) + length(b));
```

Flow performs type inference and defines the type of `x` as a `string`. Function `length` has type signature `string => number`.

Executing this code through Node or a browser obviously produces `Uncaught TypeError: Cannot read property 'length' of null`.
Could it be caught at compile time rather than runtime? You could try checking the same code with the very useful [jshint.com](http://jshint.com/), and seeing if it gives no warnings. [TypeScript Playground](http://www.typescriptlang.org/Playground) also couldn't find this error.

This is where Flow takes the stage. It’s no surprise, then, that we've got two related errors when run our first “flow check”:

```bash
> flow init
> flow check


flowexamples/src/01_simple.js:4:10,17: property length
Property cannot be accessed on possibly null value
flowexamples/src/01_simple.js:7:5,5: undefined

flowexamples/src/01_simple.js:4:10,17: property length
Property not found in
/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_2da377b0/lib/core.js:58:1,69:1: Number

Found 2 errors
```

To fix these errors, simply add the following two conditions to the runtime check:

```javascript
/* @flow */

function length(x) {
  if (!x) {
    // check for null and underfined
    return 0;
  }
  if (typeof x === "string") {
    return x.length;
  } else {
    return x;
  }
}

var a,
  b = 10;
console.log(length("Hello") + length(a) + length(b));
```

This now returns no errors at the “compile-time” step, as Flow now detects the type of `length` function as `x: ?string | ?number => number`.
This kind of syntax refers to Union type (`type1 or type2`) where `?` for `Nullable`. In non-idiomatic Haskell it would be:

```Haskell
length :: Either (Maybe Int) (Maybe String) -> Int
```

So far, static typechecking doesn't require explicit types to be written using dynamic conditions as constraints to refine types.

Flow simply analyzes a type's flow.

## Types

Consider the following example of Node.js code:

```javascript
var exec = require("child_process").exec;
exec(1);
//   ^   Flow type error: first argument should be a string
exec("command");
exec("command", null, (err, stdout, stderr) => {
  stdout.read();
  //       ^^^^   Flow type error: stdout is Buffer
});
```

How does it work? Flow allows you to extend your code by writing [declarations](flowtype.org/docs/declarations.html). It could be an external file or an inline-type declaration.
The previous example typechecked because Flow’s standard library [define](https://github.com/facebook/flow/blob/master/lib/node.js#L116) `exec` interface looks this way:

```javascript
declare module "child_process" {
  declare function exec(
    command: string,
    options?: child_process$execOpts,
    callback: (error: ?Error, stdout: Buffer, stderr: Buffer) => void
  ): child_process$ChildProcess;
}
```

To be able to define such APIs for browser-specific, Node or third-party libraries, while at the same time keeping code compact, Flow uses many syntax constructs similar to typescript.
These include the following generics:

```javascript
// declarations file for knox module (node.js S3 client)
type Callback<T> = (err: ?Error, res: T) => void;

declare class KnoxClient {
  // ...
  getFile(filename: string, Callback<ReadableStream>): void;
}

// actual code
var client = knox.createClient({
  key: "<api-key-here>",
  secret: "<secret-here>",
  bucket: "learnboost"
});

client.getFile("/test/Readme.md", function(err, res) {
  // do `res.pipe(..)` or `res.resume()`
  // res is ReadableStream.
});
```

and optional and rest parameters:

```javascript
declare var Math: {
  // ..
  max(...values: Array<number>): number,
  min(...values: Array<number>): number
  // ..
};

Math.max(1, 2, 3, 4, 5); // valid
Math.max(1, "2");
//          ^    Flow type error
```

...polymorphic classes, positional access methods, static methods, inheritance:

```javascript
declare class NodeList<T> {
  length: number;
  item(index: number): T;
  [index: number]: T;
}

declare class Node extends EventTarget {
  nodeType: number;
  // .. many other APIs
  static ENTITY_REFERENCE_NODE: number;
  // .. other static vars
}

declare class Element extends Node {
  getAttribute(name?: string): string;
  // ..
}

declare class HTMLElement extends Element {
  id: string;
  className: string;
  onload: (ev: any) => void;
  // ...
}

declare class Document extends Node {
  title: string;
  forms: NodeList<HTMLElement>;
  // ...
}

console.log(
  document.forms[0].nodeType, // correct
  document.forms[0].getAttribute("action"), // correct
  document.forms[0].className, // correct
  document.forms[0].classname // type error
);
```

## To protect the important

<img src="/images/2015/flow-pic@2x.png" alt="Facebook Flow" width="400px"/>

The key idea, and one of the advantages of Flow, is that it allows for typed and untyped code to be mixed. Unit and functional tests with code coverage are the must-have guards for your code.
However, they are pretty slow compared to the nearly instant speeds of static typechecking.

## Example config

You have a Node.js app with server and client written in typed ES6 with interfaces:

```
--  app
|--  server
|--  index.js
|--  client
|--  app.js
|--  assets
|--  interfaces

```

This is the part of Gulpfile compiling server to ES5 and strip types via `gulp`, `gulp-react` and `gulp-flowtype`:

```javascript
var $ = require("gulp-load-plugins")();

gulp.task("flow", function() {
  return gulp
    .src(["app/server/**/**.js"])
    .pipe(
      $.flowtype({
        declarations: "./app/interfaces"
      })
    )
    .pipe(
      $.react({
        stripTypes: true,
        harmony: true
      })
    )
    .pipe(gulp.dest("./app/server.compiled/"));
});
```

Harmony is becoming less and less necessary these days, thanks to IO.js.

The same task is usually more complicated for the client due to reasons of transforming, packaging, caching, minimazing, sourcemapping, etc. So for clients, you can use Flow with the independent task:

```javascript
// check code on gulp watch
gulp.task("client-flow", function() {
  return gulp.src(["app/client/**/**.js"]).pipe(
    $.flowtype({
      declarations: "./app/interfaces"
    })
  );
});
```

See [github.com/unknownexception/tryflow/Gulpfile.js](https://github.com/unknownexception/tryflow/blob/master/gulpfile.js) for an example.

## TextEditor support

I use damn-slow Atom with an `ide-flow` plugin. It isn't as great as VisualStudio support for typescript, but good enough if you use typed declarations for everything.

![Feature demo](https://github.com/lukehoban/atom-ide-flow/raw/master/ideflow.gif)

There is also [linter-flow](https://atom.io/packages/linter-flow) for a unified lint experience which also supports Flow.

Flow’s server allows you to write plugins, using CLI easy for any IDE.

### Inside Flow

Flow is developed internally, syncing with Github repo from time to time. But you still have a chance to contribute.

Be sure you're not about to start work on a feature which is already being developed by the Facebook team.

Flow is written in OCaml, which is really nice language, with an easy-to-read type system and pattern matching. All you need is properly configured Emacs.

### Cons

- My biggest concern at the moment is related to Flow [declarations lib](https://github.com/unknownexception/flow-declarations). There are a lot of issues on Github complaining about
  standard interfaces library shipped with Flow binary. It's not surprising, as getting full type interfaces for everything is really difficult.
  There is a problem with supporting multiple platforms, which could require you to write your own declarations lib. Even a simple function like setTimeout() is different in browser and Node.
  For example, we've got IO.js – an awesome Node ES6-ready fork which uses more fresh V8, has the new APIs, and which is not yet presented in Facebook’s default library.

- Linters and style checkers is not working properly right now with types. So it may be harder to maintain code style across your team. And strict code style is a privacy issue, [remember](https://freedom-to-tinker.com/blog/aylin/anonymous-programmers-can-be-identified-by-analyzing-coding-style/)? Honestly, I don’t think it is a big problem to adopt things such as a jscs, to use typescript as an example.

- Flow doesn't support a few ES6 features (for example, it doesn't currently support generators), as well as some interesting type declarations syntax. See [Coming soon](http://flowtype.org/docs/coming-soon.html) page;

- There is no support for typescript definitions files at the moment, but it's also coming soon.

## TL;DR

Using a custom build pipeline for Javascript is common practice. At the very least, it includes eslint and jscs, so it is no big deal to start using Flow with no overhead.

For now, however, you should be prepared to contribute to a Flow project if you really want to use it at full capacity.
