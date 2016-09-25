export default Ember.Controller.extend({

  keen: Ember.inject.service(),

  subscribeText: 'Subscribe',
  
  isFormValid: Ember.computed('email', 'firstname', 'lastname', function() {

    if (!this.get('email') || !this.get('firstname') || !this.get('lastname')) {
      return false;
    }

    if (!this.get('email').includes('@')) {
      return false;
    }

    return true;
  }),

  disabledButton: Ember.computed('isFormValid', function() {
    if (this.get('isFormValid')) {
      return null;
    }

    return true;
  }),

  onToggleShow(post) {
    post.toggleProperty('visible');
  },

  onApply(post) {

    this.get('keen').send('click-apply', {
      id: post.get('id'),
      title: post.get('title')
    });

    Ember.$.get('/api/ifttt/maker', {
      event: 'new_click_apply',
      value1: post.get('title')
    });

    window.open(post.get('url'), '_blank');
  },

  onSubscribe() {

    this.set('subscribeText', 'Loading ...');

    let request = Ember.$.get('/api/ifttt/maker', {
        event: 'new_subscriber_mailchimp',
        value1: this.get('email'),
        value2: this.get('firstname'),
        value3: this.get('lastname')
      });

    request.done((response) => {
      this.set('subscribeText', 'Done!');
      this.setProperties({
        email: null,
        firstname: null,
        lastname: null
      });

      Ember.run.later(this, () => {
        this.set('subscribeText', 'Subscribe')
      }, 1000);
    });

  },



  actions: {
    toggleShow(post) {
      this.onToggleShow(post);
    },

    subscribe() {
      this.onSubscribe();
    },

    apply(post) {
      this.onApply(post);
    }

  }

});