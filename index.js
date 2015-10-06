require('lazy-ass');
var check = require('check-more-types');

// available crash reporting clients
var initRaygunClient = require('./src/raygun');

var getLastCommitId = require('last-commit');
la(check.fn(getLastCommitId), 'missing last commit function');
var renderVars = require('render-vars');
la(check.fn(renderVars), 'expected render vars function', renderVars);

function noop() {}

function isUnknown(id) {
  return id === 'unknown';
}

function isValidCommit(id) {
  return check.shortCommitId(id) || isUnknown(id)
}

function getRaygunApiKey(config) {
  return config('RAYGUN') || config('RAYGUN_APIKEY');
}

function initMiddleware(config, addRenderValue, commitId) {
  la(check.fn(addRenderValue), 'missing addRenderValue function');
  la(check.unemptyString(commitId), 'unknown commit id', commitId);
  la(isValidCommit(commitId), 'not a commit sha', commitId);

  console.log('init crash middleware for commit "%s"', commitId);

  var raygunApiKey = getRaygunApiKey(config);
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

if (!module.parent) {
  console.log('demo use case');
  initCrashReporting(noop, noop)
    .then(function (client) {
      // there should be no client
      console.log('middleware client is noop?', client === noop);
      la(client === noop, 'not noop', client);
    }).done();
}
