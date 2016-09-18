import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  company: DS.attr('string'),
  content: DS.attr('string'),
  logo: DS.attr('string'),
  apply: DS.attr('string'),
  location: DS.attr('string'),
  date: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
