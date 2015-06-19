/**
 * Created by michaelsilvestre on 4/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _adaptersJs = require('./adapters.js');

var adapters = _interopRequireWildcard(_adaptersJs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var defaults = {
  root: _path2['default'].normalize(__dirname + '/..'),
  adapters: adapters
};

var development = require('./env/development');
var pre_prod = require('./env/pre_prod');
var test = require('./env/test');
var production = require('./env/production');

exports['default'] = ({
  development: (0, _util._extend)(development, defaults),
  pre_prod: (0, _util._extend)(pre_prod, defaults),
  test: (0, _util._extend)(test, defaults),
  production: (0, _util._extend)(production, defaults)
})[process.env.NODE_ENV || 'development'];
module.exports = exports['default'];

//# sourceMappingURL=config.js.map