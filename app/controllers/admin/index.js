export default Ember.Controller.extend({
  redirect() {
    this.transitionTo('admin.jobs');
  }
});