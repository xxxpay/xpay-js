/**
 * Created by dong on 2016/12/30.
 */

var callbacks = require('./callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  id: null,
  or_id: null,
  channel: null,
  app: null,
  credential: {},
  extra: null,
  livemode: null,
  order_no: null,
  time_expire: null,

  init: function (payment_or_order) {
    var payment;
    if (typeof payment_or_order === 'string') {
      try {
        payment = JSON.parse(payment_or_order);
      } catch (err) {
        callbacks.innerCallback('fail',
          callbacks.error('json_decode_fail', err));
        return;
      }
    } else {
      payment = payment_or_order;
    }

    if (typeof payment === 'undefined') {
      callbacks.innerCallback('fail', callbacks.error('json_decode_fail'));
      return;
    }

    if (hasOwn.call(payment, 'object') && payment.object == 'order') {
      payment.or_id = payment.id;
      payment.order_no = payment.merchant_order_no;
      var payment_essentials = payment.payment_essentials;
      payment.channel = payment_essentials.channel;
      payment.credential = payment_essentials.credential;
      payment.extra = payment_essentials.extra;
      if(hasOwn.call(payment, 'payment') && payment.payment != null) {
        payment.id = payment.payment;
      } else if(hasOwn.call(payment_essentials, 'id')
        && payment_essentials.id != null) {
        payment.id = payment_essentials.id;
      } else if(hasOwn.call(payment, 'payments')) {
        for(var i = 0; i < payment.payments.data.length; i++){
          if(payment.payments.data[i].channel === payment_essentials.channel) {
            payment.id = payment.payments.data[i].id;
            break;
          }
        }
      }
    } else if(hasOwn.call(payment, 'object') && payment.object == 'recharge') {
      payment = payment.payment;
    }

    for (var key in this) {
      if (hasOwn.call(payment, key)) {
        this[key] = payment[key];
      }
    }
    return this;
  },

  clear: function () {
    for (var key in this) {
      if (typeof this[key] !== 'function') {
        this[key] = null;
      }
    }
  }
};