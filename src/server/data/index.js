import async from 'async'
import Dictionary from './models/dictionary'

async.waterfall([
  callback => Dictionary.generate(err => callback(err))
], err => process.exit(err ? 1 : 0))
