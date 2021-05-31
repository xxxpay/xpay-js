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

  init: function (charge_or_order) {
    var payment;
    if (typeof charge_or_order === 'string') {
      try {
        payment = JSON.parse(charge_or_order);
      } catch (err) {
        callbacks.innerCallback('fail',
          callbacks.error('json_decode_fail', err));
        return;
      }
    } else {
      payment = charge_or_order;
    }

    if (typeof payment === 'undefined') {
      callbacks.innerCallback('fail', callbacks.error('json_decode_fail'));
      return;
    }

    if (hasOwn.call(payment, 'object') && payment.object == 'order') {
      payment.or_id = payment.id;
      payment.order_no = payment.merchant_order_no;
      var charge_essentials = payment.charge_essentials;
      payment.channel = charge_essentials.channel;
      payment.credential = charge_essentials.credential;
      payment.extra = charge_essentials.extra;
      if(hasOwn.call(payment, 'payment') && payment.payment != null) {
        payment.id = payment.payment;
      } else if(hasOwn.call(charge_essentials, 'id')
        && charge_essentials.id != null) {
        payment.id = charge_essentials.id;
      } else if(hasOwn.call(payment, 'charges')) {
        for(var i = 0; i < payment.charges.data.length; i++){
          if(payment.charges.data[i].channel === charge_essentials.channel) {
            payment.id = payment.charges.data[i].id;
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