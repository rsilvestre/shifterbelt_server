/**
 * Created by michaelsilvestre on 19/04/15
 */

import MssqlAdapter from "../adapters/mssql-adapter.js"

export default class Identify {
    constructor() {
        this._adapter = new MssqlAdapter();
        this._connection = this._adapter.connection;
    }

    user(callback) {
        var mssql = this._connection;

        var request = new mssql.Request();

        request.execute('[dbo].[Users.SelectAll]', (err, record, returnValue) => {
            if (err) return callback(err, null);
            return callback(null, record);
        });
    }
}