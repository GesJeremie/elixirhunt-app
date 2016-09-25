import Ember from 'ember';

export default Ember.Component.extend({
  hasButton: Ember.computed.and('buttonText', 'buttonLink')
});
