/**
 * Created by michaelsilvestre on 19/04/15
 */

import * as adapters from "../adapters/index.js"
import * as config from "../config/adapters.js"
import socketIo from "socket.io"

function getAdapter(name) {
    return config.adapters[name];
}

function dbloader(key) {
    let name = config.adapters.getAdapter(key);
    return new Promise((resolve, reject) => {
        new adapters.adapters[name](resolve);
    });
}

export default class Bootstrap {
    constructor(callback) {
        this._application = callback;
    }

    run() {
        var p = dbloader("database")
            .then(()=> {
                return dbloader("memory");
            })
            .then(() => {
                return dbloader("queue");
            })
            .then(() => {
                return dbloader("websocket");
            })
            .then(() => {

                let app = new this._application();

            });
    }
}
