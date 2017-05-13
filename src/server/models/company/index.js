import crypto from 'crypto'
import mongoose from '../index'
import Student from '../student'
import Vacancy from '../vacancy'
import Company from '../company'
import HttpError from '../../utils/error'
import async from 'async'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, toJson} from '../../utils/model/helpers'

const foreignKeys = ['name', 'city']

let n;
let k;
let mt = [];
let used = [];

function try_kuhn(v) {
  if (used[v]) return false;
  used[v] = true;
  for (let i=0; i<g[v].size(); i++) {
    let to = g[v][i];
    if (mt[to] == -1 || try_kuhn(mt[to])) {
      mt[to] = v;
      return true;
    }
  }
  return false;
}

let {Schema} = mongoose
let schema = new Schema({
  email: {
    type: String, required: true, unique: true,
    match: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/
  },
  avatar: {type: String},
  name: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'CompanyName'},
  site: {type: String},
  about: {type: String},
  city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true}
}, {timestamps: { createdAt: ''}})

schema.path('email').validate((value, callback) => {
  Student.find({email: value}, (err, student)=>{
    callback(!err && !student.length)
  })
}, 'this email is already used by some student')

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

schema
  .virtual('password')
  .set(function(password) {
    this._plainPassword = password
    this.salt = `${Math.random()}`
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function() {
    return this._plainPassword
  })

schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword
}

schema.statics.authorize = function ({email, password}, callback) {
  this
    .findOne({email})
    .populate(foreignKeys)
    .exec((err, company) => {
      if (err) callback(err, null)
      else if (!company) callback(new HttpError(401, 'Not correct email'), null)
      else if (!company.checkPassword(password)) callback(new HttpError(401, 'Not correct password'), null)
      else callback(null, company)
    })
}

schema.statics.addItem = function ({name, email, site, about, city, password, avatar}, callback) {
  let Company = this
  let company = new Company({name, email, site, about, city, password, avatar})
  //---------------------------------------
  //---------------------------------------
  let studentsArray, vacanciesArray;
  let graph = [];

  async.series([
    function(cb1) {
      company.save(err => cb1(err))
    },

    function(cb1) {
      async.parallel([
        function(cb2) {
          Vacancy.find({}, (err, vacancies)=>{
            vacanciesArray = vacancies
            cb2()
          })
        },
        function(cb2) {
          Student.find({}, (err, students)=>{
            studentsArray = students
            cb2()
          })
        }
      ], function (err) {
      });
      cb1();
    },

    function(cb1) {
      graph.resize(studentsArray.length());

      for (let i = 0; i < studentsArray.length(); i++)
        for (let j = 0; j < vacanciesArray.length(); j++)
          if (matchSkills(studentsArray[i].skills,vacanciesArray[j].skills))
            graph[i].push(j);

      n = studentsArray.length();
      k = vacanciesArray.length();
      mt.resize(k); for (let i = 0; i<k; i++) mt[i] = -1;
      used.resize(n);

      for (let v=0; v<n; v++) {
        for (let i = 0; i<n; i++) used[i] = false;
        try_kuhn(v);
      }
      for (let i=0; i<k; i++)
        if (mt[i] != -1)
          vacanciesArray[i].recommendedVacancy = studentsArray[mt[i]]
      cb1()
    }

  ], function (err) {
  });
  //---------------------------------------
  //---------------------------------------
}

schema.statics.getItem = function (id, callback, skip, limit) {
  return getPopulate.apply(this, [id, callback, foreignKeys, skip, limit])
}

schema.statics.updateItem = function (id, update, callback) {
  this.findById(id, (err, company) => {
    if (err || !company) return callback(err || new HttpError(400, 'Can not find company with such id'))
    this.updateOne(company, update, callback)
  })
}

schema.statics.updateOne = function(company, update, callback) {
  for (let key in update)
    if (/site|about|city/.test(key) == false)
      delete update[key]
  for (let key in  update)
    company[key] = key == 'city' ?
      mongoose.Types.ObjectId(update[key]) :
      update[key]
  //---------------------------------------
  //---------------------------------------
  let studentsArray, vacanciesArray;
  let graph = [];

  async.series([
    function(cb1) {
      company.save(err => cb1(err))
    },

    function(cb1) {
      async.parallel([
        function(cb2) {
          Vacancy.find({}, (err, vacancies)=>{
            vacanciesArray = vacancies
            cb2()
          })
        },
        function(cb2) {
          Student.find({}, (err, students)=>{
            studentsArray = students
            cb2()
          })
        }
      ], function (err) {
      });
      cb1();
    },

    function(cb1) {
      graph.resize(studentsArray.length());

      for (let i = 0; i < studentsArray.length(); i++)
        for (let j = 0; j < vacanciesArray.length(); j++)
          if (matchSkills(studentsArray[i].skills,vacanciesArray[j].skills))
            graph[i].push(j);

      n = studentsArray.length();
      k = vacanciesArray.length();
      mt.resize(k); for (let i = 0; i<k; i++) mt[i] = -1;
      used.resize(n);

      for (let v=0; v<n; v++) {
        for (let i = 0; i<n; i++) used[i] = false;
        try_kuhn(v);
      }
      for (let i=0; i<k; i++)
        if (mt[i] != -1)
          vacanciesArray[i].recommendedVacancy = studentsArray[mt[i]]
      cb1()
    }

  ], function (err) {
  });
  //---------------------------------------
  //---------------------------------------
}

schema.statics.getRandom = function(callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItem = function(search, callback, skip, limit) {
  return searchPopulate.apply(this, [search, callback, foreignKeys, skip, limit])
}

schema.statics.changePassword = function(company, password, callback) {
  company.hashedPassword = company.encryptPassword(password)
  company.save(err => callback(err, company))
}

schema.statics.changeEmail = function (company, email, callback) {
  this.findOne({email}, (err, res) => {
    if (err) return callback(err)
    if (res) return res._id == company._id ? callback(null, res) : callback(new Error())
    company.email = email
    company.save(err => callback(err, company) )
  })
}

schema.methods.toJSON = toJson
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Company', schema)

