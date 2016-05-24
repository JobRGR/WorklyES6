import DictionaryApi from './api/dictionary'
import AdminApi from './api/admin'
import UserApi from './api/user'
import VacancyApi from './api/vacancy'
import QuestionApi from './api/question'

const {CityApi, SkillApi, CompanyNameApi, PositionApi, SpecialityApi, UniversityApi} = DictionaryApi
const {CompanyApi, StudentApi} = UserApi
const {OpenQuestionApi, TestQuestionApi} = QuestionApi

export default {
  CityApi,
  SkillApi,
  CompanyNameApi,
  PositionApi,
  SpecialityApi,
  UniversityApi,
  AdminApi,
  VacancyApi,
  CompanyApi,
  StudentApi,
  OpenQuestionApi,
  TestQuestionApi
}