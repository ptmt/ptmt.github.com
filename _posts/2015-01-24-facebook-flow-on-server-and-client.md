---
layout: post
title: Trying to heal Node.js app with Facebook Flow
excerpt: "Flowtype typechecking for all your javascript code, including Node.js"
tags: [flowtype, node, javascript, ecmascript, facebook]
comments: true
feature-img: "img/sample_feature_img.png"
---

Recently, we've got a library from Facebook that quickly became the next sensation in frontend world.
The project called ReactJS which turned up as a really fresh approach to maintaining the view part of the web application.
Facebook is well known for building tools which help to feel better with legacy, no matter what exactly legacy it is: languages, codebase or developers. Hip-hop, HHVM, Hack.

And now, meet awesome [Facebook Flow](http://flowtype.org/) — static typechecker for Javascript.

## Getting started

One may install Flow binaries via npm:

```bash
npm install flow-bin -g
```

There are tons of ways to do that: install as OPAM package, download binaries from the official site or install it via brew:

```bash
brew install flow
```

Also, I'm working on [tryflow.org](http://tryflow.org) and hope to get a place where would be possible to play with Flow and see it in action.
However, when you decided to use Flow on a really huge project
you eventually would build it from [flow git repository](https://github.com/facebook/flow) to be able to change a source code.

The first example is simple yet very exciting. Consider you have a function like this:

```javascript
/* @flow */

function length(x) {
  return x.length;
}

var a = null, b = 10;
console.log(length("Hello") + length(a) + length(b));
```

Flow perform type inference and define the type of `x` as a `string`. Function `length` has type signature `string => number`.
Executing this code through Node or browser obviously produces `Uncaught TypeError: Cannot read property 'length' of null`.
Could it be caught at compile time rather runtime? You could try to check the same code with very useful [jshint.com](http://jshint.com/), and it gives no warnings, as well as [TypeScript Playground](http://www.typescriptlang.org/Playground)
This is where Flow takes the stage. No surprise then that we've got two related errors when run our first `flow check`:

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

To fix this errors simply add two conditions for runtime check:

```javascript
/* @flow */

function length(x) {
  if (!x) { // check for null and underfined
    return 0;
  }  
  if (typeof x === 'string')
  {
    return x.length;
  } else {
    return x;
  }
}

var a, b = 10;
console.log(length("Hello") + length(a) + length(b));
```

That returns no errors along at "compile-time" step, because now Flow detect the type of `length` function as `x: ?string | ?number => number`.
This kind of syntax refers to Union type (`type1 or type2`) where `?` for `Nullable`. In non-idiomatic Haskell it would be:

```Haskell
length :: Either (Maybe Int) (Maybe String) -> Int
```

So far static type checking doesn't require to write explicit types by using dynamic conditions as constraints to refine types.

Flow just analyze type's flow.

## Types

Consider the following example of Node.js code:

```javascript
var exec = require('child_process').exec;
exec(1);
//   ^   Flow type error: first argument should be a string
exec('command');
exec('command', null, (err, stdout, stderr) => {
  stdout.read();
//       ^^^^   Flow type error: stdout is Buffer
});
```

How it works? Flow allows to extend your code by writing [declarations](flowtype.org/docs/declarations.html). It could be an external file or inline type declaration.
Previous example typechecked because Flow standard library [define](https://github.com/facebook/flow/blob/master/lib/node.js#L116) `exec` interface this way:

```javascript
declare module "child_process" {
  declare function exec(
    command: string,
    options?: child_process$execOpts,
    callback: (error: ?Error, stdout: Buffer, stderr: Buffer) => void
  ): child_process$ChildProcess;
}
```

To be able to define such APIs for browser-specific, Node or third-party libraries and at the same time keep code compact Flow has many syntax construct, simular to Typescript such as a generics:


```javascript
// declarations file for knox module (node.js S3 client)
type Callback<T> = (err: ?Error, res: T) => void;
declare class KnoxClient {
  // ...
  getFile(filename: string, Callback<ReadableStream>): void;
}

// actual code
var client = knox.createClient({
  key: '<api-key-here>'
  , secret: '<secret-here>'
  , bucket: 'learnboost'
  });

client.getFile('/test/Readme.md', function(err, res){
  // do `res.pipe(..)` or `res.resume()`
  // res is ReadableStream.
});
```

and optional and rest parameters:

```javascript
declare var Math: {
  // ..
  max(...values: Array<number>): number;
  min(...values: Array<number>): number;
  // ..
}

Math.max(1,2,3,4,5); // valid
Math.max(1,'2');
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

console.log(document.forms[0].nodeType        // correct
  , document.forms[0].getAttribute('action')  // correct
  , document.forms[0].className               // correct
  , document.forms[0].classname               // type error
);
```

## To protect the important
<img src="/images/2015/flow-pic@2x.png" alt="Facebook Flow" width="400px"/>

The key idea and one of the advantages of Flow is allowing to mix typed and untyped code.
Unit and functional tests with code coverage is the must have guards of your code,
but they are pretty slow comparing to nearly instant of static type checking of your code.

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

var $ = require('gulp-load-plugins')();

gulp.task('flow', function() {
  return gulp.src([
    'app/server/**/**.js',
    ])
    .pipe($.flowtype({
      declarations: './app/interfaces'
    }))
    .pipe($.react({
      stripTypes: true,
      harmony: true
    }))
    .pipe(gulp.dest('./app/server.compiled/'))
});
```
The harmony is becoming less and less necessary option for these days, thanks to IO.js.

The same task for client is usually more complicated due to different reasons: transforming, packaging, caching, minimazing, sourcemapping, etc. So for client you can
use Flow with independent task:

```javascript

// check code on gulp watch
gulp.task('client-flow', function() {
  return gulp.src([
    'app/client/**/**.js',
    ])
    .pipe($.flowtype({
      declarations: './app/interfaces'
    }));
});

```
See [github.com/unknownexception/tryflow/Gulpfile.js](https://github.com/unknownexception/tryflow/blob/master/gulpfile.js) for example.

## TextEditor support

I use damn-slow Atom with `ide-flow` plugin. It isn't as great as VisualStudio support for TypeScript but good enough if you use typed declarations for everything:

![Feature demo](https://github.com/lukehoban/atom-ide-flow/raw/master/ideflow.gif)

There is also [linter-flow](https://atom.io/packages/linter-flow) for unified lint experience which also support Flow.

Flow server allows you to write this such of plugins using CLI easy for any IDE.

## Inside Flow

Flow is developing internally and syncing with Github repo from time to time, but you have a chance to contribute.
Be sure you're not going to work on feature which is already developed by Facebook team.

Flow is written in OCaml, which is really nice language, with easy to read type system and pattern matching. All you need is properly configured Emacs.


## Cons

- My biggest concern now is related to Flow [declarations lib](https://github.com/unknownexception/flow-declarations).
You can see a lot of issues on Github complaining about standard interfaces library shipped with Flow binary. It's not surprising, getting full types interfaces for everything is really difficult. There is problem with support multiple platforms which could require to write your own declarations lib. Even a simple function like setTimeout() is different in browser and Node.
For example, we've got IO.js - an awesome Node ES6-ready fork which use more fresh V8, has the new APIs, which is not presented in Facebook default library yet.

- Linters and style checkers is not working properly right now with types. So it may be harder to maintain code style across you team workers. And strict code style is about privacy issue, [remember](https://freedom-to-tinker.com/blog/aylin/anonymous-programmers-can-be-identified-by-analyzing-coding-style/)? Honestly, I don’t think it is a big problem to adopt things such as a jscs, to use Typescript as an example.

- Flow doesn't support a few ES6 features (for example, for now it doesn't support generators), as well as interesting type declarations syntax. See [Coming soon](http://flowtype.org/docs/coming-soon.html) page;

- There is no support for Typescript definitions files at the moment, but it's coming soon too.

## TL;DR

Using a custom build pipeline for Javascript is a common practice, at very least it includes eslint and jscs, so there is no big deal to start use Flow with no overhead.
However, for now be prepared to contribute to Flow project if you really want to use it at full capacity.
