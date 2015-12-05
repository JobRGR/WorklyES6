import Handler from '../utils/handler'
import Dictionaries from '../models/models'

export default ['City', 'Skill', 'University', 'Speciality', 'Position'].reduce((memo, item) => {
  memo[item] = new Handler(item.toLowerCase(), Dictionaries[item])
  return memo
}, {})
