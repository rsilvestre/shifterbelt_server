/*!
 * Module dependencies.
 */

import async from 'async'

let fs = require(`fs`);
let envFile = `${__dirname}/env.json`;


// Read env.json file, if it exists, load the id`s and secrets from that
// Note that this is only in the development env
// it is not safe to store id`s in files

if (fs.existsSync(envFile)) {
  let env = JSON.parse(fs.readFileSync(envFile, `utf-8`));
  async.forEachOf(env, (value, key, callback) => {
    process.env[key] = value;
    callback();
  }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

/**
 * Expose
 */

module.exports = {
  baseUrl: `localhost:3000`,
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
