import async from 'async'
import {Skill, SkillComplexity} from '../../models/models'
import {skillsData} from './dictionary'
import {getSkillComplexity} from '../../utils/get_skill_complexity'
import addArray from '../utils/add_array'

let skills = []
let skillComplexity = []
let data = []

function check(name) {
  for (let i = 0; i < skillComplexity.length; i++) {
    if (!skillComplexity[i].skill) {
      continue
    }
    if (skillComplexity[i].skill.name === name) {
      return true
    }
  }
  return false
}

export default cb => async.waterfall([
  callback => SkillComplexity.getAll(res => {
    skillComplexity = res
    callback()
  }),
  callback => Skill.getAll(res => {
    skills = res
    callback()
  }),
  callback => async.each(skills, (item, next) => {
    if (check(item.name)) {
      return next()
    }
    getSkillComplexity(item.name)
      .then(complexity => {
        complexity && data.push({complexity, skill: item.id})
        next()
      })
  }, err => callback()),
], err => {
  if (data.length === skills.length) {
    return addArray(SkillComplexity, data, cb)
  }
  async.each(data, (name, callback) => {
    SkillComplexity.addItem(name, (err, item) => {
      err && console.log('[Error]:', err, item)
      callback()
    })
  }, err => {
    console.log(err || 'Successfully save data!')
    cb(err)
  })
})
