import Charlatan from 'charlatan'
import async from 'async'
import {Education, Experience, Skill, City, Student} from '../../models/models'
import addArray from '../utils/add_array'
import random from '../utils/random'

let data = []

for (let i = 0; i < 100; i++) {
  let name = Charlatan.Name.name()
  let email = `${name.toLowerCase().split(' ').join('.')}.${Charlatan.Internet.email()}`
  data.push({
    email, name,
    telephone: Charlatan.PhoneNumber.cellPhone(),
    about: Charlatan.Lorem.text(3, 20, '\n'),
    dob: Charlatan.Date.birthday(18, 25),
    skill: [], city: '', password: '1111',
    education: [], experience: []
  })
}

export default (cb) => async.waterfall([
  callback => async.each(data, (item, next) => City.getRandom((err, city) => {
    item.city = city._id
    next()
  }), err => callback()),
  callback => Skill.getItem(null, (err, skills) => {
    for (let i = 0; i < data.length;i++) {
      let count = Math.floor(Math.random() * 15)
      for (let j = 0; j < count; j++)
        data[i].skill.push(random(skills)._id)
    }
    callback()
  }),
  callback => Education.getItem(null, (err, educations) => {
    let j = 0
    for (let i = 0; i < data.length; i++) {
      data[i].education.push(educations[i]._id)
      j++
      data[i].education.push(educations[i]._id)
      j++
    }
    callback()
  }),
  callback => Experience.getItem(null, (err, experience) => {
    let j = 0
    for (let i = 0; i < data.length; i++) {
      data[i].experience.push(experience[i]._id)
      j++
      data[i].experience.push(experience[i]._id)
      j++
    }
    callback()
  })
], err => addArray(Student, data, cb))
