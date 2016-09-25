import DisabledButton from 'elixirhunt/mixins/disabled-button';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  password: validator('presence', true)
});

export default Ember.Controller.extend(Validations, DisabledButton, {

  auth: Ember.inject.service('auth-admin'),
  notification: Ember.inject.service(),

  actions: {
    authenticate() {
      
      // Security
      if (!this.get('validations.isValid')) {
        alert('not valid');
        return;
      }

      this.set('forceButtonDisabled', true);
      const password = this.get('password');

      this.get('auth').authenticate(password)
      .done(() => {
        this.set('forceButtonDisabled', false);
        this.set('password', null);
        this.transitionToRoute('admin.jobs');
      })
      .fail(() => {
        this.set('forceButtonDisabled', false);
        this.get('notification').error('Impossible to connect with this password');
        this.set('password', null);
      });


    }
  }

});