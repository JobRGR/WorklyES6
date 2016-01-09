import Statistic from '../statistic'

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
    let {name, date} = req.body
    res.send({pie: statistic.pie(name, date)})
  },

  getGraph(req, res, next) {
    let statistic = new Statistic()
    let {name, type} = req.body
    res.send({graph: statistic.graph(name, type)})
  }
}
