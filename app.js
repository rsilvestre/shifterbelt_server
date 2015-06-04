/**
 * Created by michaelsilvestre on 19/04/15
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _libModelManagerJs = require("./lib/model-manager.js");

var _adaptersAbsAdapterJs = require("./adapters/absAdapter.js");

var _controllerIndexJs = require("./controller/index.js");

var _controllerIndexJs2 = _interopRequireDefault(_controllerIndexJs);

var App = (function () {
  function App() {
    _classCallCheck(this, App);

    this.init();
  }

  _createClass(App, [{
    key: "init",
    value: function init() {

      var controller = new _controllerIndexJs2["default"]();
    }
  }, {
    key: "init_bak",
    value: function init_bak() {
      var mssqlAdapter = _adaptersAbsAdapterJs.adapters.getAdapter("database");

      var callback = function callback(err, result) {
        if (err) throw err;
        var applications = {};
        result[0].forEach(function (value) {
          applications[value["ApplicationId"]] = _libModelManagerJs.modelManager.instanciate("Application", value["ApplicationName"]);
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