/**
 * Created by michaelsilvestre on 24/04/15
 */

import mongoose from "mongoose";

let Schema = mongoose.Schema;

let validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

let userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  name: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  tariffPlan: { type: String, default: '', enum: ['', 'plan1', 'plan2', 'plan3', 'plan4', 'plan5', 'custom'] },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {},
  applications: [{ applicationId: { type: mongoose.Schema.ObjectId, ref: "Application" } }],
  firstname: { type: String },
  lastname: { type: String },
  phonenumber: { type: String },
  addresses: [{
    typeAddress: { type: String },
    street: { type: String },
    number: { type: String },
    town: { type: String },
    postcode: { type: String },
    country: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  tariff: {
    tariffId: { type: Schema.ObjectId, ref: 'Tariff' }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });

export let User = mongoose.model('User', userSchema);

