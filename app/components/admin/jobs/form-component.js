import Ember from 'ember';
import DisabledButton from 'elixirhunt/mixins/disabled-button';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  'post.title': validator('presence', true),
  'post.location': validator('presence', true),
  'post.content': validator('presence', true),
  'post.url': validator('presence', true)
});

export default Ember.Component.extend(Validations, DisabledButton, {
  notification: Ember.inject.service(),

  /**
   * Clean record if not saved
   */
  willDestroyElement() {
    if (this.get('post.hasDirtyAttributes')) {
      this.get('post').rollbackAttributes();
    }
  },

  actions: {
    toggleShow(post) {
      post.toggleProperty('visible');
    },

    save() {

      // Security
      if (!this.get('validations.isValid')) {
        return;
      }

      this.set('forceButtonDisabled', true);

      this.get('post').save()
      .then(() => {
        this.get('notification').success('New job added!');
        this.set('forceButtonDisabled', false);
        this.get('router').transitionTo('admin.jobs');
      })
      .catch(() => {
        this.set('forceButtonDisabled', false);
        this.get('notification').error('Impossible to save the record!');
      });
    }
  }
});
