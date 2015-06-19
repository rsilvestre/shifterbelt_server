"use strict";

var baseUrl = "www.shifterbelt.com:3000";

/**
 * Expose
 */

module.exports = {
  baseUrl: "www.shifterbelt.com:3000",
  db: process.env.MONGOHQ_URL,
  logLevel: "debug",
  path: "logger.log",
  logentries_token: process.env.LOGENTRIES_TOKEN,
  email: {
    noreply: {
      name: "Shifterbelt.com",
      email: "noreply@shifterbelt.com"
    }
  }
};

//# sourceMappingURL=pre_prod.js.map