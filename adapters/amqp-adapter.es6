/**
 * Created by michaelsilvestre on 20/04/15
 */

import amqp from "amqp"
import * as config from "../config/adapters.js"
import AbsAdapter from "./absAdapter.js"

export default class AmqpAdapter extends AbsAdapter {
    constructor(callback) {
        super("queue");

        this.init(callback);
    }

    init(callback) {
        let amqpConfig = config.adapters.getConfig("queue");

        this._connection = amqp.createConnection(amqpConfig);
        this._connection.on('ready', () => {
            console.log('amqp successfull connected');
            callback(this);
        });
    }

    get connection() {
        return this._connection;
    }
}