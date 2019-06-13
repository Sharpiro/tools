# Serverless

## Fn

### Overview

The Fn project is an open-source container-native serverless platform that you can run anywhere -- any cloud or on-premise. It’s easy to use, supports every programming language, and is extensible and performant.

### Commands

* `fn start`
  * start fn server
* `fn init --runtime --trigger http go hello`
  * init new go function named `hello`
* `fn create app m2`
  * create app named `m2`
* `fn deploy --app m2 --local`
  * deploy `m2` app to local server
* `fn invoke m2 hello`
  * invoke `hello` function of `m2` app
* `echo -n '{"name":"test"}' | fn invoke m2 hello`
  * pass json to function
* `fn list apps`
  * list all apps
* `fn list functions m2`
  * list all functions for app `m2`
* `fn list triggers m2`
* `fn list calls m2 hello`
  * show calls to `hello` function
* `docker container ls --all`
  * list all containers
