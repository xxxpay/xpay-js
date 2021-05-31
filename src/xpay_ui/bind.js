/**
 * Created by dong on 2016/11/14.
 */
var stash = require('../stash');
var utils = require('./utils');
var commUtils = require('../utils');
var xpay = require('../main');
var collection = require('../collection');

module.exports = {

  buttonClickable: true,
  maskClickable: true,
  moveFlag: false,
  payment: {},

  init: function () {
    var _this = this;
    var ul = document.getElementById('p_one_channelList');
    ul.addEventListener('click', function (e) {
      e = e || event;
      e.preventDefault();
      if (!_this.buttonClickable) {
        return;
      }

      _this.buttonClickable = false;
      var target = e.target;
      var channel = target.getAttribute('p_one_channel');

      if (channel == null) {
        channel = target.parentNode.getAttribute('p_one_channel');
      }
      if (channel == null) {
        channel = target.parentNode.parentNode.getAttribute('p_one_channel');
      }

      if(!stash.userData.payment_url) {
        stash.userCallback(channel);
        utils.close();
        return;
      }

      utils.showLoading();
      var postData = {};
      postData.channel = channel;
      postData.order_no = stash.userData.order_no;
      postData.amount = stash.userData.amount;
      if (channel == 'wx_pub') {
        postData.open_id = stash.userData.open_id;
      }

      if (stash.userData.payment_param) {
        var payment_param = stash.userData.payment_param;
        for (var i in payment_param) {
          postData[i] = payment_param[i];
        }
      }

      commUtils.request(stash.userData.payment_url,
        'POST', postData, function (res, code) {
          utils.hideLoading();
          if (code == 200) {
            _this.payment = res;

            try{
              var json = JSON.parse(res);
              localStorage.setItem('xpay_app_id', json.app);
              localStorage.setItem('xpay_ch_id', json.id);
              localStorage.setItem('xpay_amount', json.amount);
              localStorage.setItem('xpay_subject', json.subject);
              localStorage.setItem('xpay_channel', json.channel);
            } catch (e){ /* empty */ }

            if (stash.isDebugMode) {//debug模式下暂停，调用resume之后继续
              _this.buttonClickable = true;

              stash.payment = res;
              stash.channel = channel;

              stash.userCallback({
                status: true,
                msg: 'payment success',
                debug: stash.isDebugMode,
                paymentUrlOutput: res
              });
              return;
            }
            stash.type = 'payment_success';
            xpay.createPayment(res, _this.callbackPayment);
          } else {
            utils.hideLoading();
            utils.close();
            collection.report({type:'payment_fail',channel:channel});
            stash.userCallback({
              status: false,
              msg: 'network error',
              debug: stash.isDebugMode
            });
          }
        });

      if (!stash.isDebugMode) {
        collection.report({type:'click',channel:channel});
      }
    });

    //点mask的时候收起来
    document.addEventListener('dbclick', function () {
      return false;
    });
    document.ontouchmove = function () {
      _this.moveFlag = true;
    };
    document.ontouchend = function () {
      _this.moveFlag = false;
    };
    //如果触发了touchstart的时候触发了touchmove就不关
    var p_one_mask = document.getElementById('p_one_mask');
    p_one_mask.addEventListener('touchstart', function () {

    });
    var touch_click = ('ontouchend' in document) ? 'touchend' : 'click';
    p_one_mask.addEventListener(touch_click, function () {
      if (!_this.maskClickable) {
        return;
      }
      _this.buttonClickable = true;
      if (!_this.moveFlag) {
        utils.close();
        _this.moveFlag = true;
        _this.maskClickable = false;
      }
    });
  },

  callbackPayment: function (result, err) {
    var _this = this;
    utils.close();
    if (result == 'fail') {
      stash.userCallback({
        status: false,
        msg: err.msg,
        debug: stash.isDebugMode,
        paymentUrlOutput: _this.payment
      });
    } else if (result == 'cancel') {  // 微信公众账号支付取消支付
      stash.userCallback({
        status: false,
        msg: 'cancel',
        debug: stash.isDebugMode,
        paymentUrlOutput: _this.payment
      });
    } else if (result == 'success') { // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
      stash.userCallback({
        status: true,
        msg: result,
        wxSuccess: true,
        debug: stash.isDebugMode,
        paymentUrlOutput: _this.payment
      });
    }
  }
};
