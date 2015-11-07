import mongoose from 'mongoose'
import config from '../config'

mongoose.connect(config.uri)
export default mongoose
