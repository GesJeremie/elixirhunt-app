import Ember from 'ember';
import isAuthenticatedAdmin from 'elixirhunt/mixins/is-authenticated-admin';

export default Ember.Route.extend(isAuthenticatedAdmin, {
  model(params) {
    return this.store.findRecord('post', params.job_id);
  }
});
