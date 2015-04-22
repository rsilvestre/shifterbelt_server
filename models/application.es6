/**
 * Created by michaelsilvestre on 20/04/15
 */

import { modelManager } from "../lib/model-manager.js"

class Application {
    constructor(name) {
        this._name = name;
    }
}

modelManager.model("Application", Application);