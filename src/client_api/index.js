import DictionaryApi from './api/dictionary'
import AdminApi from './api/admin'
import UserApi from './api/user'

const {CityApi, SkillApi, CompanyNameApi, PositionApi, SpecialityApi, UniversityApi} = DictionaryApi
const {CompanyApi, StudentApi} = UserApi

export default {
  CityApi,
  SkillApi,
  CompanyNameApi,
  PositionApi,
  SpecialityApi,
  UniversityApi,
  AdminApi,
  CompanyApi,
  StudentApi
}