/**
 * Created by michaelsilvestre on 23/04/15
 */

import mongoose from "mongoose"
import * as config from "../config/config.js"
import AbsAdapter from "./absAdapter.js"
import { logger } from "../lib/logger.js"

export default class MongooseAdapter extends AbsAdapter {
  constructor(callback) {
    super("database");

    this.init(callback);
  }

  init(callback) {
    let mongooseConfig = config.adapters.getConfig("database");

    this._mongoose = mongoose;

    this._mongoose.connect(mongooseConfig.url);
    this._db = this._mongoose.connection;
    this._db.once('open', () => {
      console.log('mongoose successfull connected');
      logger.info('mongoose successfull connected');
      callback(this);
    });
  }

  get connection() {
    return this._db;
  }

  get mongo() {
    return this._mongoose;
  }
}
