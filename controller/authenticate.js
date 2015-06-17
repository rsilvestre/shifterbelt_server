/**
 * Created by michaelsilvestre on 25/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var _modulesMessageJs = require("../modules/message.js");

var _modulesAuthenticationJs = require("../modules/authentication.js");

var _modulesAuthenticationJs2 = _interopRequireDefault(_modulesAuthenticationJs);

var _libLoggerJs = require("../lib/logger.js");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var ArrayStuff = (function (_Array) {
  function ArrayStuff() {
    _classCallCheck(this, ArrayStuff);

    _get(Object.getPrototypeOf(ArrayStuff.prototype), "constructor", this).call(this);
  }

  _inherits(ArrayStuff, _Array);

  _createClass(ArrayStuff, [{
    key: "inArray",

    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    value: function inArray(comparer) {
      return !!this.filter(function (value) {
        comparer(value);
      }).length;
    }
  }, {
    key: "pushIfNotExist",

    // adds an element to the array if it does not already exist using a comparer
    // function
    value: function pushIfNotExist(element, comparer) {
      if (!this.inArray(comparer)) {
        this.push(element);
        return true;
      }
      return false;
    }
  }]);

  return ArrayStuff;
})(Array);

var authenticateInit = function authenticateInit() {
  var socketList = new ArrayStuff();
  var websocketAdapter = _adaptersAbsAdapterJs.adapters.getAdapter("websocket");

  websocketAdapter.connection(function (socket) {
    var device = null;
    console.log("a device is connected");
    _libLoggerJs.logger.info("a device is connected");
    socket.auth = false;
    //socket.emit('event', "first message");

    socket.on("authenticate", function (data) {
      var authentication = new _modulesAuthenticationJs2["default"](data);
      authentication.checkAuthToken(function (err, success) {
        if (err) {
          return socket.emit("error_system", err.message);
        }
        if (!success) {
          return;
        }
        device = success;
        console.log("Authenticated socket: " + socket.id);
        _libLoggerJs.logger.info("Authenticated socket: " + socket.id);
        socket.auth = true;

        _underscore2["default"].each(websocketAdapter.io.nsps, function (nsp) {
          console.log("restoring socket to: " + nsp.name);
          _libLoggerJs.logger.info("restoring socket to: " + nsp.name);
          nsp.connected[socket.id] = socket;
        });

        if (!socketList.pushIfNotExist(socket.id, function (value) {
          return value === socket.id;
        })) {
          return socket.close();
        }

        var linkDevice = new _modulesMessageJs.LinkDevice(device, socket, function (err, device, slaves) {
          if (err) {
            return console.warn(err);
          }
          socket.emit("authenticated");
          socket.emit("service", {
            action: "identification",
            content: { role: device["role"], status: "connected", id: device["macAddress"] },
            time: new Date()
          });
          socket.emit("message", { event: "first server message" });
          if (slaves) {
            socket.emit("service", {
              action: "slaveList",
              content: Object.keys(slaves).map(function (value) {
                return { role: "slave", status: "connected", id: value };
              }),
              time: new Date()
            });
          }
        });
        socket.on("disconnect", function () {
          linkDevice.disconnect(function (err) {
            if (err) {
              console.log(err.message);
              return _libLoggerJs.logger.info(err.message);
            }
            console.log("device disconnected, can be unlocked");
            _libLoggerJs.logger.info("device disconnected, can be unlocked");
          });
        });
      });
    });

    socket.on("test", function (message) {
      console.log(message);
      _libLoggerJs.logger.info(message);
    });

    setTimeout(function () {
      if (!socket.auth) {
        console.log("Disconnection socket: " + socket.id);
        _libLoggerJs.logger.info("Disconnection socket: " + socket.id);
        socket.disconnect("unauthorized");
      }
    }, 5000);

    socket.on("disconnect", function () {
      console.log("a device: " + socket.id + ", is disconnected");
      _libLoggerJs.logger.info("a device: " + socket.id + ", is disconnected");
    });
  });
};
exports.authenticateInit = authenticateInit;

//# sourceMappingURL=authenticate.js.map