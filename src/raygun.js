const la = require('lazy-ass')
const check = require('check-more-types')
const raygun = require('raygun')
const exists = require('fs').existsSync
const read = require('fs').readFileSync

const excludedDomains = ['localhost', '127.0.0.1']

function noop () {}

function getRaygunApiKey (config) {
  return config('RAYGUN') || config('RAYGUN_APIKEY')
}

function isConfigured (config) {
  la(check.fn(config), 'missing config function', config)
  return check.unemptyString(getRaygunApiKey(config))
}

function init (config, addRenderValue, commitId) {
  la(check.fn(config), 'missing config function', config)
  const raygunApiKey = getRaygunApiKey(config)
  la(check.unemptyString(raygunApiKey), 'missing raygun api key', raygunApiKey)

  la(check.fn(addRenderValue), 'missing addRenderValue function')
  la(check.unemptyString(commitId), 'unknown commit id', commitId)

  var raygunVersion
  var raygunClient = new raygun.Client().init({ apiKey: raygunApiKey })

  function onError (err) {
    raygunClient.send(err, { commit: commitId })
    console.error(err)
    process.exit(-1)
  }

  process.on('uncaughtException', onError)

  if (exists('package.json')) {
    var pkg = JSON.parse(read('./package.json'))
    // raygun requires version to be 4 numbers, add fake one
    raygunVersion = '0.' + pkg.version
    raygunClient.setVersion(raygunVersion)
  }

  addRenderValue('raygunApiKey', raygunApiKey || '')
  addRenderValue('raygunVersion', raygunVersion || '')
  addRenderValue('raygunExcludedHostnames', JSON.stringify(excludedDomains))

  console.log('initialized Raygun error reporting, commit id %s, version %s',
    commitId, raygunVersion)
  return raygunClient.expressHandler
}

module.exports = {
  isConfigured: isConfigured,
  init: init
}

if (!module.parent) {
  console.log('demo raygun case')
  init('apiKey', noop, 'unknown')
}
