import Education from '../../../handler/education'
import Experience from '../../../handler/experience'
import router from './router'

export default {
  Experience: router('experience', Experience),
  Education: router('education', Education)
}