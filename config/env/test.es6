let baseUrl = `localhost:3000`;

/**
 * Expose
 */

module.exports = {
  baseUrl: `localhost:3000`,
  db: `mongodb://localhost/noobjs_test`,
  logLevel: "debug",
  path: "logger.log",
  logentries_token: process.env.LOGENTRIES_TOKEN,
  email: {
    noreply: {
      name: "Shifterbelt.com",
      email: "noreply@shifterbelt.com"
    }
};
