/**
 * Created by michaelsilvestre on 19/04/15
 */

import mssql from "mssql"
import * as config from "../config/config.js"
import AbsAdapter from "./absAdapter.js"

export default class MssqlAdapter extends AbsAdapter {
  constructor(callback) {
    super("database");

    this.init(callback);
  }

  init(callback) {
    let mssqlConfig = config.adapters.getConfig("database");
    this._connection = mssql.connect(mssqlConfig, (err) => {
      if (err) throw err;
      this._mssql = mssql;
      console.log('mssql successfull connected');
      callback(this);
    });
  }

  get connection() {
    return this._connection;
  }

  get mssql() {
    return this._mssql;
  }

}