# crash-reporter-middleware

> Middleware for reporting crashes to any error monitoring service (Sentry, Raygun, etc)

[![NPM][crash-reporter-middleware-icon] ][crash-reporter-middleware-url]

[![Build status][crash-reporter-middleware-ci-image] ][crash-reporter-middleware-ci-url]
[![dependencies][crash-reporter-middleware-dependencies-image] ][crash-reporter-middleware-dependencies-url]
[![devdependencies][crash-reporter-middleware-devdependencies-image] ][crash-reporter-middleware-devdependencies-url]
[![Circle CI](https://circleci.com/gh/bahmutov/crash-reporter-middleware.svg?style=svg) ](https://circleci.com/gh/bahmutov/crash-reporter-middleware)

[crash-reporter-middleware-icon]: https://nodei.co/npm/crash-reporter-middleware.png?downloads=true
[crash-reporter-middleware-url]: https://npmjs.org/package/crash-reporter-middleware
[crash-reporter-middleware-ci-image]: https://travis-ci.org/bahmutov/crash-reporter-middleware.png?branch=master
[crash-reporter-middleware-ci-url]: https://travis-ci.org/bahmutov/crash-reporter-middleware
[crash-reporter-middleware-dependencies-image]: https://david-dm.org/bahmutov/crash-reporter-middleware.png
[crash-reporter-middleware-dependencies-url]: https://david-dm.org/bahmutov/crash-reporter-middleware
[crash-reporter-middleware-devdependencies-image]: https://david-dm.org/bahmutov/crash-reporter-middleware/dev-status.png
[crash-reporter-middleware-devdependencies-url]: https://david-dm.org/bahmutov/crash-reporter-middleware#info=devDependencies

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

Good companion middleware for testing the runtime exception setup is [crasher](https://www.npmjs.com/package/crasher).
Just add to your server routes and curl GET the crash endpoint to generate exceptions.

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

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
