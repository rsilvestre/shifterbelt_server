"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _interopRequireDefault = function(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
};

var _classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _get = function get(_x, _x2, _x3) {
  var _again = true;
  _function: while (_again) {
    desc = parent = getter = undefined;
    _again = false;
    var object = _x,
      property = _x2,
      receiver = _x3;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  }
};

var _inherits = function(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

/**
 * Created by michaelsilvestre on 23/04/15
 */

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireDefault(_AbsAdapter2);

var MongooseAdapter = (function(_AbsAdapter) {
  function MongooseAdapter(callback) {
    _classCallCheck(this, MongooseAdapter);

    _get(Object.getPrototypeOf(MongooseAdapter.prototype), "constructor", this).call(this, "database");

    this.init(callback);
  }

  _inherits(MongooseAdapter, _AbsAdapter);

  _createClass(MongooseAdapter, [{
    key: "init",
    value: function init(callback) {
      var _this2 = this;

      var mongooseConfig = config.adapters.getConfig("database");

      this._mongoose = _mongoose2["default"];

      this._mongoose.connect(mongooseConfig.url);
      this._db = this._mongoose.connection;
      this._db.once("open", function() {
        console.log("mongoose successfull connected");
        callback(_this2);
      });
    }
  }, {
    key: "connection",
    get: function() {
      return this._db;
    }
  }, {
    key: "mongo",
    get: function() {
      return this._mongoose;
    }
  }]);

  return MongooseAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = MongooseAdapter;
module.exports = exports["default"];

//# sourceMappingURL=mongoose-adapter.js.map