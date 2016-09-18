export default Ember.Controller.extend({

  keen: Ember.inject.service(),

  subscribeText: 'Subscribe',

  classified: Ember.computed('model', function() {
    return this.get('model').toArray().reverse()
  }),

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

    $.get('https://hooks.zapier.com/hooks/catch/1645102/63i78w/', {
      title: post.get('title')
    });

    window.open(post.get('apply'), '_blank');
  },

  onSubscribe() {

    this.set('subscribeText', 'Loading ...');

    let request = $.get('https://hooks.zapier.com/hooks/catch/1645102/6bhfip/', {
      data: {
        email: this.get('email'),
        firstname: this.get('firstname'),
        lastname: this.get('lastname')
      },
      xhrFields: {
        withCredentials: true
      }
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