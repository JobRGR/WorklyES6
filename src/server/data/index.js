import async from 'async'
import Dictionary from './models/dictionary'
import drop from './models/drop'
import Education from './models/education'
import Experience from './models/experience'
import Student from './models/student'
import OpenQuestion from './models/open_question'

async.waterfall([
  callback => drop(callback),
  callback => Dictionary.generate(err => callback(err)),
  callback => Education(err => callback(err)),
  callback => Experience(err => callback(err)),
  callback => Student(err => callback(err)),
  callback => OpenQuestion.generate(err => callback(err))
], err => process.exit(err ? 1 : 0))
