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

var _nodeLogentries = require("node-logentries");

var _nodeLogentries2 = _interopRequireDefault(_nodeLogentries);

var _configConfig = require("../config/config");

var _configConfig2 = _interopRequireDefault(_configConfig);

var log = null;

exports.log = log;
var logger = {
  error: function error(value) {
    if (log instanceof Logger) {
      log.error = value;
    }
  },
  debug: function debug(value) {
    if (log instanceof Logger) {
      log.debug = value;
    }
  },
  notice: function notice(value) {
    if (log instanceof Logger) {
      log.notice = value;
    }
  },
  warn: function warn(value) {
    if (log instanceof Logger) {
      log.warning = value;
    }
  },
  info: function info(value) {
    if (log instanceof Logger) {
      log.info = value;
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
      //log = new Log(logLevel, fs.createWriteStream(`${appRootPath}/log/${logFile}`));
      this._log = _nodeLogentries2["default"].logger({
        token: _configConfig2["default"].logentries_token
      });
      exports.log = log = this;
    }
  }, {
    key: "error",
    set: function (value) {
      console.error(value);
      this._log.error(value);
    }
  }, {
    key: "debug",
    set: function (value) {
      console.log(value);
      this._log.debug(value);
    }
  }, {
    key: "warning",
    set: function (value) {
      console.warn(value);
      this._log.warning(value);
    }
  }, {
    key: "notice",
    set: function (value) {
      console.log(value);
      this._log.notice(value);
    }
  }, {
    key: "info",
    set: function (value) {
      console.info(value);
      this._log.info(value);
    }
  }]);

  return Logger;
})();

exports["default"] = Logger;

//# sourceMappingURL=logger.js.map