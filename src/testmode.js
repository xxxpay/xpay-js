var utils = require('./utils');
var hasOwn = {}.hasOwnProperty;
module.exports = {
  XPAY_MOCK_URL: 'http://sissi.mofanbaby.com/mock.php',

  runTestMode: function (payment) {
    var params = {
      'ch_id': payment.id,
      'scheme': 'http',
      'channel': payment.channel
    };

    if (hasOwn.call(payment, 'order_no')) {
      params.order_no = payment.order_no;
    } else if (hasOwn.call(payment, 'orderNo')) {
      params.order_no = payment.orderNo;
    }
    if (hasOwn.call(payment, 'time_expire')) {
      params.time_expire = payment.time_expire;
    } else if (hasOwn.call(payment, 'timeExpire')) {
      params.time_expire = payment.timeExpire;
    }
    if (hasOwn.call(payment, 'extra')) {
      params.extra = encodeURIComponent(JSON.stringify(payment.extra));
    }
    utils.redirectTo(
      this.XPAY_MOCK_URL + '?' + utils.stringifyData(params),
      payment.channel
    );
  }
};
