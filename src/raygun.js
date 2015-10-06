require('lazy-ass');
var check = require('check-more-types');
var raygun = require('raygun');
var exists = require('fs').existsSync;
var read = require('fs').readFileSync;

var excludedDomains = ['localhost', '127.0.0.1'];

function noop() {}

function initRaygunClient(raygunApiKey, addRenderValue, commitId) {
  la(check.unemptyString(raygunApiKey), 'missing raygun api key', raygunApiKey);
  la(check.fn(addRenderValue), 'missing addRenderValue function');
  la(check.unemptyString(commitId), 'unknown commit id', commitId);

  var raygunVersion;
  var raygunClient = new raygun.Client().init({ apiKey: raygunApiKey });

  function onError(err) {
    raygunClient.send(err, { commit: commitId });
    console.error(err);
    process.exit(-1);
  }

  process.on('uncaughtException', onError);

  if (exists('package.json')) {
    var pkg = JSON.parse(read('./package.json'));
    // raygun requires version to be 4 numbers, add fake one
    raygunVersion = '0.' + pkg.version;
    raygunClient.setVersion(raygunVersion);
  }

  addRenderValue('raygunApiKey', raygunApiKey || '');
  addRenderValue('raygunVersion', raygunVersion || '');
  addRenderValue('raygunExcludedHostnames', JSON.stringify(excludedDomains));

  console.log('initialized Raygun error reporting, commit id %s, version %s',
    commitId, raygunVersion);
  return raygunClient.expressHandler;
}

module.exports = initRaygunClient;

if (!module.parent) {
  console.log('demo raygun case');
  initRaygunClient('apiKey', noop, 'unknown');
}
