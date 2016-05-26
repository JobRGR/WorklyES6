export const count = 15

export const defaultState = {
  data: [],
  error: false,
  loading: false,
  count
}

export const students = 'students'
export const vacancies = 'vacancies'
export const companies = 'companies'

export let short = (text = '', length) => {
  if (text.length < length) {
    return text
  }
  let str = text.split('').splice(0, length).join('')
  const lastIndex = str.lastIndexOf(' ')
  const res = str.substring(0, lastIndex)
  return `${res}${res[res.length - 1] != '.' ? '...' : ''}`
}

export let getType = active => {
  switch (active) {
    case vacancies: return 'вакансії'
    case companies: return 'компанії'
    case students: return 'студенти'
  }
}

export let toAvatar = name => name
  .trim()
  .split(' ')
  .splice(0, 2)
  .map(x => x.charAt(0))
  .join('')
  .toUpperCase()

export let check = (value, search) => value.toLowerCase().includes(search.toLowerCase())

export let searchStudent = (search, student) =>
  search
    .toLowerCase()
    .split(' ')
    .some(search =>
      check(student.name, search)
      || check(student.email, search)
      || (student.city && check(student.city.name, search))
      || student.skills.some(({name}) => check(name, search))
      || student.experiences.some(({companyName, position}) =>
        check(companyName.name, search) || check(position.name, search)
      )
      || student.educations.some(({speciality, university}) =>
        check(speciality.name, search) || check(university.name, search)
      )
    )

export let searchVacancy = (search, vacancy) =>
  search
    .toLowerCase()
    .split(' ')
    .some(search =>
      check(vacancy.name, search)
      || (vacancy.city && check(vacancy.city.name, search))
      || check(vacancy.company.name.name, search)
      || vacancy.skills.some(({name}) => check(name, search))
    )

export let searchCompany = (search, company) =>
  search
    .toLowerCase()
    .split(' ')
    .some(search =>
      check(company.name.name, search)
      || (company.city && check(company.city.name, search))
    )

export let getVacancy = experiences => {
  if (!experiences || !Array.isArray(experiences) || !experiences.length) {
    return null
  }
  const {position} = experiences[experiences.length - 1]
  return !position || !position.name ? null : position.name
}
