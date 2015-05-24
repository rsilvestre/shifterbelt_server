/**
 * Created by michaelsilvestre on 23/04/15
 */

/**
 * Module dependencies.
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import token from 'token';

token.defaults.secret = 'uj1k9iEq7LYNCFlLU0AZS2MEfYKGVVif8OpPBNc1';
token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds

let Schema = mongoose.Schema;

let makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
};

let encryptPassword = function(password) {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
};

let Generator = function(preSave) {

  if (false === (this instanceof Generator)) {
    return new Generator(preSave);
  }

  let Application = mongoose.model('Application');

  this.businessId = function(cb) {
    let businessId = makeSalt();
    Application.find({ 'businessId': businessId })
      .select('businessId')
      .exec(function(err, result) {
        if (err) return cb(err);

        if (result.length > 0) {
          return generate(cb);
        }
        preSave.businessId = businessId;
        cb();
      });
  };

  this.keys = function(cb) {
    "use strict";

    let keyGen = function(type) {
      return {
        role: type,
        key: crypto.createHmac('sha1', Math.random().toString()).update((new Date()).valueOf().toString()).digest('hex').substring(0, 40),
        passwd: token.generate((new Date()).valueOf().toString() + '|' + Math.random().toString()).substring(0, 80)
      }
    };
    preSave.keys.push(new keyGen("master"));
    preSave.keys.push(new keyGen("manager"));
    preSave.keys.push(new keyGen("slave"));
    cb();
  }

};
/**
 * Getter
 */

let getBusinessId = function(businessId) {
  "use strict";
  return businessId;
};

/**
 * Setter
 */

let setBusinessId = function(businessId) {
  "use strict";
  if (this.isNew) {
    return businessId;
  }
  return this.businessId;
};

/**
 * Application Schema
 */

let ApplicationSchema = new Schema({
  name: { type: String, required: true, trim: true, index: true, unique: "Name cannot be blank" },
  businessId: { type: String, index: true, unique: true },
  strategy: { type: String, required: 'The strategy has not been defined', enum: ['direct', 'work'] },
  users: [{
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, enum: ["owner", "manager", "invited"] }
  }],
  createdAt: { type: Date, default: Date.now },
  keys: [{
    role: { type: String, required: true, enum: ["master", "manager", "slave"] },
    key: { type: String, required: true },
    passwd: { type: String, required: true }
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

ApplicationSchema.pre('save', function(next) {
  "use strict";

  if (!this.isNew) {
    return next();
  }


  let generator = new Generator(this);

  generator.businessId(function() {
    generator.keys(next);
  });


});

/**
 * Methods
 */

ApplicationSchema.methods = {
  addUser: function(user, role, cb) {
    "use strict";
    let notify = require('../mailer');
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

  authenticate: function(plainText) {
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
  load: function(id, user, cb) {
    "use strict";
    this.findOne({ businessId: id })
      .populate('users.user', 'name email username')
      .exec(cb);
  },

  list: function(options, cb) {
    "use strict";

    let criteria = options.criteria || {};

    this.find(criteria)
      .populate('users.user', 'name email username')
      .exec(cb);
  },

  /**
   *
   * @param businessId
   * @param cb
   * @api public
   */
  selectByBusinessId: function(businessId, cb) {
    "use strict";
    this.findOne({ businessId: businessId })
      .populate('users.user', 'name email username')
      .select('name')
      .exec(cb);
  },

  /**
   *
   * @param businessId
   * @param cb
   * @api public
   */
  authenticate: function(data, cb) {
    "use strict";
    this.findOne({ businessId: data.applicationId })
      .exec((err, result) => {
        if (err) {
          return cb(err);
        }
        if (!result) {
          return cb(new Error("There is no result"));
        }
        let keys = result.keys.filter((value) => {
          return value.key === data.key && value.passwd === data.password
        });
        cb(null, {
          applicationId: result._id,
          strategy: result.strategy,
          role: keys[0].role || ""
        });
      });
  }
};

//mongoose.model('Application', ApplicationSchema);
export let Application = mongoose.model('Application', ApplicationSchema);


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



