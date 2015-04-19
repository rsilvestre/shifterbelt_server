"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

/**
 * Created by michaelsilvestre on 19/04/15
 */

var _App = require("./app");

var _App2 = _interopRequireWildcard(_App);

var _Bootstrap = require("./lib/bootstrap.js");

var _Bootstrap2 = _interopRequireWildcard(_Bootstrap);

var bootstrap = new _Bootstrap2["default"](_App2["default"]);
bootstrap.run();

//import Identify from './lib/identify.js'

/*let identify = new Identify();
identify.user((err, result) => {
    if (err) throw err;
    console.log(result);
});*/
//let app = App();

//# sourceMappingURL=start.js.map