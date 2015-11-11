import async from 'async'
import Dictionary from './models/dictionary'
import Education from './models/education'

async.waterfall([
  callback => Dictionary.generate(err => callback(err)),
  callback => Education(err => callback(err))
], err => process.exit(err ? 1 : 0))
