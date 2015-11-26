import mongoose from 'mongoose'
import config from '../../config'

export default cb => {
  mongoose.connect(config.uri, () => {
    mongoose.connection.db.dropDatabase()
    cb()
  })
}