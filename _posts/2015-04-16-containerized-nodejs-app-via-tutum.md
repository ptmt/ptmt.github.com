---
layout: post
title: Tutum — Better than PaaS
excerpt: "Get rid of Heroku-like PaaS with cheaper, faster and more reliable favorite cloud providers"
tags: [docker, digitalocean, nodejs, iojs]
modified: 2015-04-16
comments: true
feature-img: "images/2015/containers-docker.png"
---


## TL;DR;

- Fully customizable stack (Dockerfiles, stackfiles);
- Predictable load balancing (HAProxy);
- Cheaper then Heroku ($5 per instance at DO);


## Containers for everybody

You have developed a small and dumb application and would like to host it at some nice place with a little effort. PaaS like Heroku have been doing it for you for last years.
The problem is price, performance and management (Buildpacks meh). For example, tryflow.org was hosted on Heroku and it's constantly failing because of strong memory consumption.

*Don't forget this article focused on guys like me, an average Javascript developer, whos main principle is basically don't worry a lot about the infrastructure.
It's fun to spent all --life-- weekend to setup your awesome non-determenistic fully-automated state-of-the-art secured distributed accross a few datacenters network, this article is just not about that.*

## Cool concept, I need the implementation

Containers technology itself isn't something new. Parallels has Virtuozzo for many years, I feel sad, though, community wasn't yet ready for such thing at the time.
But recently it has become a huge, huge^5, got funded, got every devops involved into this. And yet we have no common standard for containers.
So I was about Linux containers (not Solaris or Windows, no kidding): raw [LXC, LXD](https://linuxcontainers.org/), CoreOS team trying [Rkt](https://github.com/coreos/rkt) and the most popular abstraction above LXC called [Docker](https://docker.io). I've choose **Docker** only because I've been already working with Docker since late 2013. The marketers also could say "Solid Ecosystem", it means almost production-ready support by providers, every developer knows how to works with Docker, and so on.

To install Docker on OS X I use Homebrew and its addon Brew-cask - a nice way to install GUI apps via command line. Boot2docker requires VirtualBox, ensure you have it installed:

```
brew install caskroom/cask/brew-cask
brew cask install virtualbox
brew install boot2docker
```

So you have Docker client and Docker server which would be executed inside VM. If you into any Linux with modern core this is a way easier since docker has single executable. But if you are forced to emulate Linux on OS X, init and start virtual machine:

```
$ boot2docker init
$ boot2docker up

Waiting for VM and Docker daemon to start...
.........................ooooooooooooooooooooooooo
Started.
Writing /Users/potomushto/.boot2docker/certs/boot2docker-vm/ca.pem
Writing /Users/potomushto/.boot2docker/certs/boot2docker-vm/cert.pem
Writing /Users/potomushto/.boot2docker/certs/boot2docker-vm/key.pem

To connect the Docker client to the Docker daemon, please set:
    export DOCKER_HOST=tcp://192.168.59.103:2376
    export DOCKER_CERT_PATH=/Users/potomushto/.boot2docker/certs/boot2docker-vm
    export DOCKER_TLS_VERIFY=1
```
Set the exports and you're ready to go! You will see soon that 8GB RAM is definitely not enough for modern front-end web.

## Choosing lightweight image

Docker use the abstractions called layers to be able build one images on top of another. The first line of most of Dockerfile started `FROM ubuntu:12.04`, which means it use standard Ubuntu image. There is a holywar about multiprocess-in-a-container vs single-process-in-a-container and how properly OS should be fitted to be used inside container, which led to the birth of `docker-baseimage` (Ubuntu + [Docker-specific things](https://registry.hub.docker.com/u/phusion/baseimage/)). Cool, I love Ubuntu, but do I really need the entire 300mb image for running small node.js application? Nope. I've tried some images.

```
docker pull phusion/baseimage
docker pull node
docker pull iojs:onbuild
docker pull ficusio/nodejs
docker pull mhart/alpine-node
docker pull joeandaverde/minimal-nodejs
docker images
REPOSITORY                    TAG            CREATED             VIRTUAL SIZE
mhart/alpine-node             0.12           4 days ago          33.37 MB
ficusio/nodejs                latest         3 days ago          32.17 MB
iojs                          onbuild        5 days ago          700.6 MB
node                          latest         10 days ago         706.5 MB
phusion/baseimage             0.9.16         11 weeks ago        279.7 MB
phusion/baseimage             latest         11 weeks ago        279.7 MB
joeandaverde/minimal-nodejs   latest         3 months ago        28.42 MB
```

Spoiler alert: the final size with node_modules is about 300 MB.

This is example of Dockerfile:

```
FROM mhart/alpine-node

RUN apk update && \
    apk add libc-dev gcc curl libgcc git && \
    apk add python make

ENV NODE_ENV PRODUCTION

WORKDIR /src
ADD . .

RUN npm install --production
RUN npm run postinstall

EXPOSE 8080
CMD ["node", "app/server.compiled"]
```
Note: you can expose any port like 8080 and bind node to 80/443 later.

For different projects you might want to add different packages to this base image. For example, you need add to Python.

## Choosing the clustering & orchestration layer

There a bunch of different Docker management tools, because Docker isn't about service discovery, clustering, deploying, and so on.
It doesn't even worth name all of project, because every major cloud player already has something related to conatainers: Amazon, Google, Microsoft, Docker, and hundreds of others.
Docker is great in terms of one container, but even you doesn't want to scale you need to link, manage different containers across different machines.
Look at the beautiful LastBackend, UI looks as the future from some cyberpank movie:

<iframe width="853" height="480" src="https://www.youtube.com/embed/bO0sGz8qN7I" frameborder="0" allowfullscreen></iframe>

So managing containers is how you would manage your tech stack. After all, are you really full-stack developer, no matter what doesn't this buzzword mean?

I use Tutum.co, because it's simple, free and works well with DigitalOcean.
But I'm sure in 2015 will be much more good alternatives.

Tutum uses the following terminology: **Stacks**, **Services**, **Nodes**.

To add **Node** simply link Tutum to your Cloud Provider to use API or install it to nodes manually.
To add **Service**  push Image to Tutum's private registry. `unknownexception` is my username and `prism` is a repository name. All this I'm doing from dev machine, but in real life images pushed from build server.

```
docker login tutum.co
docker build -t unknownexception/prism .
docker tag unknownexception/prism tutum.co/unknownexception/prism
docker push tutum.co/unknownexception/prism
```
*Using makefile, I just type `make deploy` instead.*

Once Image has pushed, you finally could create Service. It's pretty obvious.

![tutum1](/images/2015/tutum1.png)

![tutum1](/images/2015/tutum2.png)

Started service will be available by endpoint, transparently balanced between several containters.

![tutum1](/images/2015/tutum3.png)

To redeploy just push the image again.
