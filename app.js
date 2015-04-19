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

var _import = require("./config/adapters.js");

var config = _interopRequireWildcard(_import);

function extra(key) {
    if (!this.hasOwnProperty(key) && !this.hasOwnProperty(config.adapters.getAdapter(key))) {
        return new Error("The adaptater: " + key + ", not exist");
    }
    return this[key] || this[config.adapters.getAdapter(key)];
}

var App = (function () {
    function App(adapters) {
        _classCallCheck(this, App);

        this._adapters = adapters;
        this.init();
    }

    _createClass(App, [{
        key: "init",
        value: function init() {
            var mssqlAdapter = this.getAdapter("database");

            var callback = function callback(err, result) {
                if (err) throw err;
                console.log(result);
                mssqlAdapter.connection.close();
            };
            var mssql = mssqlAdapter.mssql;

            var request = new mssql.Request();

            request.execute("[dbo].[Users.SelectAll]", function (err, record, returnValue) {
                if (err) return callback(err, null);
                return callback(null, record);
            });
            //console.log(mssqlAdapter.mssql);
        }
    }, {
        key: "adapters",
        get: function () {
            return this._adapters;
        }
    }, {
        key: "getAdapter",
        value: function getAdapter(name) {
            return extra.call(this.adapters, name);
        }
    }]);

    return App;
})();

exports["default"] = App;
module.exports = exports["default"];

//# sourceMappingURL=app.js.map