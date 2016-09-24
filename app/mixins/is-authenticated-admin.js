import Ember from 'ember';
import config from 'elixirhunt/config/environment';

export default Ember.Mixin.create({

  auth: Ember.inject.service('auth-admin'),

  /**
   * Check if the user can access the resource
   */
  beforeModel(transition) {
    Ember.assert(
      'The login route cannot implement the authenticated mixin ' +
      'as that leads to an infinite transitioning loop!',
      this.get('routeName') !== config.auth.admin.redirectNotAuthenticated
    );

    return this.get('auth').isAuthenticated()
      .then(() => {
        return this._super(...arguments);
      })
      .catch(() => {
        transition.abort();
        this.transitionTo(config.auth.admin.redirectNotAuthenticated);
      });

  }

});
