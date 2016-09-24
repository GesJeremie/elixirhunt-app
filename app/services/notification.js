import Ember from 'ember';

export default Ember.Service.extend({

  /**
   * Flag to know if a notification is shown
   * @type {Boolean}
   */
  isShown: false,

  /**
   * Display an error notification
   * @param  {String}   message  The message to show
   * @param  {Function} callback Will be called after the notification close
   * @return void
   */
  error: function (message, callback) {
    this._send('error', message, callback);
  },

  /**
   * Display a success notification
   * @param  {String}   message  The message to show
   * @param  {Function} callback Will be called after the notification close
   * @return void
   */
  success: function (message, callback) {
    this._send('success', message, callback);
  },

  _send: function (type, message, callback) {

    if (!this.get('isShown')) {

      this.set('isShown', true);

      noty({
        type: type,
        text: message,
        animation: {
          open: 'animated flipInX',
          close: 'animated flipOutX'
        },
        timeout: 2200,
        maxVisible: 1,
        killer: true,
        callback: {
          afterClose: () => {
            this.set('isShown', false);

            if (Ember.typeOf(callback) === 'function') {
              return callback();
            }
          }
        }

      });
    }
  }
});
