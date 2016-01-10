"use strict";

import fs from 'fs'
import path from 'path'
import {checkDate, getRanges, monthList} from '../utils/date'

class Statistic {
  constructor() {
    this.data = fs
      .readFileSync(path.resolve(__dirname, '../../../express_server.log'), 'utf8')
      .split('\n')
      .filter(item => item.length)
      .map(item => {
        [item] = item.split(' "-" "node-superagent/1.3.0"')
        let [ip, other] = item.split(' - - [')
        let [date, req] = other.split('] ')
        let [type, url, version, status, time] = req.split(' ')
        type = type.substr(1)
        version = version.substring(0, version.length - 1)
        return {ip, date, req: {type, url, version, status, time}}
      })
    this.apiList = ['student', 'company', 'city', 'skill', 'vacancy', 'admin', 'speciality', 'university', 'company-name', 'open-question', 'test-question', 'position', 'statistic']
  }

  getItem(name = '', options = {}) {
    let {status, url, type, ip, date, time, error} = options
    return this.data.filter(item => {
      let {req} = item
      return (
        (Array.isArray(name) ? name.some(x => req.url.indexOf(x) > -1) : req.url.indexOf(name) > -1)
        && (status ? parseInt(req.status) == parseInt(status) : true)
        && (url ? req.url.indexOf(url) > -1 : true)
        && (type ? req.type.toLowerCase() == type.toLowerCase() : true)
        && (ip ? item.ip == ip : true)
        && (date ? checkDate(date, new Date(item.date)) : true)
        && (time ? item.time >= time.min && item.time <= time.max : true)
        && (error ? parseInt(parseInt(req.status) / 100) > 3 : true)
      )
    })
  }

  getCount(name, options, isCount) {
    let cur = this.getItem(name, options)
    let percent =  cur.length * 100 / this.data.length
    return isCount ? {count: cur.length, percent} : percent
  }

  getCountType(name, options) {
    let cur = this.getItem(name, options)
    let all = this.getItem(name)
    return cur.length * 100 / all.length
  }

  getGraph(name = this.apiList, type = 'month', error = false) {
    let ranges = getRanges(type)
    return ranges.reduce((memo, {min, max}) => {
      let label = null
      let val = this.getItem(name, {date: {min, max}, error}).length
      if (type == 'year') label = `${monthList[min.getMonth()]} ${min.getFullYear()}`
      else if (type == 'month') label = `${min.getDate()} ${monthList[min.getMonth()]}`
      else if (type == 'day') label = `${min.getDate()} / ${min.getHours() > 10 ? min.getHours() : `0${min.getHours()}`}:00`
      memo.labels.push(label)
      memo.series[0].push(val)
      return memo
    }, {labels: [], series: [[]]})
  }

  getPie(name = this.apiList, date, error = false) {
    let count = name.reduce((memo, cur) => {
      memo[cur] = this.getItem(cur, {date, error}).length
      return memo
    }, {})
    count.other = name.reduce((memo, cur) => {
      memo -= count[cur]
      return memo
    }, error ? this.getItem('', {error}).length : this.data.length)
    return count
  }

  getMultiGraph(names = this.apiList, type = 'month', error = false) {
    let ranges = getRanges(type)
    let labels = ranges.map(({min}) => {
      if (type == 'year') return `${monthList[min.getMonth()]} ${min.getFullYear()}`
      if (type == 'month') return `${min.getDate()} ${monthList[min.getMonth()]}`
      if (type == 'day') return `${min.getDate()} / ${min.getHours() > 10 ? min.getHours() : `0${min.getHours()}`}:00`
    })
    let series = names.map(name => {
      return {
        name,
        data: ranges.map(({min, max}) => this.getItem(name, {date: {min, max}, error}).length)
      }
    })
    return {labels, series}
  }
}

export default Statistic