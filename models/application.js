/**
 * Created by michaelsilvestre on 23/04/15
 */

/**
 * Module dependencies.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _token = require('token');

var _token2 = _interopRequireDefault(_token);

_token2['default'].defaults.secret = 'uj1k9iEq7LYNCFlLU0AZS2MEfYKGVVif8OpPBNc1';
_token2['default'].defaults.timeStep = 24 * 60 * 60; // 24h in seconds

var Schema = _mongoose2['default'].Schema;

var makeSalt = function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + '';
};

var encryptPassword = function encryptPassword(password) {
  if (!password) return '';
  try {
    return _crypto2['default'].createHmac('sha1', this.salt).update(password).digest('hex');
  } catch (err) {
    return '';
  }
};

var Generator = function Generator(preSave) {

  if (false === this instanceof Generator) {
    return new Generator(preSave);
  }

  var Application = _mongoose2['default'].model('Application');

  this.businessId = function (cb) {
    var businessId = makeSalt();
    Application.find({ 'businessId': businessId }).select('businessId').exec(function (err, result) {
      if (err) return cb(err);

      if (result.length > 0) {
        return generate(cb);
      }
      preSave.businessId = businessId;
      cb();
    });
  };

  this.keys = function (cb) {
    'use strict';

    var keyGen = function keyGen(type) {
      return {
        role: type,
        key: _crypto2['default'].createHmac('sha1', Math.random().toString()).update(new Date().valueOf().toString()).digest('hex').substring(0, 40),
        passwd: _token2['default'].generate(new Date().valueOf().toString() + '|' + Math.random().toString()).substring(0, 80)
      };
    };
    preSave.keys.push(new keyGen('master'));
    preSave.keys.push(new keyGen('manager'));
    preSave.keys.push(new keyGen('slave'));
    cb();
  };
};
/**
 * Getter
 */

var getBusinessId = function getBusinessId(businessId) {
  'use strict';
  return businessId;
};

/**
 * Setter
 */

var setBusinessId = function setBusinessId(businessId) {
  'use strict';
  if (this.isNew) {
    return businessId;
  }
  return this.businessId;
};

/**
 * Application Schema
 */

var ApplicationSchema = new Schema({
  name: { type: String, required: true, trim: true, index: true, unique: 'Name cannot be blank' },
  businessId: { type: String, index: true, unique: true },
  strategy: { type: String, required: 'The strategy has not been defined', 'enum': ['direct', 'work'] },
  users: [{
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, 'enum': ['owner', 'manager', 'invited'] },
    createdAt: { type: Date, 'default': Date.now }
  }],
  createdAt: { type: Date, 'default': Date.now },
  keys: [{
    role: { type: String, required: true, 'enum': ['master', 'manager', 'slave'] },
    key: { type: String, required: true },
    passwd: { type: String, required: true },
    createdAt: { type: Date, 'default': Date.now },
    status: { type: String, 'default': 'active', 'enum': ['active', 'inactive', 'revoked'] }
  }]
});

/**
 * Virtuals
 */

/**
 * Validations
 */

/**
 * Pre-save hook
 */

ApplicationSchema.pre('save', function (next) {
  'use strict';

  if (!this.isNew) {
    return next();
  }

  var generator = new Generator(this);

  generator.businessId(function () {
    generator.keys(next);
  });
});

/**
 * Methods
 */

ApplicationSchema.methods = {
  addUser: function addUser(user, role, cb) {
    'use strict';
    var notify = require('../mailer');
    this.users.push({
      user: user._id,
      role: role
    });

    notify.createApplication({
      application: this,
      currentUser: user
    });

    this.save(cb);
  }, /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

  authenticate: function authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: makeSalt,

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: encryptPassword
};

/**
 * Statics
 */
ApplicationSchema.statics = {
  /**
   *
   * @param id
   * @param cb
   * @api public
   */
  load: function load(id, user, cb) {
    'use strict';
    this.findOne({ businessId: id }).populate('users.user', 'name email username').exec(cb);
  },

  list: function list(options, cb) {
    'use strict';

    var criteria = options.criteria || {};

    this.find(criteria).populate('users.user', 'name email username').exec(cb);
  },

  /**
   *
   * @param businessId
   * @param cb
   * @api public
   */
  selectByBusinessId: function selectByBusinessId(businessId, cb) {
    'use strict';
    this.findOne({ businessId: businessId }).populate('users.user', 'name email username').select('name').exec(cb);
  },

  /**
   *
   * @param businessId
   * @param cb
   * @api public
   */
  authenticate: function authenticate(data, cb) {
    'use strict';
    this.findOne({ businessId: data.applicationId }).exec(function (err, result) {
      if (err) {
        return cb(err);
      }
      if (!result) {
        return cb(new Error('There is no result'));
      }
      var keys = result.keys.filter(function (value) {
        return value.key === data.key && value.passwd === data.password;
      });
      cb(null, {
        application: {
          id: result._id,
          businessId: result.businessId,
          strategy: result.strategy
        },
        device: {
          macAddress: data.macAddress.replace(/:/g, ''),
          role: keys[0].role || ''
        }
      });
    });
  }
};

//mongoose.model('Application', ApplicationSchema);
var Application = _mongoose2['default'].model('Application', ApplicationSchema);

//import mongoose from "mongoose";
//
//let applicationSchema = new mongoose.Schema({
//  name: { type: String, required: true, unique: true },
//  businessId: { type: String, required: true, unique: true },
//  users: [{
//    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    role: { type: String, required: true, enum: ["owner", "manager", "invited"] }
//  }],
//  createdAt: { type: Date, default: Date.now },
//  keys: [{
//    role: { type: String, required: true, enum: ["master", "manager", "slave"] },
//    key: { type: String, required: true },
//    passwd: { type: String, required: true }
//  }]
//});
//
//applicationSchema.index({ name: 1 });
//
//applicationSchema.statics.selectApplicationByName = function(name, callback) {
//  return this.findOne({ name: name }, callback);
//};
//
//applicationSchema.statics.selectAll = function(callback) {
//  return this.find({}, callback);
//};
//
//export let Application = mongoose.model('Application', applicationSchema);
//
//Application.schema.path('name').validate((value) => {
//  return (value.length >= 4 && value.length <= 20);
//}, "The size of the field should be between 4 and 20 characters");
//
//Application.schema.path('keys').validate((value) => {
//  return value.length < 3;
//}, 'Invalid number of Keys is less than 3');
//
//Application.schema.path('users').validate((value) => {
//  return value.length < 1;
//}, "Invalid users list. Should be at least 1 user");
exports.Application = Application;

//# sourceMappingURL=application.js.map