# crash-reporter-middleware

> Middleware for reporting crashes to any error monitoring service (Sentry, Raygun, etc)

[![NPM][crash-reporter-middleware-icon] ][crash-reporter-middleware-url]

[![Build status][crash-reporter-middleware-ci-image] ][crash-reporter-middleware-ci-url]
[![Circle CI](https://circleci.com/gh/bahmutov/crash-reporter-middleware.svg?style=svg) ](https://circleci.com/gh/bahmutov/crash-reporter-middleware)
[![semantic-release][semantic-image] ][semantic-url]

[crash-reporter-middleware-icon]: https://nodei.co/npm/crash-reporter-middleware.png?downloads=true
[crash-reporter-middleware-url]: https://npmjs.org/package/crash-reporter-middleware
[crash-reporter-middleware-ci-image]: https://travis-ci.org/bahmutov/crash-reporter-middleware.png?branch=master
[crash-reporter-middleware-ci-url]: https://travis-ci.org/bahmutov/crash-reporter-middleware
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

## Use example

```js
var app = express();
// all your middleware and routes
// at the very end
var initCrashReporter = require('crash-reporter-middleware');
initCrashReporter(getSettings, app)
    .then(function (crashMiddleware) {
        if (crashMiddleware) {
            app.use(crashMiddleware);
        }
        http.createServer(app).listen(port);
    });
```

This middleware tries to figure out what error reporting service you have by inspecting the environment
variables. For example, if you have `RAYGUN_APIKEY` in the environment, it will initialize the 
[Raygun](https://www.npmjs.com/package/raygun) client.

## Options

**getSettings** - a function that returns settings. For example if you just want to use the environment
variables, you might write a function yourself

```js
function getEnv(key) {
  return process.env[key];
}
initCrashReporter(getSettings, app)
```

If you use [nconf](https://www.npmjs.com/package/nconf), pass its `.get()` method after init,

```js
var conf = require('nconf')();
initCrashReporter(conf.get.bind(conf), app)
```

For the real world use example, see how this module is used to setup the error reporting 
in [next-update-stats](https://github.com/bahmutov/next-update-stats) in the file 
[app.js](https://github.com/bahmutov/next-update-stats/blob/master/app.js)

Good companion middleware for testing the runtime exception setup is [crasher](https://www.npmjs.com/package/crasher).
Just add to your server routes and curl GET the crash endpoint to generate exceptions.

## Supported error reporting services

[Raygun.io](https://raygun.io/) via Heroku - just enable the free add-on for your Node application.
It will add the `RAYGUN_APIKEY` to the list of config variables.

Need some other service? Open an issue!

## Related

* [crasher](https://github.com/bahmutov/crasher) - add an endpoint for generating fake test crashes
* [raven-express](https://github.com/bahmutov/raven-express) - Sentry client for Node Express server

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/crash-reporter-middleware/issues) on Github



## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
