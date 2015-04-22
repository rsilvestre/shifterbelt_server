/**
 * Created by michaelsilvestre on 22/04/15
 */

import socketIo from "socket.io"
import * as config from "../config/adapters.js"
import AbsAdapter from "./absAdapter.js"

export default class WebsocketAdapter extends AbsAdapter {
    constructor(callback) {
        super('websocket');

        this.init(callback);
    }

    init(callback) {
        let websocketConfig = config.adapters.getConfig("websocket");
        this._io = socketIo(websocketConfig.port);
        this._nsp = this._io.of(websocketConfig.namespace);
        console.log('socket.io successfull connected');
        callback(this);
    }

    get io() {
        return this._io;
    }

    connection(callback) {
        this._nsp.on("connection", callback);
    }
}
