/**
 * Created by michaelsilvestre on 20/04/15
 */

import Device from "./device.js"
import { modelManager } from "../lib/model-manager.js"

class Slave extends Device {
    constructor(macAddress){
        super(macAddress);
    }
}

modelManager.model('Slave', Slave);