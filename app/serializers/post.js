import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  attrs: {
    createdAt: {
      serialize: false
    },
    updatedAt: {
      serialize: false
    }
  },

  keyForAttribute: function (attr) {
    return Ember.String.underscore(attr);
  }
});
