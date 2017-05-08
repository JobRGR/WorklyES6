const maxWeight = 50
const numberOfPopulation = 10

function checkComparison(curSkills, vacanciesSkills) {
  return vacanciesSkills.map(vacancySkills => {
    const res = curSkills.reduce((memo, curr) => memo + (vacancySkills.includes(curr) ? 1 : 0), 0)
    return res * 100 / vacancySkills.length
  })
}

function getComparisonResult(curSkills, vacanciesSkills) {
  return checkComparison(curSkills, vacanciesSkills)
    .reduce((memo, cur) => memo + cur, 0)
}

function calcWeight(skills, skillsWeight) {
  return skills.reduce((memo, curr) => memo + (skillsWeight[curr] || 3), 0)
}

function createSkillArray(length) {
  let res = []
  for (let i = 0; i < length; i++)
    res.push(0)
  return res
}

function skillsToArray(skills, skillsKeys) {
  let skillsArray = createSkillArray(skillsKeys.length)
  skills.forEach(skill => {
    const index = skillsKeys.indexOf(skill)
    skillsArray[index] = 1
  })
  return skillsArray
}

function arrayToSkills(skillsArray, skillsKeys) {
  return skillsArray.reduce((memo, curr, index) =>
    Boolean(curr) ? [...memo, skillsKeys[index]] : memo, {})
}

function random(length) {
  return Math.floor(Math.random() * length)
}

function hybridization(first, second, defaultSkillsArray) {
  const delimiter = random(first.length)
  let firstChild = []
  let secondChild = []
  for (let i = 0; i < first.length; i++) {
    if (defaultSkillsArray) {
      firstChild.push(first[i])
      secondChild.push(second[i])
      continue
    }
    firstChild.push(i < delimiter ? first[i] : second[i])
    secondChild.push(i < delimiter ? second[i] : first[i])
  }
  return [firstChild, secondChild]
}

function mutation(arr, defaultSkillsArray) {
  let delimiter = null
  do {
    delimiter = random(arr.length)
  } while (defaultSkillsArray[delimiter] === 1)

  let mutationArray = [...arr]
  mutationArray[delimiter] = arr[delimiter] === 1 ? 0 : 1
  return mutationArray
}

function removeEls(skillsArr, skillsWeightArray) {
  let set = new Set()
  let res = []
  skillsArr.forEach(skillArr => {
    const cur = JSON.stringify(skillArr)
    const weight = skillArr.reduce((memo, res, index) => memo + (res ? skillsWeightArray[index] : 0), 0)
    if (!set.has(cur) && weight < maxWeight) {
      set.add(cur)
      res.push(skillArr)
    }
  })
  return res
}

function getStartPopulation(defaultSkillsArray) {
  let population = []
  for (let i = 0; i < 10; i++) {
    let cur = mutation(defaultSkillsArray, defaultSkillsArray)
    for (let i = 0; i < 5; i++) {
      cur = mutation(cur, defaultSkillsArray)
    }
    population.push(cur)
  }
  return population
}

function populationCycle(population, defaultSkillsArray, skillsKeys, vacanciesSkills, skillsWeightArray) {
  let newPopulation = [...population]
  for (let i = 0; i < population.length; i += 2) {
    const [firstChild, secondChild] = hybridization(population[i], population[i + 1], defaultSkillsArray)
    newPopulation.push(firstChild, secondChild)
  }

  let populationLength = null
  for (let j = 0; j < 2; j++) {
    populationLength = newPopulation.length
    for (let i = 0; i < populationLength; i++) {
      newPopulation.push(mutation(newPopulation[i], defaultSkillsArray))
    }
  }

  let newPopulationWithoutDuplicates = removeEls(newPopulation, skillsWeightArray)

  let sortNewPopulation = newPopulationWithoutDuplicates.sort((a, b) => {
    let aRes = getComparisonResult(arrayToSkills(a, skillsKeys), vacanciesSkills)
    let bRes = getComparisonResult(arrayToSkills(b, skillsKeys), vacanciesSkills)
    return aRes <= bRes ? 1 : -1
  })

  return sortNewPopulation.slice(0, numberOfPopulation)
}

export default function (req, res, next) {
  const {vacancies, skillComplexities, student} = res

  const defaultSkills = student.skills.map(x => x.name)
  const vacanciesSkills = vacancies.map(v => v.skills.map(x => x.name))
  const skillsWeight = skillComplexities.reduce((memo, cur) =>
    Object.assign(memo, {[cur.skill.name]: cur.complexity}),
    {}
  )

  const skillsKeys = Object.keys(skillsWeight)
  const defaultSkillsArray = skillsToArray(defaultSkills, skillsKeys)
  const skillsWeightArray = skillsKeys.map(x => skillsWeight[x])

  let population = getStartPopulation(defaultSkillsArray)
  for (let i = 0; i < 100; i++) {
    population = populationCycle(
      population,
      defaultSkillsArray,
      skillsKeys,
      vacanciesSkills,
      skillsWeightArray
    )
  }

  const resultSkills = arrayToSkills(population[0], skillsKeys)
  const resultValue = getComparisonResult(resultSkills, vacanciesSkills)
  const resultPercent = checkComparison(resultSkills, vacanciesSkills)
  const resultWeight = calcWeight(resultSkills, skillsWeight)

  res.send({
    resultSkills,
    resultValue,
    resultPercent,
    resultWeight
  })
}
