# eightball [![Build Status](https://travis-ci.org/sriramswamy/eightBall.svg?branch=master)](https://travis-ci.org/sriramswamy/eightBall)

> Get 8-ball predictions

The predictions itself is just a [JSON file](predictions.json) and can be used wherever.


## Install

```sh
$ npm install --save eightball
```


## Usage

```js
var predict = require('eightball');

predict();
//=> Without a doubt

predict();
//=> Ask again later

predict.predictions;
// ['Without a doubt', 'Ask again later', ...]
```

## CLI

```sh
$ npm install --global eightball
```

```sh
$ eightball --help

Example
  $ eightball
  Without a doubt
```
