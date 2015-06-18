/**
 * Created by michaelsilvestre on 22/04/15
 */

import socketIo from "socket.io"
import socketRedis from "socket.io-redis"
import redis from "redis"
import * as config from "../config/config.js"
import AbsAdapter from "./absAdapter.js"
import _ from "underscore"
import http from 'http'
import url from 'url'
import { logger } from "../lib/logger.js"

export default class WebsocketAdapter extends AbsAdapter {
  constructor(callback) {
    super('websocket');

    this.init(callback);
  }

  init(callback) {
    let websocketConfig = config.adapters.getConfig("websocket");
    let redisConfig = config.adapters.getConfig("memory");

    var redisURL = url.parse(redisConfig.defaultUrl());

    let pub = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });
    if (redisURL.auth) {
      pub.auth(redisURL.auth.split(":")[1]);
    }

    let sub = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true, detect_buffers: true });
    if (redisURL.auth) {
      sub.auth(redisURL.auth.split(":")[1]);
    }

    this._server = http.createServer((req, res) => {
      res.end('thank you');
    });

    this._io = socketIo.listen(this._server);
    this._io.adapter(socketRedis({ pubClient: pub, subClient: sub }));

    this._server.listen(websocketConfig.port);

    _.each(this._io.nsps, (nsp) => {
      nsp.on('connection', (socket) => {
        if (socket.auth) {
          console.log(`removing socket from: ${nsp.name}`);
          logger.info(`removing socket from: ${nsp.name}`);
          delete nsp.connected[socket.id];
        }
      });
    });
    this._nsp = this._io.of(websocketConfig.namespace);
    console.log('socket.io successfull connected');
    logger.info('socket.io successfull connected');
    callback(this);
  }

  /**
   *
   * @returns {socket.io}
   */
  get io() {
    return this._io;
  }

  /**
   *
   * @returns {Array|*|String}
   */
  get nsp() {
    return this._nsp;
  }

  connection(callback) {
    this._nsp.on("connection", callback);
  }

  close(next) {
    console.log('close websocket');
    logger.info('close websocket');
    this._io.close();
    console.log('close server');
    logger.info('close server');
    this._server.close();
    next();
  }
}
