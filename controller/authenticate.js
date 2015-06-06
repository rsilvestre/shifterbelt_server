/**
 * Created by michaelsilvestre on 25/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var _modulesMessageJs = require("../modules/message.js");

var _modulesAuthenticationJs = require("../modules/authentication.js");

var _modulesAuthenticationJs2 = _interopRequireDefault(_modulesAuthenticationJs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var authenticateInit = function authenticateInit() {
  var websocketAdapter = _adaptersAbsAdapterJs.adapters.getAdapter("websocket");
  websocketAdapter.connection(function (socket) {
    var device = null;
    console.log("a device is connected");
    socket.auth = false;
    //socket.emit('event', "first message");

    socket.on("authenticate", function (data) {
      var authentication = new _modulesAuthenticationJs2["default"](data);
      authentication.checkAuthToken(function (err, success) {
        if (err) {
          return socket.emit("error", err);
        }
        if (!success) {
          return;
        }
        device = success;
        console.log("Authenticated socket: " + socket.id);
        socket.auth = true;

        _underscore2["default"].each(websocketAdapter.io.nsps, function (nsp) {
          console.log("restoring socket to: " + nsp.name);
          nsp.connected[socket.id] = socket;
        });

        var linkDevice = new _modulesMessageJs.LinkDevice(device, socket, function (err, device, slaves) {
          if (err) {
            return console.warn(err);
          }
          socket.emit("authenticated");
          socket.emit("message", { event: "first server message" });
          socket.emit("service", {
            action: "identification",
            content: { role: device["role"], status: "connected", id: device["macAddress"] },
            time: new Date()
          });
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
          linkDevice.disconnect();
        });
      });
    });

    socket.on("test", function (message) {
      console.log(message);
    });

    setTimeout(function () {
      if (!socket.auth) {
        console.log("Disconnection socket: " + socket.id);
        socket.disconnect("unauthorized");
      }
    }, 1000);

    socket.on("disconnect", function () {
      console.log("a device: " + socket.id + ", is disconnected");
    });
  });
};
exports.authenticateInit = authenticateInit;

//# sourceMappingURL=authenticate.js.map