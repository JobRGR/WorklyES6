import RestQuestion from '../utils/factory/rest-question'
import request from '../utils/request'

export default {
  OpenQuestionApi: new RestQuestion('open-question'),
  TestQuestionApi: new RestQuestion('test-question')
}