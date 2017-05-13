import crypto from 'crypto'
import deepPopulate from '../../utils/deep_populate'
import mongoose from '../index'
import Company from '../company'
import Vacancy from '../vacancy'
import HttpError from '../../utils/error'
import async from 'async'
import {removeItem, getCount, toJson} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/
  },
  name: {type: String, required: true},
  avatar: {type: String},
  dob: {type: Date},
  telephone: {type: String},
  about: {type: String},
  educations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Education'}],
  experiences: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experience'}],
  skills: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}],
  city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'},
  recommendedVac: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true}
}, {timestamps: true})

const foreignKeys = ['educations.speciality', 'experiences.companyName', 'educations.university', 'experiences.position', 'city', 'skills']

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

function matchSkills(a,b) {
  for (let i = 0; i<b.length(); i++) {
    let skillExist = false;
    for (let j = 0; j<a.length(); j++)
      if (b[i] == a[j])
        skillExist = true;
    if (!skillExist) return false;
  }
  return true;
}

schema.path('email').validate((value, callback) => {
  Company.find({email: value}, (err, company)=>{
    callback(!err && !company.length)
  })
}, 'this email is already used by some company')

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
    .deepPopulate(foreignKeys)
    .exec((err, student) => {
      if (err) callback(err, null)
      else if (!student) callback(new HttpError(401, 'Not correct email'), null)
      else if (!student.checkPassword(password)) callback(new HttpError(401, 'Not correct password'), null)
      else callback(null, student)
    })
}

schema.statics.addItem = function ({name, email, dob, telephone, about, educations, experiences, skills, city, password, avatar}, callback) {
  let Student = this
  let student = new Student({name, email, dob, telephone, about, educations, experiences, skills, city, password, avatar})
  let studentsArray, vacanciesArray;
  let graph = [];

  async.series([
    function(cb1) {
      student.save(err => cb1(err))
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
          this.find({}, (err, students)=>{
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
        try_kuhn (v);
      }

      for (let i=0; i<k; i++)
        if (mt[i] != -1)
          vacanciesArray[i].recommendedVacancy = studentsArray[mt[i]]

      cb1()
    }

  ], function (err) {
  });
}

schema.statics.getItem = function (id, callback, skip = 0, limit = 100) {
  if (id) this
    .findById(id)
    .deepPopulate(foreignKeys)
    .exec(callback)
  else this
    .find({})
    .skip(skip)
    .limit(limit)
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  this.findById(id, (err, student) => {
    if (err || !student) return callback(err || new HttpError(400, 'Can not find student with such id'))
    this.updateOne(student, update, callback)
  })
}

schema.statics.updateOne = function (std, update, callback) {
  for (let key in  update) {
    if (update[key]) {
      if (key == 'city') std[key] = mongoose.Types.ObjectId(update[key])
      else std[key] = update[key]
    }
  }
  //---------------------------------------
  //---------------------------------------
  let studentsArray, vacanciesArray;
  let graph = [];

  async.series([
    function(cb1) {
      std.save(err => cb1(err))
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
          this.find({}, (err, students)=>{
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
        try_kuhn (v);
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
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .deepPopulate(foreignKeys)
      .sort({'updatedAt': -1})
      .exec(callback)
  })
}

schema.statics.searchItem = function(search, callback, skip = 0, limit = 100) {
  this
    .find(search)
    .skip(skip)
    .limit(limit)
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.changePassword = function(student, password, callback) {
  student.hashedPassword = student.encryptPassword(password)
  student.save(err => callback(err, student))
}


schema.statics.changeEmail = function (student, email, callback) {
  this.findOne({email}, (err, res) => {
    if (err) return callback(err)
    if (res) return res._id == student._id ? callback(null, res) : callback(new Error())
    student.email = email
    student.save(err => callback(err, student))
  })
}


schema.methods.toJSON = toJson
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.plugin(deepPopulate)

export default mongoose.model('Student', schema)

