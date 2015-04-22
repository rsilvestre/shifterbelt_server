/**
 * Created by michaelsilvestre on 22/04/15
 */

import { logger } from "../lib/logger.js"

let modelManagers = {};

export let modelManager = {
    model: (name, model = undefined) => {
        if (!model) {
            if (!modelManagers.hasOwnProperty(name)) {
                return  null;
            }
            return modelManagers[name];
        }
        if (modelManagers.hasOwnProperty(name)) {
            return null;
        }
        modelManagers[name] = new ModelManager(model);
        return modelManager[name];
    },
    instanciate: (name, ...args) => {
        if (!modelManagers.hasOwnProperty(name)) {
            logger.error(`The model: ${name}, not exist`);
            return new Error(`The model: ${name}, not exist`);
        }
        return modelManagers[name].instanciate(...args);
    }
};

export function model(name, model = undefined) {
    let modelManager = new ModelManager();
    return modelManager.model(name, model);
}


class ModelManager {
    constructor(model) {
        this._model = model;
    }

    instanciate(...args) {
        return this._instance = new this._model(...args);
    }

    get instance() {
        return this._instance;
    }
}