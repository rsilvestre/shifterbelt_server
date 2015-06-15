/**
 * Created by michaelsilvestre on 19/04/15
 */

import rabbit from "rabbit.js"
import * as config from "../config/config.js"
import AbsAdapter from "./absAdapter.js"
import { logger } from "../lib/logger.js"

export default class RabbitAdapter extends AbsAdapter {
  constructor(callback) {
    super("queue");
    this._pub = null;
    this._sub = null;

    this.init(callback);
  }

  init(callback) {
    let rabbitConfig = config.adapters.getConfig("queue");

    this._context = require('rabbit.js').createContext(rabbitConfig.url);
    this._context.on('ready', () => {
      "use strict";

      console.log('rabbit successfull connected');
      logger.info('rabbit successfull connected');
      this._pub = this._context.socket('PUB');
      this._sub = this._context.socket('SUB');
      //sub.pipe(process.stdout);
      this._sub.setEncoding('utf8');
      this._sub.on('data', (note) => {
        "use strict";

        console.log(`Alarum! '${note}`);
        logger.info(`Alarum! '${note}`);
      });

      this._sub.connect('events', () => {
        "use strict";

        this._pub.connect('events');
      });
      callback(this);
    });

  }

  get rabbit() {
    return this._context;
  }

}