/**
 * Created by michaelsilvestre on 19/04/15
 */

import * as adapters from "../adapters/index.js"
import * as config from "../config/adapters.js"

function getAdapter(name) {
    return config.adapters[name];
}

function dbloader(name) {
    return new Promise((resolve, reject) => {
        new adapters.adapters[name](resolve);
    });
}

export default class Bootstrap {
    constructor(callback) {
        this._application = callback;
    }

    run() {
        var p = dbloader(config.adapters.getAdapter("database"))
            .then(()=> {
                return dbloader(config.adapters.getAdapter('memory'));
            })
            .then(() => {
                return dbloader(config.adapters.getAdapter('queue'));
            }).then((rabbitAdapter) => {
                let adapters = rabbitAdapter.getAdapters();
                let app = new this._application(adapters);

            });
    }
}
