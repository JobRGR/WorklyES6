import async from 'async'
import setUniversity from './university/data'
import setSpeciality from './speciality/data'
import setCity from './city/data'
import setSkill from './skill/data'

async.waterfall([
    callback => setUniversity(err => callback(err)),
    callback => setSpeciality(err => callback(err)),
    callback => setCity(err => callback(err)),
    callback => setSkill(err => callback(err))
], err => process.exit(err ? 1 : 0))
