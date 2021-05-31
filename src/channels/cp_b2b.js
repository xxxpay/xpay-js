var utils = require('../utils');

module.exports = {

  CP_B2B_URL: 'https://payment.chinapay.com/CTITS/service/rest/page/nref/000000000017/0/0/0/0/0',

  handleCharge: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.formSubmit(this.CP_B2B_URL, 'post', credential);
  }
};
