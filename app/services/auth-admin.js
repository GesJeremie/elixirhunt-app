import Ember from 'ember';
import config from 'elixirhunt/config/environment';

export default Ember.Service.extend({

  /**
   * authenticate - Authenticate the admin
   *
   * @param  {string} password Password of the admin
   * @return {defered}
   */
  authenticate(password) {
    return Ember.$.ajax({
      method: 'POST',
      url: config.auth.admin.authenticateEndpoint,
      data: {
        password: password
      }
    });
  },


  /**
   * revoke - Delete the session of the admin
   *
   * @return {defered}
   */
  revoke() {
    return Ember.$.ajax({
      method: 'GET',
      url: config.auth.admin.revokeEndpoint,
    });
  },


  /**
   * isAuthenticated - Check if authenticated
   *
   * @return {promise}
   */
  isAuthenticated() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
          method: 'GET',
          url: config.auth.admin.isAuthenticatedEndpoint,
        })
        .then((response) => {
          if (response.connected) {
            resolve();
          } else {
            reject();
          }
        }, () => {
          reject();
        });
    });
  }

});
