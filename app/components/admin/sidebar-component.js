import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service('auth-admin'),

  actions: {
    logout() {
      this.get('auth').revoke().then(() => {
        this.get('router').transitionTo('admin.auth.login');
      });
    }
  }
});
