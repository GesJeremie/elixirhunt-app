import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  // Application specific overrides go here
  namespace: 'api',

  pathForType(modelName) {
    const decamelized = Ember.String.decamelize(modelName);

    return Ember.String.pluralize(decamelized);
  }

});
