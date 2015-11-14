import routerService from '../../utils/router'
import Dictionaries from '../../handler/dictionary'

export default ['City', 'Skill', 'University', 'Speciality', 'Position'].reduce((memo, item) => {
  memo[item] = routerService(item.toLowerCase(), Dictionaries[item])
  return memo
}, {})