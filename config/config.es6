/**
 * Created by michaelsilvestre on 4/06/15
 */

import * as adapters from "./adapters.js"
import path from 'path';
import { _extend as extend } from 'util';

let defaults = {
  root: path.normalize(__dirname + '/..'),
  adapters : adapters
};

var development = require('./env/development');
var pre_prod = require('./env/pre_prod');
var test = require('./env/test');
var production = require('./env/production');

export default {
  development: extend(development, defaults),
  pre_prod: extend(pre_prod, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
