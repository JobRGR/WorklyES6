const maxWeight = 20

function setComparison(vacancySkills, studentSkills) {
  const res = studentSkills.reduce((memo, curr) => memo + (vacancySkills.includes(curr) ? 1 : 0), 0)
  return res * 100 / vacancySkills.length
}

function checkComparison(vacanciesSkills, studentSkills) {
  return vacanciesSkills.map(vacancySkills => setComparison(vacancySkills, studentSkills))
}

export default function (req, res, next) {
  const {vacancies, skillComplexities, student} = res
  const vacanciesSkills = vacancies.map(v => v.skills.map(x => x.name))
  const defaultSkills = student.skills.map(x => x.name)
  const skills = skillComplexities.reduce((memo, cur) =>
    Object.assign(memo, {[cur.skill.name]: cur.complexity}),
    {}
  )

  res.send({
    vacanciesSkills,
    skills,
    defaultSkills,
    checkComparison: checkComparison(vacanciesSkills, defaultSkills)
  })
}
