import Statistic from './model'

export default {
  getItem(req, res, next) {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({statistic: statistic.getItem(name, {url, status, type, ip, date, time})})
  },

  getCount(req, res, next) {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({value: statistic.getCount(name, {url, status, type, ip, date, time})})
  },

  getCountType(req, res, next) {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({value: statistic.getCountType(name, {url, status, type, ip, date, time})})
  },

  getPie(req, res, next) {
    let statistic = new Statistic()
    let {name, date, error} = req.body
    res.send({pie: statistic.getPie(name, date, error)})
  },

  getGraph(req, res, next) {
    let statistic = new Statistic()
    let {name, type, error} = req.body
    res.send({graph: statistic.getGraph(name, type, error)})
  },

  getMultiGraph(req, res, next) {
    let statistic = new Statistic()
    let {names, type, error} = req.body
    res.send({graph: statistic.getMultiGraph(names, type, error)})
  }
}
