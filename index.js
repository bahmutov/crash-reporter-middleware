const la = require('lazy-ass')
const check = require('check-more-types')

// available crash reporting clients
const raygunClient = require('./src/raygun')

const isClient = check.schema({
  isConfigured: check.fn,
  init: check.fn
})
la(isClient(raygunClient), 'bad raygun client', raygunClient)

const getLastCommitId = require('last-commit')
la(check.fn(getLastCommitId), 'missing last commit function')
const renderVars = require('render-vars')
la(check.fn(renderVars), 'expected render vars function', renderVars)

function noop () {}

function isUnknown (id) {
  return id === 'unknown'
}

function isValidCommit (id) {
  return check.shortCommitId(id) || isUnknown(id)
}

function initMiddleware (config, addRenderValue, commitId) {
  la(check.fn(addRenderValue), 'missing addRenderValue function')
  la(check.unemptyString(commitId), 'unknown commit id', commitId)
  la(isValidCommit(commitId), 'not a commit sha', commitId)

  console.log('init crash middleware for commit "%s"', commitId)

  if (raygunClient.isConfigured(config)) {
    console.log('using Raygun client settings')
    return raygunClient.init(config, addRenderValue, commitId)
  }

  console.log('skipping error reporting setup - missing any api keys')
  return noop
}

/*
  resolves with middleware function. One can use it like
  initCrashReporting(config, app)
    .then((middleware) => {
      if (middleware) {
        app.use(middleware)
      }
    })
*/
function initCrashReporting (config, server) {
  la(check.fn(config), 'missing config get function', config)
  la(check.fn(server), 'missing server', server)

  var addRenderValue = renderVars.bind(null, server)
  var hookReporter = initMiddleware.bind(null, config, addRenderValue)

  return getLastCommitId()
    .then(hookReporter)
}

module.exports = initCrashReporting

if (!module.parent) {
  console.log('demo use case')
  initCrashReporting(noop, noop)
    .then(function (client) {
      // there should be no client
      console.log('middleware client is noop?', client === noop)
      la(client === noop, 'not noop', client)
    }).done()
}
