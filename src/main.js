var version = require('./version').v;
var hasOwn = {}.hasOwnProperty;

var XPaySDK = function () {
  require('./init').init();
};

XPaySDK.prototype.version = version;

module.exports = new XPaySDK();

var testmode = require('./testmode');
var callbacks = require('./callbacks');
var mods = require('./mods');
var stash = require('./stash');
var dc = require('./collection');
var payment_elements = require('./payment_elements');

XPaySDK.prototype.createPayment = function (
  paymentJSON, callback, signature, debug
) {
  if (typeof callback === 'function') {
    callbacks.userCallback = callback;
  }

  payment_elements.init(paymentJSON);

  if (!hasOwn.call(payment_elements, 'id')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_payment', 'no_payment_id'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'channel')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_payment', 'no_channel'));
    return;
  }

  if (hasOwn.call(payment_elements, 'app')) {
    if (typeof payment_elements.app === 'string') {
      stash.app_id = payment_elements.app;
    } else if (typeof payment_elements.app === 'object' &&
      typeof payment_elements.app.id === 'string') {
      stash.app_id = payment_elements.app.id;
    }
  }
  dc.report({
    type: stash.type || 'pure_sdk_click',
    channel: payment_elements.channel,
    ch_id: payment_elements.id
  });
  var channel = payment_elements.channel;
  if (!hasOwn.call(payment_elements, 'credential')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_payment', 'no_credential'));
    return;
  }
  if (!payment_elements.credential) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_undefined'));
    return;
  }
  if (!hasOwn.call(payment_elements.credential, channel)) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_incorrect'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'livemode')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_payment', 'no_livemode_field'));
    return;
  }
  var channelModule = mods.getChannelModule(channel);
  if (typeof channelModule === 'undefined') {
    console.error('channel module "' + channel + '" is undefined');
    callbacks.innerCallback('fail',
      callbacks.error('invalid_channel',
        'channel module "' + channel + '" is undefined')
    );
    return;
  }
  if (payment_elements.livemode === false) {
    if (hasOwn.call(channelModule, 'runTestMode')) {
      channelModule.runTestMode(payment_elements);
    } else {
      testmode.runTestMode(payment_elements);
    }
    return;
  }

  if (typeof signature != 'undefined') {
    stash.signature = signature;
  }
  if (typeof debug == 'boolean') {
    stash.debug = debug;
  }
  channelModule.handlePayment(payment_elements);
};

XPaySDK.prototype.setAPURL = function (url) {
  stash.APURL = url;
};

XPaySDK.prototype.setUrlReturnCallback = function (callback, channels) {
  if (typeof callback === 'function') {
    callbacks.urlReturnCallback = callback;
  } else {
    throw 'callback need to be a function';
  }

  if (typeof channels !== 'undefined') {
    if (Array.isArray(channels)) {
      callbacks.urlReturnChannels = channels;
    } else {
      throw 'channels need to be an array';
    }
  }
};
