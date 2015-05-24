"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { "default": obj };
};

var _interopRequireWildcard = function(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj["default"] = obj;
        return newObj;
    }
};

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by michaelsilvestre on 19/04/15
 */

var _import = require("./config/adapters.js");

var config = _interopRequireWildcard(_import);

var _import2 = require("./models");

var models = _interopRequireWildcard(_import2);

var _modelManager = require("./lib/model-manager.js");

var _adapters = require("./adapters/absAdapter.js");

var _Controller = require("./controller/index.js.js");

var _Controller2 = _interopRequireDefault(_Controller);

var App = (function () {
    function App() {
        _classCallCheck(this, App);

        this.init();
    }

    _createClass(App, [{
        key: "init",
        value: function init() {

            var controller = new _Controller2["default"]();
        }
    }, {
        key: "init_bak",
        value: function init_bak() {
            var mssqlAdapter = _adapters.adapters.getAdapter("database");

            var callback = function callback(err, result) {
                if (err) throw err;
                var applications = {};
                result[0].forEach(function (value) {
                    applications[value.ApplicationId] = _modelManager.modelManager.instanciate("Application", value.ApplicationName);
                });
                console.log(applications);
                mssqlAdapter.connection.close();
            };
            var mssql = mssqlAdapter.mssql;

            var request = new mssql.Request();

            request.execute("[dbo].[Applications.SelectAll]", function (err, records, returnValue) {
                if (err) return callback(err, null);
                return callback(null, records);
            });
            //console.log(mssqlAdapter.mssql);
        }
    }]);

    return App;
})();

exports["default"] = App;
module.exports = exports["default"];

//# sourceMappingURL=app.js.map