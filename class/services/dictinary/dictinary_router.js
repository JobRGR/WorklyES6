import router from 'router'
import Dictionaries from './dictionary_handler'

export default ['City', 'Skill', 'University', 'Speciality', 'Position'].reduce((memo, item) => {
  memo[item] = router(item.toLowerCase(), Dictionaries[item])
  return memo
}, {})
