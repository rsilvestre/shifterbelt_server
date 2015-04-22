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

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _Logger = require("../lib/logger.js");

var _Logger2 = _interopRequireWildcard(_Logger);

var log = new _Logger2["default"]();

var adapterContainers = {};

function extra(key) {
    if (!this.hasOwnProperty(key) && !this.hasOwnProperty(config.adapters.getAdapter(key))) {
        return new Error("The adaptater: " + key + ", not exist");
    }
    return this[key] || this[config.adapters.getAdapter(key)];
}

var adapters = {
    getAdapters: function getAdapters() {
        return adapterContainers;
    },
    getAdapter: function getAdapter(name) {
        return extra.call(adapterContainers, name);
    }
};

exports.adapters = adapters;

var AbsAdapter = (function () {
    function AbsAdapter(name) {
        _classCallCheck(this, AbsAdapter);

        this._key = config.adapters.getAdapter(name);
        this.addAdapter(this._key, this);
        log.debug = "the module: " + this._key + ", has been added to the adapters list";
    }

    _createClass(AbsAdapter, [{
        key: "key",
        get: function () {
            return this._key;
        }
    }, {
        key: "addAdapter",
        value: function addAdapter(key, value) {
            if (adapterContainers.hasOwnProperty(value)) {
                return new Error("The adapter: " + value + ", still exist");
            }
            adapterContainers[key] = value;
        }
    }, {
        key: "getAdapters",
        value: function getAdapters() {
            return adapterContainers;
        }
    }, {
        key: "getAdapterByKey",
        value: function getAdapterByKey(key) {
            if (!adapterContainers.hasOwnProperty(key)) {
                return new Error("The adaptater: " + key + ", not exist");
            }
            return adapterContainers[key];
        }
    }, {
        key: "getAdapterByName",
        value: function getAdapterByName(name) {
            var key = config.adapters.getAdapter(name);
            if (!adapterContainers.hasOwnProperty(key)) {
                return new Error("The key: " + key + ", not exist");
            }
            return adapterContainers[key];
        }
    }]);

    return AbsAdapter;
})();

exports["default"] = AbsAdapter;

//# sourceMappingURL=absAdapter.js.map