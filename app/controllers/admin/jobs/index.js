export default Ember.Controller.extend({

  actions: {
    showMore(post) {
      post.toggleProperty('showMore');
    }
  }

});