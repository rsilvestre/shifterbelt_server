/**
 * Created by michaelsilvestre on 22/04/15
 */

import socketIo from "socket.io"
import socketRedis from "socket.io-redis"
import redis from "redis"
import * as config from "../config/adapters.js"
import AbsAdapter from "./absAdapter.js"
import _ from "underscore"

export default class WebsocketAdapter extends AbsAdapter {
  constructor(callback) {
    super('websocket');

    this.init(callback);
  }

  init(callback) {
    let websocketConfig = config.adapters.getConfig("websocket");
    //let redisConfig = config.adapters.getConfig("memory");

    //let pub = redis.createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password });
    //let sub = redis.createClient(redisConfig.port, redisConfig.host, { detect_buffers: true, auth_pass: redisConfig.password });

    //io.adapter(socketRedis({ pubClient: pub, subClient: sub }));

    this._io = socketIo(websocketConfig.port);
    _.each(this._io.nsps, (nsp) => {
      nsp.on('connection', (socket) => {
        if (socket.auth) {
          console.log(`removing socket from: ${nsp.name}`);
          delete nsp.connected[socket.id];
        }
      });
    });
    this._nsp = this._io.of(websocketConfig.namespace);
    console.log('socket.io successfull connected');
    callback(this);
  }

  get io() {
    return this._io;
  }

  get nsp() {
    return this._nsp;
  }

  connection(callback) {
    this._nsp.on("connection", callback);
  }
}
