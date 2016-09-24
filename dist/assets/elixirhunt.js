"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('elixirhunt/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTAdapter.extend({
    namespace: 'api'
  });
});
define('elixirhunt/app', ['exports', 'ember', 'elixirhunt/resolver', 'ember-load-initializers', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntResolver, _emberLoadInitializers, _elixirhuntConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _elixirhuntConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _elixirhuntConfigEnvironment['default'].podModulePrefix,
    Resolver: _elixirhuntResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _elixirhuntConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('elixirhunt/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'elixirhunt/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _elixirhuntConfigEnvironment) {

  var name = _elixirhuntConfigEnvironment['default'].APP.name;
  var version = _elixirhuntConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('elixirhunt/components/ember-load-remover', ['exports', 'ember-load/components/ember-load-remover'], function (exports, _emberLoadComponentsEmberLoadRemover) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLoadComponentsEmberLoadRemover['default'];
    }
  });
});
define('elixirhunt/components/sidebar-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service('auth-admin'),

    actions: {
      logout: function logout() {
        var _this = this;

        this.get('auth').revoke().then(function () {
          _this.get('router').transitionTo('admin.auth.login');
        });
      }
    }
  });
});
define('elixirhunt/controllers/admin/auth/login', ['exports', 'elixirhunt/mixins/disabled-button', 'ember-cp-validations'], function (exports, _elixirhuntMixinsDisabledButton, _emberCpValidations) {

  var Validations = (0, _emberCpValidations.buildValidations)({
    password: (0, _emberCpValidations.validator)('presence', true)
  });

  exports['default'] = Ember.Controller.extend(Validations, _elixirhuntMixinsDisabledButton['default'], {

    auth: Ember.inject.service('auth-admin'),
    notification: Ember.inject.service(),

    actions: {
      authenticate: function authenticate() {
        var _this = this;

        // Security
        if (!this.get('validations.isValid')) {
          alert('not valid');
          return;
        }

        this.set('forceButtonDisabled', true);
        var password = this.get('password');

        this.get('auth').authenticate(password).done(function () {
          _this.transitionToRoute('admin.jobs');
        }).fail(function () {
          _this.set('forceButtonDisabled', false);
          _this.get('notification').error('Impossible to connect with this password');
          _this.set('password', null);
        });
      }
    }

  });
});
define('elixirhunt/controllers/index', ['exports'], function (exports) {
  exports['default'] = Ember.Controller.extend({

    keen: Ember.inject.service(),

    subscribeText: 'Subscribe',

    classified: Ember.computed('model', function () {
      return this.get('model').toArray().reverse();
    }),

    isFormValid: Ember.computed('email', 'firstname', 'lastname', function () {

      if (!this.get('email') || !this.get('firstname') || !this.get('lastname')) {
        return false;
      }

      if (!this.get('email').includes('@')) {
        return false;
      }

      return true;
    }),

    disabledButton: Ember.computed('isFormValid', function () {
      if (this.get('isFormValid')) {
        return null;
      }

      return true;
    }),

    onToggleShow: function onToggleShow(post) {
      post.toggleProperty('visible');
    },

    onApply: function onApply(post) {

      this.get('keen').send('click-apply', {
        id: post.get('id'),
        title: post.get('title')
      });

      Ember.$.get('/api/ifttt/maker', {
        event: 'new_click_apply',
        value1: post.get('title')
      });

      window.open(post.get('apply'), '_blank');
    },

    onSubscribe: function onSubscribe() {
      var _this = this;

      this.set('subscribeText', 'Loading ...');

      var request = Ember.$.get('/api/ifttt/maker', {
        event: 'new_subscriber_mailchimp',
        value1: this.get('email'),
        value2: this.get('firstname'),
        value3: this.get('lastname')
      });

      request.done(function (response) {
        _this.set('subscribeText', 'Done!');
        _this.setProperties({
          email: null,
          firstname: null,
          lastname: null
        });

        Ember.run.later(_this, function () {
          _this.set('subscribeText', 'Subscribe');
        }, 1000);
      });
    },

    actions: {
      toggleShow: function toggleShow(post) {
        this.onToggleShow(post);
      },

      subscribe: function subscribe() {
        this.onSubscribe();
      },

      apply: function apply(post) {
        this.onApply(post);
      }

    }

  });
});
define('elixirhunt/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/humanize-date', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.humanizeDate = humanizeDate;

  function humanizeDate(_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var date = _ref2[0];

    var now = moment();

    return moment(date).from(now);
  }

  exports['default'] = _ember['default'].Helper.helper(humanizeDate);
});
define('elixirhunt/helpers/if-empty', ['exports', 'ember'], function (exports, _ember) {
  exports.ifEmpty = ifEmpty;

  function ifEmpty(params) {
    var content = params[0];
    var replacement = params[1] || 'N/A';

    if (_ember['default'].isEmpty(content)) {
      return replacement;
    } else {
      return content;
    }
  }

  exports['default'] = _ember['default'].Helper.helper(ifEmpty);
});
define('elixirhunt/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/markdown-decode', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.markdownDecode = markdownDecode;

  function markdownDecode(_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var content = _ref2[0];

    var breakTag = '<br/>';

    content = markdown.toHTML(content);

    return (content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }

  exports['default'] = _ember['default'].Helper.helper(markdownDecode);
});
define('elixirhunt/helpers/nl2br', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.nl2br = nl2br;
  var helper = _ember['default'].Helper.helper;
  var htmlSafe = _ember['default'].String.htmlSafe;

  function nl2br(_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var content = _ref2[0];

    var breakTag = '<br />';
    return new htmlSafe((content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'));
  }

  exports['default'] = _ember['default'].Helper.helper(nl2br);
});
define('elixirhunt/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('elixirhunt/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('elixirhunt/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('elixirhunt/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'elixirhunt/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _elixirhuntConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_elixirhuntConfigEnvironment['default'].APP.name, _elixirhuntConfigEnvironment['default'].APP.version)
  };
});
define('elixirhunt/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('elixirhunt/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('elixirhunt/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('elixirhunt/initializers/export-application-global', ['exports', 'ember', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_elixirhuntConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _elixirhuntConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_elixirhuntConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('elixirhunt/initializers/hide-loading-screen', ['exports', 'elixirhunt/instance-initializers/hide-loading-screen', 'ember'], function (exports, _elixirhuntInstanceInitializersHideLoadingScreen, _ember) {
  exports.initialize = initialize;

  var EMBER_VERSION_REGEX = /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:(?:\-(alpha|beta)\.([0-9]+)(?:\.([0-9]+))?)?)?(?:\+(canary))?(?:\.([0-9abcdef]+))?(?:\-([A-Za-z0-9\.\-]+))?(?:\+([A-Za-z0-9\.\-]+))?$/;

  /**
   * VERSION_INFO[i] is as follows:
   *
   * 0  complete version string
   * 1  major version
   * 2  minor version
   * 3  trivial version
   * 4  pre-release type (optional: "alpha" or "beta" or undefined for stable releases)
   * 5  pre-release version (optional)
   * 6  pre-release sub-version (optional)
   * 7  canary (optional: "canary", or undefined for stable releases)
   * 8  SHA (optional)
   */
  var VERSION_INFO = EMBER_VERSION_REGEX.exec(_ember['default'].VERSION);
  var isPre111 = parseInt(VERSION_INFO[1], 10) < 2 && parseInt(VERSION_INFO[2], 10) < 12;

  function initialize() {
    if (isPre111) {
      var registry = arguments[0];
      var application = arguments[1];
      _elixirhuntInstanceInitializersHideLoadingScreen['default'].initialize(registry, application);
    }
  }

  exports['default'] = {
    name: 'hide-loading-screen',
    initialize: initialize
  };
});
define('elixirhunt/initializers/inject-router', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    // Injects all Ember components with a router object:
    application.inject('component', 'router', 'router:main');
  }

  exports['default'] = {
    name: 'inject-router',
    initialize: initialize
  };
});
define('elixirhunt/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('elixirhunt/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('elixirhunt/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('elixirhunt/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("elixirhunt/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('elixirhunt/instance-initializers/hide-loading-screen', ['exports', 'elixirhunt/config/environment'], function (exports, _elixirhuntConfigEnvironment) {
  exports.initialize = initialize;

  var userConfig = _elixirhuntConfigEnvironment['default']['ember-load'] || {};

  function initialize() {
    var instance = arguments[1] || arguments[0];
    var container = !!arguments[1] ? arguments[0] : instance.container;

    if (Ember.View) {
      var ApplicationView = container.lookupFactory ? container.lookupFactory('view:application') : instance.resolveRegistration('view:application');

      ApplicationView = ApplicationView.reopen({
        didInsertElement: function didInsertElement() {
          this._super.apply(this, arguments);

          var loadingIndicatorClass = userConfig.loadingIndicatorClass || 'ember-load-indicator';

          Ember.$('.' + loadingIndicatorClass).remove();
        }
      });
    }
  }

  exports['default'] = {
    name: 'hide-loading-screen-instance',
    initialize: initialize
  };
});
define('elixirhunt/mixins/disabled-button', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Mixin.create({

    /**
     * Flag to know if we need to force the button to be disabled.
     * @type {Boolean}
     */
    forceButtonDisabled: false,

    /**
     * Check if the button is disabled
     * @return {true/null}
     */
    isButtonDisabled: _ember['default'].computed('validations.isValid', 'forceButtonDisabled', function () {
      if (this.get('validations.isValid') && !this.get('forceButtonDisabled')) {
        return false;
      }

      return true;
    })
  });
});
define('elixirhunt/mixins/is-authenticated-admin', ['exports', 'ember', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntConfigEnvironment) {
  exports['default'] = _ember['default'].Mixin.create({

    auth: _ember['default'].inject.service('auth-admin'),

    /**
     * Check if the user can access the resource
     */
    beforeModel: function beforeModel(transition) {
      var _this = this,
          _arguments = arguments;

      _ember['default'].assert('The login route cannot implement the authenticated mixin ' + 'as that leads to an infinite transitioning loop!', this.get('routeName') !== _elixirhuntConfigEnvironment['default'].auth.admin.redirectNotAuthenticated);

      return this.get('auth').isAuthenticated().then(function () {
        return _this._super.apply(_this, _arguments);
      })['catch'](function () {
        transition.abort();
        _this.transitionTo(_elixirhuntConfigEnvironment['default'].auth.admin.redirectNotAuthenticated);
      });
    }

  });
});
define('elixirhunt/models/post', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    title: _emberData['default'].attr('string'),
    company: _emberData['default'].attr('string'),
    content: _emberData['default'].attr('string'),
    logo: _emberData['default'].attr('string'),
    apply: _emberData['default'].attr('string'),
    location: _emberData['default'].attr('string'),
    date: _emberData['default'].attr('string'),
    createdAt: _emberData['default'].attr('date'),
    updatedAt: _emberData['default'].attr('date')
  });
});
define('elixirhunt/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('elixirhunt/router', ['exports', 'ember', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _elixirhuntConfigEnvironment['default'].locationType,
    rootURL: _elixirhuntConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('stats');

    this.route('admin', function () {
      this.route('auth', function () {
        this.route('login');
      });
      this.route('jobs', function () {
        this.route('new');
        this.route('edit');
      });
    });

    this.route('404', { path: '*:' });
  });

  exports['default'] = Router;
});
define('elixirhunt/routes/404', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    redirect: function redirect() {
      this.transitionTo('index');
    }

  });
});
define('elixirhunt/routes/admin/jobs/edit', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('elixirhunt/routes/admin/jobs/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('post');
    }
  });
});
define('elixirhunt/routes/admin/jobs/new', ['exports', 'ember', 'elixirhunt/mixins/is-authenticated-admin'], function (exports, _ember, _elixirhuntMixinsIsAuthenticatedAdmin) {
  exports['default'] = _ember['default'].Route.extend(_elixirhuntMixinsIsAuthenticatedAdmin['default'], {});
});
define('elixirhunt/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('post');
    }

  });
});
define('elixirhunt/routes/stats', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        keen: _ember['default'].inject.service(),

        model: function model() {
            return _ember['default'].RSVP.hash({
                apply_clicks_this_day: this.get('keen').count('click-apply', 'this_1_day'),
                apply_clicks_this_week: this.get('keen').count('click-apply', 'this_1_weeks'),
                apply_clicks_this_month: this.get('keen').count('click-apply', 'this_1_months'),
                apply_clicks_this_year: this.get('keen').count('click-apply', 'this_1_years')
            });
        }

    });
});
define('elixirhunt/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('elixirhunt/services/auth-admin', ['exports', 'ember', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntConfigEnvironment) {
  exports['default'] = _ember['default'].Service.extend({

    /**
     * authenticate - Authenticate the admin
     *
     * @param  {string} password Password of the admin
     * @return {defered}
     */
    authenticate: function authenticate(password) {
      return _ember['default'].$.ajax({
        method: 'POST',
        url: _elixirhuntConfigEnvironment['default'].auth.admin.authenticateEndpoint,
        data: {
          password: password
        }
      });
    },

    /**
     * revoke - Delete the session of the admin
     *
     * @return {defered}
     */
    revoke: function revoke() {
      return _ember['default'].$.ajax({
        method: 'GET',
        url: _elixirhuntConfigEnvironment['default'].auth.admin.revokeEndpoint
      });
    },

    /**
     * isAuthenticated - Check if authenticated
     *
     * @return {promise}
     */
    isAuthenticated: function isAuthenticated() {
      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        _ember['default'].$.ajax({
          method: 'GET',
          url: _elixirhuntConfigEnvironment['default'].auth.admin.isAuthenticatedEndpoint
        }).then(function (response) {
          if (response.connected) {
            resolve();
          } else {
            reject();
          }
        }, function () {
          reject();
        });
      });
    }

  });
});
define('elixirhunt/services/ember-load-config', ['exports', 'ember-load/services/ember-load-config', 'elixirhunt/config/environment'], function (exports, _emberLoadServicesEmberLoadConfig, _elixirhuntConfigEnvironment) {
  var userConfig = _elixirhuntConfigEnvironment['default']['ember-load'] || {};

  exports['default'] = _emberLoadServicesEmberLoadConfig['default'].extend({
    loadingIndicatorClass: userConfig.loadingIndicatorClass
  });
});
define('elixirhunt/services/keen', ['exports', 'ember', 'elixirhunt/config/environment'], function (exports, _ember, _elixirhuntConfigEnvironment) {
    exports['default'] = _ember['default'].Service.extend({

        projectId: _elixirhuntConfigEnvironment['default'].KEEN_PROJECT_ID,
        writeKey: _elixirhuntConfigEnvironment['default'].KEEN_WRITE_KEY,
        readKey: _elixirhuntConfigEnvironment['default'].KEEN_READ_KEY,

        baseUrl: function baseUrl() {
            return 'https://api.keen.io/3.0/projects/' + this.get('projectId');
        },

        count: function count(collection, timeframe) {

            var url = this.baseUrl() + '/queries/count';

            return $.get(url, {
                event_collection: collection,
                timeframe: timeframe,
                api_key: this.get('readKey')
            });
        },

        send: function send(event, attributes) {
            var url = this.baseUrl() + '/events/' + event;

            return _ember['default'].$.ajax({
                type: 'POST',
                headers: {
                    Authorization: this.get('writeKey')
                },
                url: url,
                contentType: 'application/json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: false
                },
                data: JSON.stringify(attributes),
                dataType: 'json'
            });
        }

    });
});
define('elixirhunt/services/notification', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Service.extend({

    /**
     * Flag to know if a notification is shown
     * @type {Boolean}
     */
    isShown: false,

    /**
     * Display an error notification
     * @param  {String}   message  The message to show
     * @param  {Function} callback Will be called after the notification close
     * @return void
     */
    error: function error(message, callback) {
      this._send('error', message, callback);
    },

    /**
     * Display a success notification
     * @param  {String}   message  The message to show
     * @param  {Function} callback Will be called after the notification close
     * @return void
     */
    success: function success(message, callback) {
      this._send('success', message, callback);
    },

    _send: function _send(type, message, callback) {
      var _this = this;

      if (!this.get('isShown')) {

        this.set('isShown', true);

        noty({
          type: type,
          text: message,
          animation: {
            open: 'animated flipInX',
            close: 'animated flipOutX'
          },
          timeout: 2200,
          maxVisible: 1,
          killer: true,
          callback: {
            afterClose: function afterClose() {
              _this.set('isShown', false);

              if (_ember['default'].typeOf(callback) === 'function') {
                return callback();
              }
            }
          }

        });
      }
    }
  });
});
define("elixirhunt/templates/admin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 10
          }
        },
        "moduleName": "elixirhunt/templates/admin.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("elixirhunt/templates/admin/auth/login", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "elixirhunt/templates/admin/auth/login.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "login");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-5 gr-centered");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "login__main");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "login__content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "login__logo");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7, "src", "/assets/images/knight.png");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("form");
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "login__input__container --radius-top --radius-bottom");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "icon-password");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "+spacer");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("button");
        dom.setAttribute(el7, "type", "submit");
        var el8 = dom.createTextNode("Sign In");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 1, 1, 1, 3]);
        var element1 = dom.childAt(element0, [5]);
        var morphs = new Array(4);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[2] = dom.createAttrMorph(element1, 'class');
        morphs[3] = dom.createAttrMorph(element1, 'disabled');
        return morphs;
      },
      statements: [["element", "action", ["authenticate"], ["on", "submit"], ["loc", [null, [9, 16], [9, 53]]], 0, 0], ["inline", "input", [], ["type", "password", "value", ["subexpr", "@mut", [["get", "password", ["loc", [null, [12, 44], [12, 52]]], 0, 0, 0, 0]], [], [], 0, 0], "placeholder", "Enter Password", "class", "login__input__field"], ["loc", [null, [12, 14], [12, 112]]], 0, 0], ["attribute", "class", ["concat", ["button --warning --large --expand ", ["subexpr", "if", [["get", "isButtonDisabled", ["loc", [null, [18, 80], [18, 96]]], 0, 0, 0, 0], "--muted"], [], ["loc", [null, [18, 75], [18, 108]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["get", "isButtonDisabled", ["loc", [null, [18, 121], [18, 137]]], 0, 0, 0, 0], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("elixirhunt/templates/admin/jobs/edit", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "elixirhunt/templates/admin/jobs/edit.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Edit jobs");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [2, 0], [2, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("elixirhunt/templates/admin/jobs/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 9,
              "column": 4
            }
          },
          "moduleName": "elixirhunt/templates/admin/jobs/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "post.title", ["loc", [null, [6, 6], [6, 20]]], 0, 0, 0, 0]],
        locals: ["post"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 6
          }
        },
        "moduleName": "elixirhunt/templates/admin/jobs/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "content-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container-fluid");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "sidebar-component", ["loc", [null, [1, 0], [1, 21]]], 0, 0, 0, 0], ["block", "each", [["get", "model", ["loc", [null, [5, 12], [5, 17]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [5, 4], [9, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("elixirhunt/templates/admin/jobs/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "elixirhunt/templates/admin/jobs/new.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("New jobs");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [2, 0], [2, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("elixirhunt/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 10
          }
        },
        "moduleName": "elixirhunt/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "ember-load-remover", ["loc", [null, [1, 0], [1, 22]]], 0, 0, 0, 0], ["content", "outlet", ["loc", [null, [2, 0], [2, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("elixirhunt/templates/components/sidebar-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.3",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 8
            },
            "end": {
              "line": 8,
              "column": 98
            }
          },
          "moduleName": "elixirhunt/templates/components/sidebar-component.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "icon-chart-line");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" Analytics");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.3",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 8
            },
            "end": {
              "line": 11,
              "column": 91
            }
          },
          "moduleName": "elixirhunt/templates/components/sidebar-component.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "icon-customer");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" Jobs");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "elixirhunt/templates/components/sidebar-component.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "sidebar-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sidebar__container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "sidebar__logo");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4, "src", "/assets/images/knight.png");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3, "class", "sidebar__links");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4, "class", "sidebar__link");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4, "class", "sidebar__link");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "sidebar__logout");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "#");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "icon-lock");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" Logout");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element0, [5, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]), 1, 1);
        morphs[2] = dom.createElementMorph(element2);
        return morphs;
      },
      statements: [["block", "link-to", ["admin.jobs"], ["activeClass", "--active"], 0, null, ["loc", [null, [8, 8], [8, 110]]]], ["block", "link-to", ["admin.jobs"], ["activeClass", "--active"], 1, null, ["loc", [null, [11, 8], [11, 103]]]], ["element", "action", ["logout"], ["on", "click"], ["loc", [null, [15, 18], [15, 48]]], 0, 0]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("elixirhunt/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.7.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 67,
                  "column": 8
                },
                "end": {
                  "line": 69,
                  "column": 8
                }
              },
              "moduleName": "elixirhunt/templates/index.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "post__logo");
              var el2 = dom.createElement("img");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1, 0]);
              var morphs = new Array(1);
              morphs[0] = dom.createAttrMorph(element1, 'src');
              return morphs;
            },
            statements: [["attribute", "src", ["concat", [["get", "post.logo", ["loc", [null, [68, 47], [68, 56]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.7.3",
            "loc": {
              "source": null,
              "start": {
                "line": 66,
                "column": 6
              },
              "end": {
                "line": 73,
                "column": 6
              }
            },
            "moduleName": "elixirhunt/templates/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "post__content");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createUnsafeMorphAt(dom.childAt(fragment, [2]), 1, 1);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [["block", "if", [["get", "post.logo", ["loc", [null, [67, 14], [67, 23]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [67, 8], [69, 15]]]], ["inline", "markdown-decode", [["get", "post.content", ["loc", [null, [71, 29], [71, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [71, 10], [71, 44]]], 0, 0]],
          locals: [],
          templates: [child0]
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.3",
            "loc": {
              "source": null,
              "start": {
                "line": 76,
                "column": 4
              },
              "end": {
                "line": 80,
                "column": 4
              }
            },
            "moduleName": "elixirhunt/templates/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "post__apply");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2, "target", "_blank");
            var el3 = dom.createTextNode("Apply for this job");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'href');
            morphs[1] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["attribute", "href", ["concat", [["get", "post.apply", ["loc", [null, [78, 56], [78, 66]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["apply", ["get", "post", ["loc", [null, [78, 28], [78, 32]]], 0, 0, 0, 0]], ["on", "click"], ["loc", [null, [78, 11], [78, 46]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.3",
          "loc": {
            "source": null,
            "start": {
              "line": 50,
              "column": 2
            },
            "end": {
              "line": 81,
              "column": 2
            }
          },
          "moduleName": "elixirhunt/templates/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "post__container");
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "gr-6");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "post__title");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "post__company");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "gr-4");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "post__location");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "icon-location");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "gr-2");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "post__date");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "icon-clock");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "clear");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [1]);
          var morphs = new Array(7);
          morphs[0] = dom.createElementMorph(element2);
          morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element3, [3]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element2, [3, 1]), 2, 2);
          morphs[4] = dom.createMorphAt(dom.childAt(element2, [5, 1]), 2, 2);
          morphs[5] = dom.createMorphAt(element2, 9, 9);
          morphs[6] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["element", "action", ["toggleShow", ["get", "post", ["loc", [null, [51, 55], [51, 59]]], 0, 0, 0, 0]], ["on", "click"], ["loc", [null, [51, 33], [51, 72]]], 0, 0], ["content", "post.title", ["loc", [null, [54, 33], [54, 49]]], 0, 0, 0, 0], ["inline", "if-empty", [["get", "post.company", ["loc", [null, [55, 46], [55, 58]]], 0, 0, 0, 0]], [], ["loc", [null, [55, 35], [55, 61]]], 0, 0], ["inline", "if-empty", [["get", "post.location", ["loc", [null, [58, 77], [58, 90]]], 0, 0, 0, 0]], [], ["loc", [null, [58, 66], [58, 93]]], 0, 0], ["inline", "humanize-date", [["get", "post.date", ["loc", [null, [61, 75], [61, 84]]], 0, 0, 0, 0]], [], ["loc", [null, [61, 59], [61, 87]]], 0, 0], ["block", "if", [["get", "post.visible", ["loc", [null, [66, 12], [66, 24]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [66, 6], [73, 13]]]], ["block", "if", [["get", "post.visible", ["loc", [null, [76, 10], [76, 22]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [76, 4], [80, 11]]]]],
        locals: ["post"],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 88,
            "column": 0
          }
        },
        "moduleName": "elixirhunt/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "header__container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "header__title");
        var el4 = dom.createTextNode("We hunt for Elixir Jobs ... so you don't have to!");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "section__container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "section__email");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "gr-4");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "section__description");
        var el7 = dom.createTextNode("Get a weekly email of all new jobs");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "gr-2");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "gr-2");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "gr-2");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "gr-2");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6, "type", "submit");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "clear");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-8");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        dom.setAttribute(el4, "class", "section__title");
        var el5 = dom.createTextNode("Jobs Hunted");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-4");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "+text-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "https://twitter.com/elixirhunt");
        dom.setAttribute(el5, "target", "_blank");
        dom.setAttribute(el5, "class", "section__twitter");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6, "class", "icon-twitter");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Follow us");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "clear");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "section__details");
        var el4 = dom.createTextNode("We hunt the job offers from different websites such as: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "https://angel.co/");
        dom.setAttribute(el4, "target", "_blank");
        var el5 = dom.createTextNode("angel.co");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(",\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "https://elixir-jobs.org/");
        dom.setAttribute(el4, "target", "_blank");
        var el5 = dom.createTextNode("elixir-jobs.org");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(", ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "target", "_blank");
        dom.setAttribute(el4, "href", "https://workwithelixir.com");
        var el5 = dom.createTextNode("workwithelixir.com");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(", ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "target", "_blank");
        dom.setAttribute(el4, "href", "http://www.jobsite.co.uk/");
        var el5 = dom.createTextNode("jobsite.co.uk");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(",\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "target", "_blank");
        dom.setAttribute(el4, "href", "https://weworkremotely.com/");
        var el5 = dom.createTextNode("weworkremotely.com");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" and ... more!\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "+spacer-large");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "footer__sword");
        var el2 = dom.createElement("img");
        dom.setAttribute(el2, "src", "/assets/images/elixir.png");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [2, 1, 1, 1]);
        var element5 = dom.childAt(element4, [9, 1]);
        var morphs = new Array(8);
        morphs[0] = dom.createElementMorph(element4);
        morphs[1] = dom.createMorphAt(dom.childAt(element4, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element4, [5]), 1, 1);
        morphs[3] = dom.createMorphAt(dom.childAt(element4, [7]), 1, 1);
        morphs[4] = dom.createAttrMorph(element5, 'class');
        morphs[5] = dom.createAttrMorph(element5, 'disabled');
        morphs[6] = dom.createMorphAt(element5, 0, 0);
        morphs[7] = dom.createMorphAt(dom.childAt(fragment, [4]), 1, 1);
        return morphs;
      },
      statements: [["element", "action", ["subscribe"], ["on", "submit"], ["loc", [null, [10, 12], [10, 46]]], 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "email", ["loc", [null, [15, 36], [15, 41]]], 0, 0, 0, 0]], [], [], 0, 0], "placeholder", "Email"], ["loc", [null, [15, 10], [15, 63]]], 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "firstname", ["loc", [null, [18, 36], [18, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "placeholder", "First Name"], ["loc", [null, [18, 10], [18, 72]]], 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "lastname", ["loc", [null, [21, 36], [21, 44]]], 0, 0, 0, 0]], [], [], 0, 0], "placeholder", "Last Name"], ["loc", [null, [21, 10], [21, 70]]], 0, 0], ["attribute", "class", ["concat", [["subexpr", "unless", [["get", "isFormValid", ["loc", [null, [24, 48], [24, 59]]], 0, 0, 0, 0], "--disabled"], [], ["loc", [null, [24, 39], [24, 74]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["get", "disabledButton", ["loc", [null, [24, 88], [24, 102]]], 0, 0, 0, 0], 0, 0, 0, 0], ["content", "subscribeText", ["loc", [null, [24, 105], [24, 124]]], 0, 0, 0, 0], ["block", "each", [["get", "classified", ["loc", [null, [50, 10], [50, 20]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [50, 2], [81, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("elixirhunt/templates/stats", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 44,
            "column": 6
          }
        },
        "moduleName": "elixirhunt/templates/stats.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "header__container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "header__title");
        var el4 = dom.createTextNode("Stats of elixir hunt");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "stats__container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "stats__item --highlight");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__count");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__description");
        var el6 = dom.createTextNode("Clicks on apply");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__timeframe");
        var el6 = dom.createTextNode("Today");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "stats__item");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__count");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__description");
        var el6 = dom.createTextNode("Clicks on apply");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__timeframe");
        var el6 = dom.createTextNode("This week");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "stats__item");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__count");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__description");
        var el6 = dom.createTextNode("Clicks on apply");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__timeframe");
        var el6 = dom.createTextNode("This month");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "gr-3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "stats__item");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__count");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__description");
        var el6 = dom.createTextNode("Clicks on apply");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "stats__timeframe");
        var el6 = dom.createTextNode("This year");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1, 1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 1, 1]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1, 1]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [7, 1, 1]), 0, 0);
        return morphs;
      },
      statements: [["content", "model.apply_clicks_this_day.result", ["loc", [null, [12, 34], [12, 74]]], 0, 0, 0, 0], ["content", "model.apply_clicks_this_week.result", ["loc", [null, [21, 34], [21, 75]]], 0, 0, 0, 0], ["content", "model.apply_clicks_this_month.result", ["loc", [null, [29, 34], [29, 76]]], 0, 0, 0, 0], ["content", "model.apply_clicks_this_year.result", ["loc", [null, [37, 34], [37, 75]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define('elixirhunt/validators/alias', ['exports', 'ember-cp-validations/validators/alias'], function (exports, _emberCpValidationsValidatorsAlias) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsAlias['default'];
    }
  });
});
define('elixirhunt/validators/belongs-to', ['exports', 'ember-cp-validations/validators/belongs-to'], function (exports, _emberCpValidationsValidatorsBelongsTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsBelongsTo['default'];
    }
  });
});
define('elixirhunt/validators/collection', ['exports', 'ember-cp-validations/validators/collection'], function (exports, _emberCpValidationsValidatorsCollection) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsCollection['default'];
    }
  });
});
define('elixirhunt/validators/confirmation', ['exports', 'ember-cp-validations/validators/confirmation'], function (exports, _emberCpValidationsValidatorsConfirmation) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsConfirmation['default'];
    }
  });
});
define('elixirhunt/validators/date', ['exports', 'ember-cp-validations/validators/date'], function (exports, _emberCpValidationsValidatorsDate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsDate['default'];
    }
  });
});
define('elixirhunt/validators/dependent', ['exports', 'ember-cp-validations/validators/dependent'], function (exports, _emberCpValidationsValidatorsDependent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsDependent['default'];
    }
  });
});
define('elixirhunt/validators/ds-error', ['exports', 'ember-cp-validations/validators/ds-error'], function (exports, _emberCpValidationsValidatorsDsError) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsDsError['default'];
    }
  });
});
define('elixirhunt/validators/exclusion', ['exports', 'ember-cp-validations/validators/exclusion'], function (exports, _emberCpValidationsValidatorsExclusion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsExclusion['default'];
    }
  });
});
define('elixirhunt/validators/format', ['exports', 'ember-cp-validations/validators/format'], function (exports, _emberCpValidationsValidatorsFormat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsFormat['default'];
    }
  });
});
define('elixirhunt/validators/has-many', ['exports', 'ember-cp-validations/validators/has-many'], function (exports, _emberCpValidationsValidatorsHasMany) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsHasMany['default'];
    }
  });
});
define('elixirhunt/validators/inclusion', ['exports', 'ember-cp-validations/validators/inclusion'], function (exports, _emberCpValidationsValidatorsInclusion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsInclusion['default'];
    }
  });
});
define('elixirhunt/validators/length', ['exports', 'ember-cp-validations/validators/length'], function (exports, _emberCpValidationsValidatorsLength) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsLength['default'];
    }
  });
});
define('elixirhunt/validators/messages', ['exports', 'ember-cp-validations/validators/messages'], function (exports, _emberCpValidationsValidatorsMessages) {
  /**
   * Copyright 2016, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsMessages['default'];
    }
  });
});
define('elixirhunt/validators/number', ['exports', 'ember-cp-validations/validators/number'], function (exports, _emberCpValidationsValidatorsNumber) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsNumber['default'];
    }
  });
});
define('elixirhunt/validators/presence', ['exports', 'ember-cp-validations/validators/presence'], function (exports, _emberCpValidationsValidatorsPresence) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCpValidationsValidatorsPresence['default'];
    }
  });
});
define('elixirhunt/views/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('elixirhunt/config/environment', ['ember'], function(Ember) {
  var prefix = 'elixirhunt';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("elixirhunt/app")["default"].create({"name":"elixirhunt","version":"0.0.0+8a91e5f8"});
}

/* jshint ignore:end */
//# sourceMappingURL=elixirhunt.map