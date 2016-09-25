import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service('auth-admin'),

  actions: {
    toggleShow(post) {
      post.toggleProperty('visible');
    }
  }
});
