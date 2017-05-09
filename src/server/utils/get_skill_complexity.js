const fetch = require('isomorphic-fetch')

export const searchSkill = skill =>
  fetch(`https://api.github.com/search/repositories?q=${skill}`)
    .then(res => res.json())

export function getSkillComplexity(val) {
  return searchSkill(val).then(res => {
    const count = res.total_count
    const values = [1000000, 500000, 200000, 100000, 50000, 20000, 10000, 5000, 1000, 500, 100]
    for (let i = 1; i < values.length; i++) {
      if (count > values[i]) {
        return calculate(count, values[i - 1])
      }
    }
    return 8
  })

  function calculate(cur, max) {
    const res = Math.ceil(max / cur)
    return res > 1 ? res : Math.ceil(cur / max)
  }
}
