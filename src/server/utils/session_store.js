import connect from 'connect'
import mongoose from 'mongoose'
import sessionMongoose from 'session-mongoose'
import session from 'express-session'
import config from '../config'

let SessionStore = sessionMongoose(connect)
let store = new SessionStore({connection: mongoose.connection})

export default session({
  secret: config.session.secret,
  key: config.session.key,
  cookie: config.session.cookie,
  store
})
