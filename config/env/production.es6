let baseUrl = `www.shifterbelt.com`;

/**
 * Expose
 */

module.exports = {
  baseUrl: `www.shifterbelt.com`,
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
