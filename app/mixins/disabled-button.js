import Ember from 'ember';

export default Ember.Mixin.create({

  /**
   * Flag to know if we need to force the button to be disabled.
   * @type {Boolean}
   */
  forceButtonDisabled: false,

  /**
   * Check if the button is disabled
   * @return {true/null}
   */
  isButtonDisabled: Ember.computed('validations.isValid', 'forceButtonDisabled', function () {
    if (this.get('validations.isValid') && !this.get('forceButtonDisabled')) {
      return false;
    }

    return true;
  })
});
