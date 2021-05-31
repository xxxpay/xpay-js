var utils = require('../utils');
var callbacks = require('../callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(payment) {
    var channel = payment.channel;
    var credential = payment.credential[channel];

    if (!hasOwn.call(credential, 'url')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_field:url'));
      return;
    }
    utils.redirectTo(credential.url + '?' +
      utils.stringifyData(credential, channel), channel);
  }
};
