"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by michaelsilvestre on 19/04/15
 */

var _MssqlAdapter = require("../adapters/mssql-adapter.js");

var _MssqlAdapter2 = _interopRequireWildcard(_MssqlAdapter);

var Identify = (function () {
    function Identify() {
        _classCallCheck(this, Identify);

        this._adapter = new _MssqlAdapter2["default"]();
        this._connection = this._adapter.connection;
    }

    _createClass(Identify, [{
        key: "user",
        value: function user(callback) {
            var mssql = this._connection;

            var request = new mssql.Request();

            request.execute("[dbo].[Users.SelectAll]", function (err, record, returnValue) {
                if (err) return callback(err, null);
                return callback(null, record);
            });
        }
    }]);

    return Identify;
})();

exports["default"] = Identify;
module.exports = exports["default"];

//# sourceMappingURL=identify.js.map