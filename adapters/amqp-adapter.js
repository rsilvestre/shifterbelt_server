/**
 * Created by michaelsilvestre on 20/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _amqplib = require("amqplib");

var _amqplib2 = _interopRequireDefault(_amqplib);

var _when = require("when");

var _when2 = _interopRequireDefault(_when);

var _configConfigJs = require("../config/config.js");

var config = _interopRequireWildcard(_configConfigJs);

var _absAdapterJs = require("./absAdapter.js");

var _absAdapterJs2 = _interopRequireDefault(_absAdapterJs);

var _libLoggerJs = require("../lib/logger.js");

var AmqpAdapter = (function (_AbsAdapter) {
  function AmqpAdapter(callback) {
    var _this = this;

    _classCallCheck(this, AmqpAdapter);

    _get(Object.getPrototypeOf(AmqpAdapter.prototype), "constructor", this).call(this, "queue");

    this._connPub = null;
    this._connSub = null;
    this._chPub = null;
    this._chSub = null;
    this.init(function () {
      callback(_this);
    });
  }

  _inherits(AmqpAdapter, _AbsAdapter);

  _createClass(AmqpAdapter, [{
    key: "init",
    value: function init(callback) {
      var _this2 = this;

      this.createSubChannel(callback, function () {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        _this2.createPubChannel.apply(_this2, arg);
      });
    }
  }, {
    key: "close",
    value: function close(next) {
      var _this3 = this;

      console.log("Got SIGINT.  Press Control-D to exit.");
      _libLoggerJs.logger.info("Got SIGINT.  Press Control-D to exit.");
      console.log("close channel pub");
      _libLoggerJs.logger.info("close channel pub");
      var ok = this._chPub.close();
      ok = ok.then(function (err) {
        if (err) throw err;
        console.log("channel pub closed");
        _libLoggerJs.logger.info("channel pub closed");
        console.log("close channel sub");
        _libLoggerJs.logger.info("close channel sub");
        return _this3._chSub.close();
      });
      ok = ok.then(function (err) {
        if (err) throw err;
        console.log("channel sub closed");
        _libLoggerJs.logger.info("channel sub closed");
        console.log("close connection pub");
        _libLoggerJs.logger.info("close connection pub");
        return _this3._connPub.close();
      });
      ok = ok.then(function (err) {
        if (err) throw err;
        console.log("connection pub closed");
        _libLoggerJs.logger.info("connection pub closed");
        console.log("close connection sub");
        _libLoggerJs.logger.info("close connection sub");
        return _this3._connSub.close();
      });
      ok.then(function (err) {
        if (err) throw err;
        console.log("connection sub closed");
        _libLoggerJs.logger.info("connection sub closed");
        next();
      });
    }
  }, {
    key: "createSubChannel",
    value: function createSubChannel(callback, next) {
      var _this4 = this;

      var amqpConfig = config.adapters.getConfig("queue");
      _amqplib2["default"].connect(amqpConfig.url).then(function (conn) {
        _this4._connSub = conn;
        console.log("amqb sub connected successfull connected");
        _libLoggerJs.logger.info("amqb sub connected successfull connected");
        return conn.createChannel().then(function (ch) {
          _this4._chSub = ch;
          return next(callback);
        });
      }).then(null, console.warn);
    }
  }, {
    key: "createPubChannel",
    value: function createPubChannel(next) {
      var _this5 = this;

      var amqpConfig = config.adapters.getConfig("queue");
      _amqplib2["default"].connect(amqpConfig.url).then(function (conn) {
        _this5._connPub = conn;
        console.log("amqb pub connected successfull connected");
        _libLoggerJs.logger.info("amqb pub connected successfull connected");
        return (0, _when2["default"])(conn.createChannel().then(function (ch) {
          _this5._chPub = ch;
          next();
        }));
      }).then(null, console.warn);
    }
  }, {
    key: "chSub",
    get: function () {
      return this._chSub;
    }
  }, {
    key: "chPub",
    get: function () {
      return this._chPub;
    }
  }]);

  return AmqpAdapter;
})(_absAdapterJs2["default"]);

exports["default"] = AmqpAdapter;
module.exports = exports["default"];

//# sourceMappingURL=amqp-adapter.js.map