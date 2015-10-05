require('lazy-ass');
var check = require('check-more-types');
// available crash reporting clients
var raygun = require('raygun');

var getLastCommitId = require('last-commit');
la(check.fn(getLastCommitId), 'missing last commit function');
var renderVars = require('render-vars');
la(check.fn(renderVars), 'expected render vars function', renderVars);

var pkg = require('./package.json');
var excludedDomains = ['localhost', '127.0.0.1'];

function noop() {}

function initRaygunClient(raygunApiKey, addRenderValue, commitId) {
  la(check.fn(addRenderValue), 'missing addRenderValue function');
  la(check.unemptyString(commitId), 'unknown commit id', commitId);
  la(check.shortCommitId(commitId), 'not a commit sha', commitId);

  var raygunClient = new raygun.Client().init({ apiKey: raygunApiKey });
  process.on('uncaughtException', function onError(err) {
    raygunClient.send(err, { commit: commitId });
    console.error(err);
    process.exit(-1);
  });

  // raygun requires version to be 4 numbers, add fake one
  var raygunVersion = '0.' + pkg.version;
  raygunClient.setVersion(raygunVersion);

  addRenderValue('raygunApiKey', raygunApiKey || '');
  addRenderValue('raygunVersion', raygunVersion || '');
  addRenderValue('raygunExcludedHostnames', JSON.stringify(excludedDomains));

  console.log('initialized Raygun error reporting, commit id %s, version %s',
    commitId, raygunVersion);
  return raygunClient;
}

function initMiddleware(config, addRenderValue, commitId) {
  la(check.fn(addRenderValue), 'missing addRenderValue function');
  la(check.unemptyString(commitId), 'unknown commit id', commitId);
  la(check.shortCommitId(commitId), 'not a commit sha', commitId);

  console.log('init crash middleware for commit %s', commitId);

  var raygunApiKey = config('RAYGUN');
  if (check.unemptyString(raygunApiKey)) {
    return initRaygunClient(raygunApiKey, addRenderValue, commitId);
  }

  console.log('skipping error reporting setup - missing api key');
  return noop;
}

function initCrashReporting(config, server) {
  la(check.fn(config), 'missing config get function', config);
  la(check.fn(server), 'missing server', server);

  var addRenderValue = renderVars.bind(null, server);
  var hookReporter = initMiddleware.bind(null, config, addRenderValue);

  return getLastCommitId()
    .then(hookReporter);
}

module.exports = initCrashReporting;

if (!module.exports) {
  // demo use case
  initCrashReporting(noop)
    .then(function (client) {
      // there should be no client
      console.log('middleware client is noop?', client === noop);
    }).done();
}
