import Statistic from '../statistic'

export default {
  getItem: (req, res, next) => {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({statistic: statistic.getItem(name, {url, status, type, ip, date, time})})
  },

  getCount: (req, res, next) => {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({value: statistic.getCount(name, {url, status, type, ip, date, time})})
  },

  getCountType: (req, res, next) => {
    let statistic = new Statistic()
    let {name, url, status, type, ip, date, time} = req.body
    res.send({value: statistic.getCountType(name, {url, status, type, ip, date, time})})
  }
}
