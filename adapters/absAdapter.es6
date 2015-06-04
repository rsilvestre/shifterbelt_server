/**
 * Created by michaelsilvestre on 19/04/15
 */

import * as config from "../config/config.js"
import Logger from "../lib/logger.js"

let log = new Logger();

let adapterContainers = {};

function extra(key) {
    if (!this.hasOwnProperty(key) && !this.hasOwnProperty(config.adapters.getAdapter(key))) {
        return new Error(`The adaptater: ${key}, not exist`);
    }
    return this[key] || this[config.adapters.getAdapter(key)];
}

export let adapters = {
    getAdapters() {
        return adapterContainers;
    },
    getAdapter(name) {
        return extra.call(adapterContainers, name);
    }
};

export default class AbsAdapter {
    constructor(name) {
        this._key = config.adapters.getAdapter(name);
        this.addAdapter(this._key, this);
        log.debug = `the module: ${this._key}, has been added to the adapters list`;
    }

    get key() {
        return this._key;
    }

    addAdapter(key, value) {
        if (adapterContainers.hasOwnProperty(value)) {
            return new Error(`The adapter: ${value}, still exist`);
        }
        adapterContainers[key] = value;
    }

    getAdapters() {
        return adapterContainers;
    }

    getAdapterByKey(key) {
        if (!adapterContainers.hasOwnProperty(key)) {
            return new Error(`The adaptater: ${key}, not exist`)
        }
        return adapterContainers[key];
    }

    getAdapterByName(name) {
        let key = config.adapters.getAdapter(name);
        if (!adapterContainers.hasOwnProperty(key)) {
            return new Error(`The key: ${key}, not exist`);
        }
        return adapterContainers[key];
    }
}