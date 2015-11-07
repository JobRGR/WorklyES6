import async from 'async'
import setUniversity from './university/data'
import setSpeciality from './speciality/data'

async.waterfall([
    callback => setUniversity(err => callback(err)),
    callback => setSpeciality(err => callback(err))
], err => process.exit(err ? 1 : 0))
