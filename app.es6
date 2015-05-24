/**
 * Created by michaelsilvestre on 19/04/15
 */
import * as config from "./config/adapters.js"
import * as models from "./models"
import { modelManager } from "./lib/model-manager.js"
import { adapters } from "./adapters/absAdapter.js"
import Controller from "./controller/index.js.js"

export default class App {
    constructor() {
        this.init();
    }

    init() {

        let controller = new Controller();

    }

    init_bak() {
        let mssqlAdapter = adapters.getAdapter("database");

        let callback = function (err, result) {
            if (err) throw err;
            let applications = {};
            result[0].forEach((value) => {
                applications[value["ApplicationId"]] = modelManager.instanciate("Application", value['ApplicationName']);
            });
            console.log(applications);
            mssqlAdapter.connection.close();
        };
        let mssql = mssqlAdapter.mssql;

        let request = new mssql.Request();

        request.execute('[dbo].[Applications.SelectAll]', (err, records, returnValue) => {
            if (err) return callback(err, null);
            return callback(null, records);
        });
        //console.log(mssqlAdapter.mssql);
    }
}

