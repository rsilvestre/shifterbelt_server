/**
 * Created by michaelsilvestre on 22/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.model = model;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _libLoggerJs = require("../lib/logger.js");

var modelManagers = {};

var modelManager = {
    model: function model(name) {
        var _model = arguments[1] === undefined ? undefined : arguments[1];

        if (!_model) {
            if (!modelManagers.hasOwnProperty(name)) {
                return new Error("The model: " + name + ", not exist");
            }
            return modelManagers[name];
        }
        if (modelManagers.hasOwnProperty(name) && modelManagers[name].model) {
            return new Error("The model: " + name + ", contain a model");
        }
        return modelManager[name];
    },
    schema: function schema(name, _schema) {
        if (!modelManagers.hasOwnProperty(name)) {
            return new Error("The model: " + name + ", not exist");
        }
        if (modelManagers.hasOwnProperty(name)) {
            return new Error("The model: " + name + ", exist");
        }
        return modelManagers[name] = new ModelManager(_schema);
    },
    instanciate: function instanciate(name) {
        var _modelManagers$name;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (!modelManagers.hasOwnProperty(name)) {
            _libLoggerJs.logger.error("The model: " + name + ", not exist");
            return new Error("The model: " + name + ", not exist");
        }
        return (_modelManagers$name = modelManagers[name]).instanciate.apply(_modelManagers$name, args);
    }
};

exports.modelManager = modelManager;

function model(name) {
    var model = arguments[1] === undefined ? undefined : arguments[1];

    var modelManager = new ModelManager();
    return modelManager.model(name, model);
}

var ModelManager = (function () {
    function ModelManager(schema) {
        _classCallCheck(this, ModelManager);

        this._schema = schema;
    }

    _createClass(ModelManager, [{
        key: "instanciate",
        value: function instanciate() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return this._instance = new (_bind.apply(this._model, [null].concat(args)))();
        }
    }, {
        key: "instance",
        get: function () {
            return this._instance;
        }
    }, {
        key: "model",
        set: function (value) {
            this._model = value;
        },
        get: function () {
            return this._model;
        }
    }, {
        key: "schema",
        set: function (value) {
            this._schema = value;
        },
        get: function () {
            return this._schema;
        }
    }]);

    return ModelManager;
})();

//# sourceMappingURL=model-manager.js.map