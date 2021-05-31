var utils = require('../utils');
var callbacks = require('../callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(payment) {
    var credential = payment.credential[payment.channel];
    if (typeof credential === 'string') {
      utils.redirectTo(credential, payment.channel);
    } else if (typeof credential === 'object'
      && hasOwn.call(credential, 'url')
    ) {
      utils.redirectTo(credential.url, payment.channel);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'credential 格式不正确'));
    }
  }
};
