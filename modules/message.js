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

var _libLoggerJs = require("../lib/logger.js");

var devicesContainer = {
  masters: {},
  managers: {},
  slaves: {}
};

var LinkDevice = (function () {
  /**
   *
   * @param {Object} data
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
    _libLoggerJs.logger.info("action: " + action);

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
     * @param {Object} data
     * @param {Function} next
     */
    value: function createIfNotExistListDevices(data, next) {
      if (!devicesContainer.hasOwnProperty("" + data.device.role + "s")) {
        return next(new Error("The container don't contain a object: " + data.device.role + "s"));
      }
      if (!devicesContainer["" + data.device.role + "s"].hasOwnProperty("" + data["application"]["businessId"])) {
        devicesContainer["" + data.device.role + "s"]["" + data["application"]["businessId"]] = {};
        return next();
      }
      if (devicesContainer["" + data.device.role + "s"][data["application"]["businessId"]].hasOwnProperty(data["device"]["macAddress"])) {
        return next(new Error("The queue: " + data["device"]["role"] + ", still contain a key: " + data["device"]["macAddress"]));
      }
      next();
    }
  }, {
    key: "createFakeList",

    /**
     *
     * @param {Object} data
     * @returns {Object}
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
     * @param {Object} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerMaster(data, socket, next) {
      var _this = this;

      this.createIfNotExistListDevices(data, function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.masters["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this;

        _this.createSubQueue("pubsub", data["application"]["businessId"], _this.createFakeList(data), function () {
          console.log("" + data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + data["application"]["businessId"]);
          _libLoggerJs.logger.info("" + data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + data["application"]["businessId"]);
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
            next(null, data["device"], devicesContainer.slaves["" + data["application"]["businessId"]] || {});
          });
        });
      });
    }
  }, {
    key: "registerManager",

    /**
     *
     * @param {Object} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerManager(data, socket, next) {
      var _this2 = this;

      this.createIfNotExistListDevices(data, function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.managers["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this2;

        _this2.createSubQueue("pubsub", data["application"]["businessId"], _this2.createFakeList(data), function () {
          console.log("" + data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + data["application"]["businessId"]);
          _libLoggerJs.logger.info("" + data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + data["application"]["businessId"]);
          _this2._queue.registerSelectorQueue("topic", function (callback) {
            _this2._send = callback;
            socket.on("message", function (chunk) {
              var _JSON$parse2 = JSON.parse(chunk);

              var key = _JSON$parse2.key;
              var message = _JSON$parse2.message;

              if (message) {
                return callback(message, key);
              }
              return callback(chunk);
            });
            next(null, data["device"], devicesContainer.slaves["" + data["application"]["businessId"]] || {});
          });
        });
      });
    }
  }, {
    key: "registerSlave",

    /**
     *
     * @param {Object} data
     * @param {socket.io} socket
     * @param {Function} next
     */
    value: function registerSlave(data, socket, next) {
      var _this3 = this;

      this.createIfNotExistListDevices(data, function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.slaves["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = _this3;

        _this3.createTopicQueue("topic", data["application"]["businessId"], data["device"]["macAddress"], _this3.createFakeList(data), function () {
          console.log("" + data["device"]["macAddress"] + " has been added to the Topic queue of the essaim " + data["application"]["businessId"]);
          _libLoggerJs.logger.info("" + data["device"]["macAddress"] + " has been added to the Topic queue of the essaim " + data["application"]["businessId"]);
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
     * @param {Object} list
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
          if (!message) {
            return;
          }
          console.log("subQueue message: " + message.content.toString());
          _libLoggerJs.logger.info("subQueue message: " + message.content.toString());

          var _JSON$parse3 = JSON.parse(message.content.toString());

          var type = _JSON$parse3.type;
          var msg = _JSON$parse3.message;

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
     * @param {Object} list
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
          if (!message) {
            return;
          }
          console.log("topicQueue message: " + message.content.toString());
          _libLoggerJs.logger.info("topicQueue message: " + message.content.toString());
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
      _libLoggerJs.logger.info("action: " + action);

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
     * @param {Function} done
     * @returns {*}
     */
    value: function deleteDevice(done) {
      done = "function" === typeof done ? done : function (value) {
        return value;
      };
      if (!devicesContainer.hasOwnProperty("" + this._data.device.role + "s")) {
        throw new Error("The deviceContainer don't contain a container: " + this._data.device.role + "s");
      }
      if (!devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]] || !devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]][this._data["device"]["macAddress"]]) {
        return done(new Error("Nothing to do"));
      }
      delete devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]][this._data["device"]["macAddress"]];
      console.log("device: " + [this._data["device"]["macAddress"]] + ", has been removed from: " + this._data["application"]["businessId"]);
      _libLoggerJs.logger.info("device: " + [this._data["device"]["macAddress"]] + ", has been removed from: " + this._data["application"]["businessId"]);
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
        _libLoggerJs.logger.info("queue for master: " + _this6._data["device"]["macAddress"] + ", has been unbinded");
        _this6.deleteDevice(done);
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
        _libLoggerJs.logger.info("queue for manager: " + _this7._data["device"]["macAddress"] + ", has been unbinded");
        _this7.deleteDevice(done);
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
        console.log("queue for slave " + _this8._data["device"]["macAddress"] + ", is going to be removed from masters and managers");
        _libLoggerJs.logger.info("queue for slave " + _this8._data["device"]["macAddress"] + ", is going to be removed from masters and managers");
        _this8._queue.close("topic", _this8._data["device"]["macAddress"], function () {
          console.log("queue for slave: " + _this8._data["device"]["macAddress"] + ", has been unbinded");
          _libLoggerJs.logger.info("queue for slave: " + _this8._data["device"]["macAddress"] + ", has been unbinded");
          _this8.deleteDevice(done);
        });
      };

      //let timeout = 20;
      //let interval = setInterval(() => {

      //console.log('click');
      //logger.info('click');

      if (this._send) {
        //stopFunction();
        return this._send(JSON.stringify({
          type: "service", message: {
            action: "slaveDisconnected",
            content: { role: "slave", status: "disconnected", id: this._data["device"]["macAddress"] },
            time: new Date()
          }
        }), function () {
          setTimeout(beforeClose, 1000);
        });
      }

      return beforeClose();
      //if (--timeout < 1) {
      //  stopFunction();
      //  return done();
      //}
      //}, 1000);

      //function stopFunction() {
      //  clearInterval(interval);
      //}
    }
  }]);

  return LinkDevice;
})();

exports.LinkDevice = LinkDevice;

//# sourceMappingURL=message.js.map