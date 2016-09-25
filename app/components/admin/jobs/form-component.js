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
    if (this.get('post.hasDirtyAttributes') && !this.get('post.isSaving')) {
      this.get('post').rollbackAttributes();
    }
  },

  labelButton: Ember.computed('type', function() {
    const labels = {
      'new': 'Create job',
      'edit': 'Update job'
    };

    return labels[this.get('type')];
  }),

  labelNotificationError: Ember.computed('label', function() {
    const labels = {
      'new': 'Impossible to create the job',
      'edit': 'Impossible to update the job'
    };

    return labels[this.get('type')];
  }),

  labelNotificationSuccess: Ember.computed('label', function() {
    const labels = {
      'new': 'Job created!',
      'edit': 'Job updated!'
    };

    return labels[this.get('type')];
  }),

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

        if (this.get('type') == 'new') {
          // Send IFTTT maker
          Ember.$.get('/api/ifttt/maker', {
            event: 'new_job_offer',
            value1: this.get('post.title'),
            value2: this.get('post.company'),
            value3: this.get('post.location')
          });
        }

        this.get('notification').success(this.get('labelNotificationSuccess'));
        this.set('forceButtonDisabled', false);
        this.get('router').transitionTo('admin.jobs');
      })
      .catch(() => {
        this.set('forceButtonDisabled', false);
        this.get('notification').error(this.get('labelNotificationError'));
      });
    }
  }
});
