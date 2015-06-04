/**
 * Created by michaelsilvestre on 25/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var identityInit = function identityInit() {
  var websocketAdapter = _adaptersAbsAdapterJs.adapters.getAdapter("websocket");
  websocketAdapter.nsp.use(function (socket, next) {
    var handshake = socket.handshake;
    if (!handshake.hasOwnProperty("query") && !handshake.query.hasOwnProperty("applicationId")) {
      return next(new Error("The query don't contain applicationId"));
    }
    if (!handshake.hasOwnProperty("address")) {
      return next(new Error("The query don't contain ipAddress"));
    }

    var identify = new Identify(handshake.query.applicationId, handshake.address);
    identify.token = handshake.query.hasOwnProperty("token") ? handshake.query.token : "";
    identify.checkIdentity(function (err, result) {
      if (err) throw err;
      if (result instanceof Error) {
        return next(result.message);
      }
      next();
    });
  });
};

exports.identityInit = identityInit;

var Identify = (function () {
  function Identify(applicationId, ipAddress) {
    _classCallCheck(this, Identify);

    this._applicationId = applicationId;
    this._ipAddress = ipAddress;
    this._checked = false;
  }

  _createClass(Identify, [{
    key: "checkIdentity",
    value: function checkIdentity(callback) {
      var _this = this;

      var redisClient = _adaptersAbsAdapterJs.adapters.getAdapter("memory").client;
      var hash = "" + this._applicationId + "" + this._ipAddress.replace(/\./, "");
      var tryIdentify = function tryIdentify(applicationId, cb) {
        cb(null, true);
      };
      redisClient.hgetall(hash, function (err, obj) {
        if (err) return callback(err, null);

        if (obj && obj.hasOwnProperty("not_allow")) {
          if (parseInt((new Date().getTime() - obj.not_allow) / 1000) < 600) {
            return callback(new Error("The device is not allowed to connect on the system for the moment."), null);
          }
          redisClient.hdel(hash, "not_allow", function (err, result) {
            if (err) return callback(err, null);
            if (!result) {
              return callback(new Error("Cannot remove key: not_allow, from redis"), null);
            }
            return tryIdentify(_this._applicationId, callback);
          });
        }

        if (obj && (obj.hasOwnProperty("token") && _this._token.length > 0 && obj.token === _this._token && obj.hasOwnProperty("allow"))) {
          if (parseInt((new Date().getTime() - obj.allow) / 1000) < 600) {
            return redisClient.hmset(hash, { allow: new Date().getTime() + 600 }, function (err, result) {
              if (err) return callback(err, null);
              if (!result) {
                return callback(new Error("Impossible to increase the allowed time in redis"), null);
              }
              _this._checked = true;
              return callback(null, true);
            });
          }
          return tryIdentify(_this._applicationId, callback);
        }

        return redisClient.hmset(hash, { allow: new Date().getTime() + 600 }, function (err, result) {
          if (err) return callback(err, null);
          if (!result) {
            return callback(new Error("Impossible to increase the allowed time in redis"), null);
          }
          _this._checked = true;
          return callback(null, true);
        });
      });
    }
  }, {
    key: "token",
    set: function (value) {
      this._token = value;
    }
  }, {
    key: "checked",
    get: function () {
      return this._checked;
    }
  }]);

  return Identify;
})();

//# sourceMappingURL=identify.js.map