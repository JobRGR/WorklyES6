import crypto from 'crypto'
import mongoose from '../index'
import HttpError from '../../utils/error'
import {toJson, removeItem} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  name: {type: String, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true}
}, { timestamps: true})


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

schema.statics.authorize = function ({name, password}, callback) {
  this.findOne({name}, (err, admin) => {
    if (err) callback(err, null)
    else if (!admin) callback(new HttpError(401, 'Not correct name'), null)
    else if (!admin.checkPassword(password)) callback(new HttpError(401, 'Not correct password'), null)
    else callback(null, admin)
  })
}

schema.statics.addItem = function ({name, password}, callback) {
  let Admin = this
  let admin = new Admin({name, password})
  admin.save(err => callback(err, admin))
}

schema.statics.removeItem = removeItem
schema.methods.toJSON = toJson

export default mongoose.model('Admin', schema)

