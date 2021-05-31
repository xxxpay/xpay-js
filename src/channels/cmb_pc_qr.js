var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(payment) {
    var channel = payment.channel;
    var credential = payment.credential[channel];
    var baseURL;
    if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
      delete credential.channel_url;
    }

    utils.formSubmit(baseURL, 'post', credential);
  }
};
