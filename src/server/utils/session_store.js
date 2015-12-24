import session from 'express-session'
import mongoose from 'mongoose'
import connect from 'connect'
import sessionMongoosee from 'session-mongoose'
import config from '../config'

let sessionStore = sessionMongoosee(connect)
let store = new sessionStore({connection: mongoose.connection})
let {secret, key, cookie, resave, saveUninitialized} = config.session

export default session({secret, key, cookie, resave, saveUninitialized, store})
