import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import toObjectArray from '../utils/to_object_array'
import HttpError from '../utils/error'
import {Student, City, Skill, Position, CompanyName, Education, University, Speciality} from '../models/models'

let {nextItem, nextItems} = new Next('student')
let handler = new Handler('student', Student)

let saveSession = (err, student, req, res, next) => {
  if (!err && student) req.session._student = student._id
  else if (!err) err = new HttpError(401)
  nextItem(err, student, res, next)
}

handler.addItem = (req, res, next) => {
  let {email, password, name} = req.body
  Student.addItem({email, password, name}, (err, student) => saveSession(err, student, req, res, next))
}

handler.initUser = (req, res, next) => {
  if (req.params.id) {
    Student.getItem(req.params.id, (err, student) => {
      if (err || !student) next(err || new HttpError(400, 'Can not find student with such id'))
      req.student = student
      next()
    })
  }
  else {
    req.student = req._student
    next()
  }
}

handler.login = (req, res, next) => Student.authorize(req.body, (err, student) => saveSession(err, student, req, res, next))
handler.getStudent = (req, res, next) => nextItem(null, req._student, res, next)

handler.autoLogin = (req, res, next) =>
  Student.getItem(req.params.id, (err, student) => saveSession(err, student, req, res, next))

function getSearch(req, res) {
  let search = {}
  if (req.body.age) search.dob = getDate(req.body.age.min, req.body.age.max)
  if (req.body.email) search.email = req.body.email
  if (req.body.name) search.name = req.body.name
  if (res.cities && res.cities.length) search.city = {$in: toObjectArray(res.cities)}
  if (res.skills && res.skills.length) search.skills = {$in: toObjectArray(res.skills)}
  if (res.educations && res.educations.length) search.educations = {$in: toObjectArray(res.educations)}
  if (res.experiences && res.experiences.length) search.experiences = {$in: toObjectArray(res.experiences)}
  return search
}


handler.searchItems = (req, res, next) => {
  const search = getSearch(req, res)
  Student.searchItem(search, (err, students) => nextItems(err, students, res, next))
}

handler.searchByUniversity = (req, res, next) => Student.getCount((err, count) => {
  const search = getSearch(req, res)
  Student.searchItem(search, (err, students) => {
    let countCur = 0
    const groupStudent = students.reduce((memo, student) => {
      if (Array.isArray(student.educations)) {
        student.educations.forEach(({university}) => {
          if (memo[university.name]) memo[university.name].count++
          else memo[university.name] = {count: 1}
          countCur++
        })
      }
      else {
        if (memo.other) memo[university.name].count++
        else memo.other = {count: 1}
      }
      return memo
    }, {})
    for(let key in groupStudent) {
      groupStudent[key].fromAll = groupStudent[key].count * 100 / count
      groupStudent[key].fromCurrent = groupStudent[key].count * 100 / countCur
    }
    res.send({students: groupStudent})
  })
})

handler.updateItem = (req, res, next) => {
  let data = ['dob', 'telephone', 'name', 'about'].reduce((memo, key) => {
    if (req.body[key]) memo[key] = req.body[key]
    return memo
  }, {})
  if (res.city) data.city = res.city._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  if (res.educations) data.educations = toObjectArray(res.educations)
  if (res.experiences) data.experiences = toObjectArray(res.experiences)
  Student.updateOne(req.student, data, (err, student) => nextItem(err, student, res, next))
}

handler.changePassword = (req, res, next) => Student.changePassword(req.student, req.body.password, err => res.send({ok: err || true}))
handler.changeEmail = (req, res, next) => Student.changeEmail(req.student, req.body.email, err => res.send({ok: err || true}))

handler.sendRecommended = (req, res, next) => {
  let currentId = req.student._id

  let n;
  let k;
  let mt = [];
  let used = [];

  const studentsArray = res.students, vacanciesArray = res.vacancies;
  let graph = new Array(studentsArray.length);
  for (let i = 0; i<graph.length; i++) graph[i] = [];

  for (let i = 0; i < studentsArray.length; i++)
    for (let j = 0; j < vacanciesArray.length; j++)
      if (matchSkills(studentsArray[i].skills,vacanciesArray[j].skills))
        graph[i].push(j);

  n = studentsArray.length;
  k = vacanciesArray.length;

  for (let i = 0; i<k; i++) mt.push(-1);
  for (let i = 0; i<n; i++) used.push(false);

  for (let v=0; v<n; v++) {
    for (let i = 0; i<n; i++) used[i] = false;
    try_kuhn(v);
  }
  for (let i=0; i<k; i++){
    if (mt[i] != -1) console.log("not -1")
    if (mt[i] != -1 && studentsArray[mt[i]]._id.toString() == currentId.toString()) {
      console.log("not -1 + id")
      res.send(vacanciesArray[i])
      return
    }
  }

  res.send({_id: null})

  function try_kuhn(v) {
    if (used[v] || !graph[v]) return false;
    used[v] = true;
    for (let i=0; i<graph[v].length; i++) {
      let to = graph[v][i];
      if (mt[to] == -1 || try_kuhn(mt[to])) {
        mt[to] = v;
        return true;
      }
    }
    return false;
  }

  function matchSkills(a,b) {
    for (let i = 0; i<b.length; i++) {
      let skillExist = false;
      for (let j = 0; j<a.length; j++)
        if (b[i].toString() == a[j].toString())
          skillExist = true;
      if (!skillExist) return false;
    }
    return true;
  }

}

export default handler
