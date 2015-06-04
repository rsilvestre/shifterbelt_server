/**
 * Created by michaelsilvestre on 20/04/15
 */

/**
 * 0 EMERGENCY system is unusable
 * 1 ALERT action must be taken immediately
 * 2 CRITICAL the system is in critical condition
 * 3 ERROR error condition
 * 4 WARNING warning condition
 * 5 NOTICE a normal but significant condition
 * 6 INFO a purely informational message
 * 7 DEBUG messages to debug an application
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _log = require("log");

var _log2 = _interopRequireDefault(_log);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _appRootPath = require("app-root-path");

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var log = null;

exports.log = log;
var logger = {
  error: function error(value) {
    if (log instanceof Logger) {
      log.error(value);
    }
  },
  debug: function debug(value) {
    if (log instanceof Logger) {
      log.debug(value);
    }
  },
  info: function info(value) {
    if (log instanceof Logger) {
      log.info(value);
    }
  }
};

exports.logger = logger;

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, [{
    key: "init",
    value: function init(logLevel, logFile) {
      if (["error", "debug", "info"].indexOf(logLevel) == -1) {
        return new Error("The log level: " + logLevel + ", not exist");
      }
      exports.log = log = new _log2["default"](logLevel, _fs2["default"].createWriteStream("" + _appRootPath2["default"] + "/log/" + logFile));
    }
  }, {
    key: "error",
    set: function (value) {
      log.error(value);
    }
  }, {
    key: "debug",
    set: function (value) {
      log.debug(value);
    }
  }, {
    key: "info",
    set: function (value) {
      log.info(value);
    }
  }]);

  return Logger;
})();

exports["default"] = Logger;

//# sourceMappingURL=logger.js.map