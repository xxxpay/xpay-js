var utils = require('../utils');

module.exports = {

  UPACP_WAP_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',

  handleCharge: function(payment) {
    var credential = payment.credential[payment.channel];
    utils.formSubmit(this.UPACP_WAP_URL, 'post', credential);
  }
};
