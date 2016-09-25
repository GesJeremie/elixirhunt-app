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
  auth: Ember.inject.service('auth-admin'),

  actions: {
    toggleShow(post) {
      post.toggleProperty('visible');
    }
  }
});
