/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    dotEnv: {
      clientAllowedKeys: [
        'KEEN_PROJECT_ID', 'KEEN_WRITE_KEY', 'KEEN_READ_KEY',
        'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_DATABASE_URL'
      ],
      path: {
        development: './.env.dev',
        production: './.env.prod'
      }
    },
    sassOptions: {
      extension: 'scss',
      includePaths: [
        'bower_components/csstyle',
        'bower_components/gridle/sass/gridle',
        'bower_components/reset-css/'
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('bower_components/tabletop/src/tabletop.js');
  app.import('bower_components/markdown/lib/markdown.js');
  app.import('bower_components/moment/min/moment.min.js');


  return app.toTree();
};