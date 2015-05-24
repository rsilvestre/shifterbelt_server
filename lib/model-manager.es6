/**
 * Created by michaelsilvestre on 22/04/15
 */

import { logger } from "../lib/logger.js"

let modelManagers = {};

export let modelManager = {
    model: (name, model = undefined) => {
        if (!model) {
            if (!modelManagers.hasOwnProperty(name)) {
                return new Error(`The model: ${name}, not exist`);
            }
            return modelManagers[name];
        }
        if (modelManagers.hasOwnProperty(name) && modelManagers[name].model) {
            return new Error(`The model: ${name}, contain a model`);
        }
        return modelManager[name];
    },
    schema: (name, schema) => {
        if (!modelManagers.hasOwnProperty(name)) {
            return new Error(`The model: ${name}, not exist`);
        }
        if (modelManagers.hasOwnProperty(name)) {
            return new Error(`The model: ${name}, exist`);
        }
        return modelManagers[name] = new ModelManager(schema);
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
    constructor(schema) {
        this._schema = schema;
    }

    instanciate(...args) {
        return this._instance = new this._model(...args);
    }

    get instance() {
        return this._instance;
    }

    set model(value) {
        this._model = value;
    }

    get model() {
        return this._model;
    }

    set schema(value) {
        this._schema = value;
    }

    get schema() {
        return this._schema;
    }
}