import async from 'async'
import setUniversity from './university/data'

async.waterfall([
    callback => setUniversity(err => callback(err))
], err => process.exit(err ? 1 : 0))
