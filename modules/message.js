/**
 * Created by michaelsilvestre on 19/05/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var _modulesQueueJs = require("../modules/queue.js");

var _modulesQueueJs2 = _interopRequireDefault(_modulesQueueJs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var masters = {};
var managers = {};
var slaves = {};

var LinkDevice = (function () {
  /**
   *
   * @param {{}} data
   * @param {socket.io} socket
   * @param {Function} callback
   */

  function LinkDevice(data, socket, callback) {
    _classCallCheck(this, LinkDevice);

    this._queue = new _modulesQueueJs2["default"](_adaptersAbsAdapterJs.adapters.getAdapter("queue"), data["application"]["businessId"]);
    this._socket = socket;
    this._data = data;
    this._send = null;
    var action = "register" + data["device"]["role"].charAt(0).toUpperCase() + "" + data["device"]["role"].slice(1);
    console.log("action: " + action);

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    try {
      this[action](data, socket, callback);
    } catch (e) {
      console.warn(new Error("The property: " + action + ", not exist: " + e));
    }
  }

  _createClass(LinkDevice, [{
    key: "createIfNotExistListDevices",

    /**
     *
     * @param {Object} list
     * @param {{}} data
     * @param {Function} next
     */
    value: function createIfNotExistListDevices(list, data, next) {
      if (!list.hasOwnProperty(data["application"]["businessId"])) {
        list[data["application"]["businessId"].toString()] = {};
        return next();
      }
      if (list[data["application"]["businessId"]].hasOwnProperty(data["device"]["macAddress"])) {
        return next(new Error("The queue: " + data["device"]["role"] + ", still contain a key: " + data["device"]["macAddress"]));
      }
      next();
    }
  }, {
    key: "createFakeList",

    /**
     *
     * @param {{}} data
     * @returns {{}}
     */
    value: function createFakeList(data) {
      var fakeList = {};
      fakeList["" + data["application"]["businessId"]] = {};
      fakeList["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = this;

      return fakeList;
    }
  }, {
    key: "registerMaster",

    /**
     *
     * @param {{}} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerMaster(data, socket, next) {
      var _this = this;

      this.createIfNotExistListDevices(masters, data, function (err) {
        if (err) {
          return next(err);
        }

        masters["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this;

        _this.createSubQueue("pubsub", data["application"]["businessId"], _this.createFakeList(data), function () {
          console.log("" + data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + data["application"]["businessId"]);
          _this._queue.registerSelectorQueue("topic", function (callback) {
            _this._send = callback;
            socket.on("message", function (chunk) {
              var _JSON$parse = JSON.parse(chunk);

              var key = _JSON$parse.key;
              var message = _JSON$parse.message;

              if (message) {
                return callback(message, key);
              }
              return callback(chunk);
            });
            next(null, data["device"], slaves["" + data["application"]["businessId"]] || {});
          });
        });
      });
    }
  }, {
    key: "registerManager",

    /**
     *
     * @param {{}} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerManager(data, socket, next) {
      var _this2 = this;

      this.createIfNotExistListDevices(managers, data, function (err) {
        if (err) {
          return next(err);
        }
        managers["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this2;
      });
    }
  }, {
    key: "registerSlave",

    /**
     *
     * @param {{}} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerSlave(data, socket, next) {
      var _this3 = this;

      this.createIfNotExistListDevices(slaves, data, function (err) {
        if (err) {
          return next(err);
        }

        slaves["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this3;

        _this3.createTopicQueue("topic", data["application"]["businessId"], data["device"]["macAddress"], _this3.createFakeList(data), function () {
          console.log("" + data["device"]["macAddress"] + " has been added to the Topic queue of the essaim " + data["application"]["businessId"]);
          _this3._queue.registerPubQueue("pubsub", function (callback) {
            _this3._send = callback;
            callback(JSON.stringify({
              type: "service", message: {
                action: "connection",
                content: { role: "slave", status: "connected", id: data["device"]["macAddress"] },
                time: new Date()
              }
            }));
            socket.on("message", function (message) {
              var messageObj = JSON.parse(message);
              messageObj.slaveId = data["device"]["macAddress"];
              callback(JSON.stringify(messageObj));
            });
            next(null, data["device"]);
          });
        });
      });
    }
  }, {
    key: "createSubQueue",

    /**
     *
     * @param {String} queue
     * @param {String} essaim
     * @param {{}} list
     * @param {Function} next
     */
    value: function createSubQueue(queue, essaim, list, next) {
      var _this4 = this;

      var keys = Object.keys(list[essaim] || {}),
          numKey = keys.length;

      if (keys.length < 1) {
        return next();
      }

      keys.forEach(function (key) {
        _this4._queue.registerSubQueue(queue, function (message) {
          console.log("subQueue message: " + message.content.toString());

          var _JSON$parse2 = JSON.parse(message.content.toString());

          var type = _JSON$parse2.type;
          var msg = _JSON$parse2.message;

          if (!type) {
            return list[essaim][key].socket.emit("message", message);
          }
          list[essaim][key].socket.emit(type, msg);
        }, function () {
          if (--numKey === 0) {
            next();
          }
        });
      });
    }
  }, {
    key: "createTopicQueue",

    /**
     *
     * @param {string} queue
     * @param {String} essaim
     * @param {String} deviceId
     * @param {{}} list
     * @param {Function} next
     */
    value: function createTopicQueue(queue, essaim, deviceId, list, next) {
      var _this5 = this;

      var keys = Object.keys(list[essaim] || {}),
          numKey = keys.length;

      if (keys.length < 1) {
        return next();
      }

      keys.forEach(function (key) {
        _this5._queue.registerTopicQueue(queue, ["broadcast", deviceId], function (message) {
          console.log("topicQueue message: " + message.content.toString());
          list[essaim][key].socket.emit("message", message);
        }, function () {
          if (--numKey === 0) {
            next();
          }
        });
      });
    }
  }, {
    key: "socket",

    /**
     *
     * @returns {*|LinkDevice.socket}
     */
    get: function () {
      return this._socket;
    }
  }, {
    key: "disconnect",

    /**
     *
     * @param {*|Function} done
     */
    value: function disconnect(done) {
      var action = "disconnectFrom" + this._data["device"]["role"].charAt(0).toUpperCase() + "" + this._data["device"]["role"].slice(1);
      console.log("action: " + action);

      //if (!this.hasOwnProperty(action)) {
      //  throw new Error(`The property: ${action}, not exist`);
      //}
      try {
        this[action](done);
      } catch (e) {
        console.warn(new Error("The property: " + action + ", not exist: " + e));
      }
    }
  }, {
    key: "deleteDevice",

    /**
     *
     * @param {{}} list
     * @param {Function} done
     * @returns {*}
     */
    value: function deleteDevice(list, done) {
      done = "function" === typeof done ? done : function (value) {
        return value;
      };
      if (!list[this._data["application"]["businessId"]] || !list[this._data["application"]["businessId"]][this._data["device"]["macAddress"]]) {
        return done(new Error("Nothing to do"));
      }
      delete list[this._data["application"]["businessId"]][this._data["device"]["macAddress"]];
      console.log("device: " + [this._data["device"]["macAddress"]] + ", has been removed from: " + this._data["application"]["businessId"]);
      return done();
    }
  }, {
    key: "disconnectFromMaster",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromMaster(done) {
      var _this6 = this;

      this._queue.close("pubsub", "", function () {
        console.log("queue for master: " + _this6._data["device"]["macAddress"] + ", has been unbinded");
        _this6.deleteDevice(masters, done);
      });
    }
  }, {
    key: "disconnectFromManager",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromManager(done) {
      var _this7 = this;

      this._queue.close("pubsub", this._data["device"]["macAddress"], function () {
        console.log("queue for manager: " + _this7._data["device"]["macAddress"] + ", has been unbinded");
        _this7.deleteDevice(managers, done);
      });
    }
  }, {
    key: "disconnectFromSlave",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromSlave(done) {
      var _this8 = this;

      var beforeClose = function beforeClose() {
        console.log("queue for slave " + _this8._data["device"]["macAddress"] + ", has been removed from masters and managers");
        _this8._queue.close("topic", _this8._data["device"]["macAddress"], function () {
          console.log("queue for slave: " + _this8._data["device"]["macAddress"] + ", has been unbinded");
          _this8.deleteDevice(slaves, done);
        });
      };

      var timeout = 20,
          interval = setInterval(function () {

        console.log("click");

        if (_this8._send) {
          stopFunction();
          _this8._send(JSON.stringify({
            type: "service", message: {
              action: "slaveDisconnected",
              content: { role: "slave", status: "disconnected", id: _this8._data["device"]["macAddress"] },
              time: new Date()
            }
          }), beforeClose);
        }
        if (--timeout < 1) {
          stopFunction();
          return next();
        }
      }, 1000);

      function stopFunction() {
        clearInterval(interval);
      }
    }
  }]);

  return LinkDevice;
})();

exports.LinkDevice = LinkDevice;

//# sourceMappingURL=message.js.map