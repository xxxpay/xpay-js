var utils = require('../utils');

module.exports = {
  handlePayment: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.redirectTo(credential, payment.channel);
  }
};
