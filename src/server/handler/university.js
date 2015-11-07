import UniversityModel from '../modules/university'

class University {
  getItem(req, res, next) {
    UniversityModel.getItem(req.params.id, university => res.send({university}))
  }

  getAll(req, res, next) {
    UniversityModel.getItem(null, universities => res.send({universities}))
  }

  updateItem(req, res, next) {
    UniversityModel.updateItem(null, (err, university) => res.send({university}))
  }

  removeItem(req, res, next) {
    UniversityModel.getItem(req.params.id, err => res.send({ok: err && true}))
  }

  removeAll(req, res, next) {
    UniversityModel.getItem(null, err => res.send({ok: err && true}))
  }

  getCount(req, res, next) {
    UniversityModel.getCount(count => res.send({count}))
  }

  autocomplete(req, res, next) {
    UniversityModel.autocomplete(req.query.university, universities => res.send({universities}))
  }
}

export default new University()