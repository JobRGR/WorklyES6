const fetch = require('isomorphic-fetch')

export const searchSkill = skill =>
  fetch(`https://api.github.com/search/repositories?q=${skill}`)
    .then(res => res.json())

export function getSkillComplexity(val) {
  return searchSkill(val).then(res => {
    const count = res.total_count
    if (count > 100000) {
      return calculate(count, 1000000)
    }
    if (count > 50000) {
      return calculate(count, 100000)
    }
    if (count > 20000) {
      return calculate(count, 50000)
    }
    else if (count > 10000) {
      return calculate(count, 20000)
    }
    else if (count > 5000) {
      return calculate(count, 10000)
    }
    else if (count > 1000) {
      return calculate(count, 5000)
    }
    else if (count > 500) {
      return calculate(count, 10000)
    }
    else if (count > 100) {
      return calculate(count, 500)
    }
    else {
      return 6
    }
  })

  function calculate(cur, max) {
    const res = Math.ceil(max / cur)
    return res > 1 ? res : Math.ceil(cur / max)
  }
}
