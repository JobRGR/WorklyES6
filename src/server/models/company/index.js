import crypto from 'crypto'
import mongoose from '../index'
import Student from '../student'
import HttpError from '../../utils/error'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, toJson, getAllPopulate} from '../../utils/model/helpers'

const foreignKeys = ['name', 'city']

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
  company.save(err => callback(err, company))
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
  company.save(err => callback(err, company))
}

schema.statics.getRandom = function(callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItem = function(search, callback, skip, limit) {
  return searchPopulate.apply(this, [search, callback, foreignKeys, skip, limit])
}

schema.statics.getAll = function(callback) {
  return getAllPopulate.apply(this, [callback, foreignKeys])
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

