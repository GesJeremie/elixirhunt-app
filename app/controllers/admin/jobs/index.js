import DisabledButton from 'elixirhunt/mixins/disabled-button';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  password: validator('presence', true)
});

export default Ember.Controller.extend(Validations, DisabledButton, {

  auth: Ember.inject.service('auth-admin'),
  notification: Ember.inject.service(),

  actions: {
    showMore(post) {
      post.toggleProperty('showMore');
    },

    remove(post) {
      post.destroyRecord()
      .then(() => {
        this.get('notification').success('Job deleted');
      })
      .catch(() => {
        this.get('notification').error('Impossible to delete the job');
      });
    }
  }

});