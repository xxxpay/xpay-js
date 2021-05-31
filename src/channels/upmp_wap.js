var utils = require('../utils');

module.exports = {

  UPMP_WAP_URL: 'uppay://uppayservice/?style=token&paydata=',

  handleCharge: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.redirectTo(this.UPMP_WAP_URL + credential.paydata, payment.channel);
  }
};
