import crypto from 'crypto'
import deepPopulate from '../../utils/deep_populate'
import mongoose from '../index'
import {removeItem, getCount, toJson} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  dob: {type: Date},
  telephone: {type: String},
  about: {type: String},
  education: [{type: mongoose.Schema.Types.ObjectId, ref: 'Education'}],
  experience: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experience'}],
  skill: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}],
  city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'},
  date: {type: Date, required: true, default: Date.now},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true}
})

schema.path('email').validate((value) => {
  let regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/
  return regex.test(value)
}, 'invalid_email')

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
    .populate('education')
    .populate('city')
    .populate('skill')
    .populate('experience')
    .exec((err, user) => {
      if (err) callback(err, null)
      else if (!user) callback(null, null)
      else if (!user.checkPassword(password)) callback(null, null)
      else callback(null, user)
    })
}

schema.statics.addItem = function ({name, email, dob, telephone, about, education, experience, skill, city, password}, callback) {
  let Student = this
  let student = new Student({name, email, dob, telephone, about, education, experience, skill, city, password})
  student.save(err => callback(err, student))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .deepPopulate(['education.speciality', 'experience.company', 'education.university', 'experience.position', 'city', 'skill'])
    .exec(callback)
  else this
    .find({})
    .deepPopulate(['education.speciality', 'experience.company', 'education.university', 'experience.position', 'city', 'skill'])
    .sort({'date': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  this.findById(id, (err, student) => {
    let check = (key, obj) => /education|city|experience|skill/.test(key) ? mongoose.Types.ObjectId(obj[key]) : obj[key]
    if (err) return callback(err)
    for (let key in  update)
      if (update[key]) {
        if (/education|experience|skill/.test(key) && !Array.isArray(update[key]))
          student.push(mongoose.Types.ObjectId(update[key]))
        else
          student[key] = check(key, update)
      }
    student.save(err => callback(err, student))
  })
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .deepPopulate(['education.speciality', 'experience.company', 'education.university', 'experience.position', 'city', 'skill'])
      .sort({'date': -1})
      .exec(callback)
  })
}

schema.statics.searchItem = function(search, callback) {
  this
    .find(search)
    .deepPopulate(['education.speciality', 'experience.company', 'education.university', 'experience.position', 'city', 'skill'])
    .sort({'date': -1})
    .exec(callback)
}

schema.methods.toJSON = toJson
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.plugin(deepPopulate)

export default mongoose.model('Student', schema)

