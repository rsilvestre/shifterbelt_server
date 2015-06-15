/**
 * Created by michaelsilvestre on 19/04/15
 */
import { modelManager } from "./lib/model-manager.js"
import { adapters } from "./adapters/absAdapter.js"
import Controller from "./controller/index.js.js"
import { logger } from "./lib/logger.js"

export default class App {
  constructor() {
    this.init();
  }

  init() {

    let controller = new Controller();
    logger.info("Shifterbelt started");

  }

  init_bak() {
    let mssqlAdapter = adapters.getAdapter("database");

    let callback = function(err, result) {
      if (err) throw err;
      let applications = {};
      result[0].forEach((value) => {
        applications[value["ApplicationId"]] = modelManager.instanciate("Application", value['ApplicationName']);
      });
      console.log(applications);
      logger.info(applications);
      mssqlAdapter.connection.close();
    };
    let mssql = mssqlAdapter.mssql;

    let request = new mssql.Request();

    request.execute('[dbo].[Applications.SelectAll]', (err, records, returnValue) => {
      if (err) return callback(err, null);
      return callback(null, records);
    });
    //console.log(mssqlAdapter.mssql);
    //logger.info(mssqlAdapter.mssql);
  }
}

