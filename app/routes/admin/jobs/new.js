import Ember from 'ember';
import isAuthenticatedAdmin from 'elixirhunt/mixins/is-authenticated-admin';

export default Ember.Route.extend(isAuthenticatedAdmin, {
  model() {
    return this.store.createRecord('post');
  }
});
