var utils = require('../utils');

module.exports = {
  handleCharge: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.redirectTo(credential, payment.channel);
  }
};
