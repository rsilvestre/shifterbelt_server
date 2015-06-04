/**
 * Created by michaelsilvestre on 22/04/15
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

var _socketIo = require("socket.io");

var _socketIo2 = _interopRequireDefault(_socketIo);

var _socketIoRedis = require("socket.io-redis");

var _socketIoRedis2 = _interopRequireDefault(_socketIoRedis);

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

var _configConfigJs = require("../config/config.js");

var config = _interopRequireWildcard(_configConfigJs);

var _absAdapterJs = require("./absAdapter.js");

var _absAdapterJs2 = _interopRequireDefault(_absAdapterJs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var WebsocketAdapter = (function (_AbsAdapter) {
  function WebsocketAdapter(server, callback) {
    _classCallCheck(this, WebsocketAdapter);

    _get(Object.getPrototypeOf(WebsocketAdapter.prototype), "constructor", this).call(this, "websocket");
    this._server = server;

    this.init(callback);
  }

  _inherits(WebsocketAdapter, _AbsAdapter);

  _createClass(WebsocketAdapter, [{
    key: "init",
    value: function init(callback) {
      var websocketConfig = config.adapters.getConfig("websocket");
      //let redisConfig = config.adapters.getConfig("memory");

      //let pub = redis.createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password });
      //let sub = redis.createClient(redisConfig.port, redisConfig.host, { detect_buffers: true, auth_pass: redisConfig.password });

      //io.adapter(socketRedis({ pubClient: pub, subClient: sub }));

      this._io = _socketIo2["default"].listen(this._server);
      _underscore2["default"].each(this._io.nsps, function (nsp) {
        nsp.on("connection", function (socket) {
          if (socket.auth) {
            console.log("removing socket from: " + nsp.name);
            delete nsp.connected[socket.id];
          }
        });
      });
      this._nsp = this._io.of(websocketConfig.namespace);
      console.log("socket.io successfull connected");
      callback(this);
    }
  }, {
    key: "io",
    get: function () {
      return this._io;
    }
  }, {
    key: "nsp",
    get: function () {
      return this._nsp;
    }
  }, {
    key: "connection",
    value: function connection(callback) {
      this._nsp.on("connection", callback);
    }
  }]);

  return WebsocketAdapter;
})(_absAdapterJs2["default"]);

exports["default"] = WebsocketAdapter;
module.exports = exports["default"];

//# sourceMappingURL=websocket-adapter.js.map