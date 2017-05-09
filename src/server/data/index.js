import async from 'async'
import Dictionary from './models/dictionary'
import drop from './models/drop'
import Education from './models/education'
import Experience from './models/experience'
import Student from './models/student'
import Company from './models/company'
import Vacancy from './models/vacancy'
import OpenQuestion from './models/open_question'
import TestQuestion from './models/test_question'
import Admin from './models/admin'
import SkillComplexity from './models/skill_complexity'

async.waterfall([
  callback => drop(callback),
  callback => Dictionary.generate(err => callback(err)),
  callback => Admin(err => callback(err)),
  callback => Education(err => callback(err)),
  callback => Experience(err => callback(err)),
  callback => Student(err => callback(err)),
  callback => Company(err => callback(err)),
  callback => OpenQuestion.generate(err => callback(err)),
  callback => TestQuestion(err => callback(err)),
  callback => Vacancy(err => callback(err)),
  callback => SkillComplexity(err => callback(err))
], err => process.exit(err ? 1 : 0))
