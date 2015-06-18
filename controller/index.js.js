/**
 * Created by michaelsilvestre on 25/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _identifyJs = require("./identify.js");

var _authenticateJs = require("./authenticate.js");

var _libLoggerJs = require("../lib/logger.js");

var Controller = (function () {
  function Controller() {
    _classCallCheck(this, Controller);

    (0, _identifyJs.identityInit)();
    (0, _authenticateJs.authenticateInit)();
  }

  _createClass(Controller, [{
    key: "close",
    value: function close(next) {
      _libLoggerJs.logger.info("Controller stop send message by closing websocket");
      (0, _authenticateJs.messageClose)(next);
    }
  }]);

  return Controller;
})();

exports["default"] = Controller;
module.exports = exports["default"];

//# sourceMappingURL=index.js.js.map