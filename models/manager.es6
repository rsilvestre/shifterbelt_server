/**
 * Created by michaelsilvestre on 20/04/15
 */

import Device from "./device.js"
import { modelManager } from "../lib/model-manager.js"

export default class Manager extends Device {
    constructor(macAddress){
        super(macAddress);
    }
}

modelManager.model('Manager', Manager);
