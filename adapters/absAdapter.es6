/**
 * Created by michaelsilvestre on 19/04/15
 */

import * as config from "../config/adapters.js"

let adapters = {};

export default class AbsAdapter {
    constructor(name) {
        this._key = config.adapters.getAdapter(name);
        this.addAdapter(this._key, this);
    }

    get key() {
        return this._key;
    }

    addAdapter(key, value) {
        if (adapters.hasOwnProperty(value)) {
            return new Error(`The adapter: ${value}, still exist`);
        }
        adapters[key] = value;
    }

    getAdapters() {
        return adapters;
    }

    getAdapterByKey(key) {
        if (!adapters.hasOwnProperty(key)) {
            return new Error(`The adaptater: ${key}, not exist`)
        }
        return adapters[key];
    }

    getAdapterByName(name) {
        let key = config.adapters.getAdapter(name);
        if (!adapters.hasOwnProperty(key)) {
            return new Error(`The key: ${key}, not exist`);
        }
        return adapters[key];
    }
}