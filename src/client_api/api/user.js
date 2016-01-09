import RestUser from '../utils/factory/rest-user'
import request from '../utils/request'

export default {
  CompanyApi: new RestUser('company'),
  StudentApi: new RestUser('student')
}