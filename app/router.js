import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('stats');

  this.route('admin', function() {
    this.route('auth', function() {
      this.route('login');
    });
    this.route('jobs', function() {
      this.route('new');
      this.route('edit');
    });
  });

  this.route('404', { path: '*:' });

});

export default Router;