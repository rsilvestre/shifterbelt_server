/**
 * Created by michaelsilvestre on 19/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _configJs = require("./config.js");

var _configJs2 = _interopRequireDefault(_configJs);

var _adaptersIndexJs = require("../adapters/index.js");

var _adaptersIndexJs2 = _interopRequireDefault(_adaptersIndexJs);

var _libLoggerJs = require("../lib/logger.js");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function getAdapter(name) {
  return _adaptersIndexJs2["default"][name];
}

function dbloader(key) {
  var name = _configJs2["default"].adapters.getAdapter(key);
  return new Promise(function (resolve, reject) {
    new _adaptersIndexJs2["default"][name](resolve);
  });
}

var Bootstrap = (function () {
  function Bootstrap(callback) {
    _classCallCheck(this, Bootstrap);

    // Bootstrap models
    _async2["default"].each(_fs2["default"].readdirSync("" + _configJs2["default"].root + "/models"), function (file, callback) {
      if (/\.js$/.test(file)) {
        require("" + _configJs2["default"].root + "/models/" + file);
      }
      callback();
    }, function (err) {
      if (err) {
        _libLoggerJs.logger.warn(err);
      }
    });
  }

  _createClass(Bootstrap, [{
    key: "run",
    value: function run() {
      var App = require("" + _configJs2["default"].root + "/app.js");
      var p = dbloader("database").then(function () {
        _libLoggerJs.logger.info("database loaded");
        return dbloader("memory");
      }).then(function () {
        _libLoggerJs.logger.info("memory loaded");
        return dbloader("queue");
      }).then(function () {
        _libLoggerJs.logger.info("queue loaded");
        return dbloader("websocket");
      }).then(function () {
        _libLoggerJs.logger.info("websocket loaded");

        var app = new App();
      });
    }
  }]);

  return Bootstrap;
})();

exports["default"] = Bootstrap;
module.exports = exports["default"];

//# sourceMappingURL=bootstrap.js.map