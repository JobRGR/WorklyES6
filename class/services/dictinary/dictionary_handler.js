import Handler from 'handler'
import City from './city/model'
import Skill from './skill/model'
import University from './university/model'
import Speciality from './speciality/model'
import Position from './position/model'

export default ['City', 'Skill', 'University', 'Speciality', 'Position'].reduce((memo, item) => {
  memo[item] = new Handler(item.toLowerCase(), Dictionaries[item])
  return memo
}, {})
