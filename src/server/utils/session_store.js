import session from 'express-session'
import mongoose from 'mongoose'
import connect from 'connect'
import sessionMongoosee from 'session-mongoose'
import config from '../config'

let sessionStore = sessionMongoosee(connect)
let store = new sessionStore({connection: mongoose.connection})

export default session({
  secret: config.session.secret,
  key: config.session.key,
  cookie: config.session.cookie,
  store
})
