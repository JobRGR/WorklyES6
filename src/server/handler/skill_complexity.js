import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {SkillComplexity} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('skillComplexity', SkillComplexity, false, false)

handler.addOne = (req, res, next) => {
  let {complexity} = req.body
  let {skill} = res
  let data = {complexity, skill: skill._id}
  SkillComplexity.addItem(data, (err, experience) => nextItem(err, experience, res, next))
}

handler.updateOne = (req, res, next) => {
  let {complexity} = req.body
  SkillComplexity.updateItem(req.params.id, {complexity}, (err, experience) => nextItem(err, experience, res, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (res.skill.length) search.skill = {$in: toObjectArray(res.skill)}
  if (!Object.keys(search).length) return nextItems(null, [], res, next)
  SkillComplexity.searchItems(search, (err, experiences) => nextItems(err, experiences, res, next))
}

export default handler
