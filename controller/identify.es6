/**
 * Created by michaelsilvestre on 25/04/15
 */

import { adapters } from "../adapters/absAdapter.js"

export let identityInit = () => {
  let websocketAdapter = adapters.getAdapter("websocket");
  websocketAdapter.nsp.use((socket, next) => {
    let handshake = socket.handshake;
    if (!handshake.hasOwnProperty("query") && !handshake.query.hasOwnProperty("applicationId")) {
      next(new Error("The query don't contain applicationId"));
    }
    if (!handshake.hasOwnProperty("address")) {
      next(new Error("The query don't contain ipAddress"));
    }

    let identify = new Identify(handshake.query.applicationId, handshake.address);
    identify.token = (handshake.query.hasOwnProperty("token")) ? handshake.query.token : "";
    identify.checkIdentity((err, result) => {
      if (err) throw err;
      if (result instanceof Error) {
        next(result.message);
      }
      next();
    });
  });
};

class Identify {
  constructor(applicationId, ipAddress) {
    this._applicationId = applicationId;
    this._ipAddress = ipAddress;
    this._checked = false;
  }

  checkIdentity(callback) {
    var redisClient = adapters.getAdapter("memory").client;
    let hash = `${this._applicationId}${this._ipAddress.replace(/\./, '')}`;
    let tryIdentify = (applicationId, cb) => {
      cb(null, true);
    };
    redisClient.hgetall(hash, (err, obj) => {
      if (err) return callback(err, null);

      if (obj && obj.hasOwnProperty("not_allow")) {
        if (parseInt(((new Date()).getTime() - obj.not_allow) / 1000) < 600) {
          return callback(new Error(`The device is not allowed to connect on the system for the moment.`), null);
        }
        redisClient.hdel(hash, "not_allow", (err, result) => {
          if (err) return callback(err, null);
          if (!result) {
            return callback(new Error(`Cannot remove key: not_allow, from redis`), null);
          }
          return tryIdentify(this._applicationId, callback);
        });
      }


      if (obj && (obj.hasOwnProperty("token") && this._token.length > 0 && obj.token === this._token && obj.hasOwnProperty('allow'))) {
        if (parseInt(((new Date()).getTime() - obj.allow) / 1000) < 600) {
          return redisClient.hmset(hash, { allow: (new Date()).getTime() + 600 }, (err, result) => {
            if (err) return callback(err, null);
            if (!result) {
              return callback(new Error(`Impossible to increase the allowed time in redis`), null);
            }
            this._checked = true;
            return callback(null, true);
          });
        }
        return tryIdentify(this._applicationId, callback);
      }

      return redisClient.hmset(hash, { allow: (new Date()).getTime() + 600 }, (err, result) => {
        if (err) return callback(err, null);
        if (!result) {
          return callback(new Error(`Impossible to increase the allowed time in redis`), null);
        }
        this._checked = true;
        return callback(null, true);
      });
    });

  }

  set token(value) {
    this._token = value;
  }

  get checked() {
    return this._checked;
  }
}
