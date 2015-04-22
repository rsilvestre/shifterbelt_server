"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by michaelsilvestre on 20/04/15
 */

var _modelManager = require("../lib/model-manager.js");

var Application = function Application(name) {
    _classCallCheck(this, Application);

    this._name = name;
};

_modelManager.modelManager.model("Application", Application);

//# sourceMappingURL=application.js.map