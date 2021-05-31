var utils = require('../utils');

module.exports = {

  UPACP_PC_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',

  handlePayment: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.formSubmit(this.UPACP_PC_URL, 'post', credential);
  }
};
