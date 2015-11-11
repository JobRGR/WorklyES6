import routerService from '../utils/router'
import Dictionaries from '../models/models'

export default ['City', 'Skill', 'University', 'Speciality'].reduce((memo, item) => {
  memo[item] = routerService(item.toLowerCase(), Dictionaries[item])
  return memo
}, {})
