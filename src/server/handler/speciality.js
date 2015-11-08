import SpecialityModel from '../modules/speciality'

class Speciality {
  getItem(req, res, next) {
    SpecialityModel.getItem(req.params.id, speciality => res.send({speciality}))
  }

  getAll(req, res, next) {
    SpecialityModel.getItem(null, specialities => res.send({specialities}))
  }

  addItem(req, res, next) {
    SpecialityModel.addItem(req.body.name, (err, speciality) => res.send({speciality}))
  }

  updateItem(req, res, next) {
    SpecialityModel.updateItem(req.params.id, req.body.name, (err, speciality) => res.send({speciality}))
  }

  removeItem(req, res, next) {
    SpecialityModel.removeItem(req.params.id, err => res.send({ok: err || true}))
  }

  removeAll(req, res, next) {
    SpecialityModel.removeItem(null, err => res.send({ok: err || true}))
  }

  getCount(req, res, next) {
    SpecialityModel.getCount(count => res.send({count}))
  }

  autocomplete(req, res, next) {
    SpecialityModel.autocomplete(req.query.speciality, specialities => res.send({specialities}))
  }
}

export default new Speciality()