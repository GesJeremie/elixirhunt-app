import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('admin', function() {
    this.route('auth', function() {
      this.route('login');
    });
    
    this.route('stats');

    this.route('jobs', function() {
      this.route('new');
      this.route('edit', {path: '/:job_id/edit'});
    });
  });

  this.route('404', { path: '*:' });

});

export default Router;