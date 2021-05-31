var redirectBase = require('./commons/redirect_base');

module.exports = {

  handleCharge: function(payment) {
    redirectBase.handleCharge(payment);
  }
};
