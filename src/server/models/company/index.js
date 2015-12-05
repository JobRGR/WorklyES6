import crypto from 'crypto'
import mongoose from '../index'
import Student from '../student'
import {removeItem, getCount, toJson} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/
  },
  name: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'CompanyName'},
  site: {type: String},
  about: {type: String},
  city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'},
  date: {type: Date, required: true, default: Date.now},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true}
})

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
    .populate('name')
    .populate('city')
    .exec((err, company) => {
      if (err) callback(err, null)
      else if (!company) callback(null, null)
      else if (!company.checkPassword(password)) callback(null, null)
      else callback(null, company)
    })
}

schema.statics.addItem = function ({name, email, site, about, city, password}, callback) {
  let Company = this
  let company = new Company({name, email, site, about, city, password})
  company.save(err => callback(err, company))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .populate('name')
    .populate('city')
    .exec(callback)
  else this
    .find({})
    .populate('name')
    .populate('city')
    .sort({'date': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  this.findById(id, (err, company) => {
    for (let key in  update)
        company[key] = /city|name/.test(key) ?
          mongoose.Types.ObjectId(update[key]) :
          update[key]
    company.save(err => callback(err, company))
  })
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate('name')
      .populate('city')
      .sort({'date': -1})
      .exec(callback)
  })
}

schema.statics.searchItem = function(search, callback) {
  this
    .find(search)
    .populate('name')
    .populate('city')
    .sort({'date': -1})
    .exec(callback)
}

schema.statics.changeMyPassword = function(company, password, callback) {
  company.hashedPassword = company.encryptPassword(password)
  company.save(err => callback(err, company))
}

schema.statics.changePassword = function(id, password, callback) {
  this.findById(id, (err, company) => {
    if (err || !company) return callback(err || new Error())
    this.changeMyPassword(company, password, callback)
  })
}

schema.statics.changeMyEmail = function (company, email, callback) {
  this.findOne({email}, (err, res) => {
    if (err) return callback(err)
    if (res) return res._id == company._id ? callback(null, res) : callback(new Error())
    company.email = email
    company.save(err => callback(err, company) )
  })
}

schema.statics.changeEmail = function (id, email, callback) {
  this.findById(id, (err, company) => {
    if (err || !company) return callback(err || new Error())
    this.changeMyEmail(company, email, callback)
  })
}

schema.methods.toJSON = toJson
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Company', schema)

