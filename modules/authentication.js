/**
 * Created by michaelsilvestre on 30/05/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _getmac = require("getmac");

var _getmac2 = _interopRequireDefault(_getmac);

var _libLoggerJs = require("../lib/logger.js");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var Application = _mongoose2["default"].model("Application");

var Authentication = (function () {
  function Authentication(data) {
    _classCallCheck(this, Authentication);

    if (!data) {
      return null;
    }
    this._data = JSON.parse(data);
  }

  _createClass(Authentication, [{
    key: "checkAuthToken",
    value: function checkAuthToken(callback) {

      if (!this._data.hasOwnProperty("applicationId")) {
        return callback(new Error("Missing applicationId for the authentification"), null);
      }

      if (!this._data.hasOwnProperty("key")) {
        return callback(new Error("Missing key for the authentification"), null);
      }

      if (!this._data.hasOwnProperty("password")) {
        return callback(new Error("Missing password for the authentification"), null);
      }

      if (!this._data.hasOwnProperty("macAddress")) {
        return callback(new Error("Missing macAddress for the authentification"), null);
      }

      if (!_underscore2["default"].isString(this._data["key"])) {
        return callback(new Error("Key should be a string"), null);
      }

      if (this._data["key"].length !== 40) {
        return callback(new Error("Key has not the good size"), null);
      }

      if (!_underscore2["default"].isString(this._data["password"])) {
        return callback(new Error("Password should be a string"), null);
      }

      if (this._data["password"].length !== 80) {
        return callback(new Error("Password has not the good size"), null);
      }

      if (!_underscore2["default"].isNumber(this._data["applicationId"])) {
        return callback(new Error("ApplicationId should be a number"), null);
      }

      if (!_getmac2["default"].isMac(this._data["macAddress"])) {
        return callback(new Error("The mac address is not correctly formated"), null);
      }

      Application.authenticate(this._data, function (err, result) {
        if (err) {
          return callback(err, null);
        }
        if (!result) {
          return callback(new Error("The applicationId are not correct"), null);
        }
        if (null === result.device.role || result.device.role.length === 0 || result.device.role === "") {
          return callback(new Error("The key and password are not correct"), null);
        }
        _libLoggerJs.logger.info(result);
        return callback(null, result);
      });
    }
  }]);

  return Authentication;
})();

exports["default"] = Authentication;
module.exports = exports["default"];

//# sourceMappingURL=authentication.js.map