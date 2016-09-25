import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  company: DS.attr('string'),
  content: DS.attr('string'),
  logo: DS.attr('string'),
  apply: DS.attr('string'),
  location: DS.attr('string'),
  createdAt: DS.attr('string'),
  updatedAt: DS.attr('string')
});
