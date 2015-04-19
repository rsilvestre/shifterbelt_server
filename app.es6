/**
 * Created by michaelsilvestre on 19/04/15
 */
import * as config from "./config/adapters.js"

function extra(key) {
        if (!this.hasOwnProperty(key) && !this.hasOwnProperty(config.adapters.getAdapter(key))) {
            return new Error(`The adaptater: ${key}, not exist`);
        }
        return this[key] || this[config.adapters.getAdapter(key)];
}

export default class App {
    constructor(adapters) {
        this._adapters = adapters;
        this.init();
    }

    init() {
        let mssqlAdapter = this.getAdapter("database");

        let callback = function (err, result) {
            if (err) throw err;
            console.log(result);
            mssqlAdapter.connection.close();
        };
        let mssql = mssqlAdapter.mssql;

        let request = new mssql.Request();

        request.execute('[dbo].[Users.SelectAll]', (err, record, returnValue) => {
            if (err) return callback(err, null);
            return callback(null, record);
        });
        //console.log(mssqlAdapter.mssql);
    }

    get adapters() {
        return this._adapters;
    }

    getAdapter(name) {
        return extra.call(this.adapters, name);
    }
}

