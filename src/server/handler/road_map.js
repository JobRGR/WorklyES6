import HttpError from '../utils/error'

const maxWeight = 40
const times = 100
const numberOfPopulation = 30

function checkComparison(curSkills, vacanciesSkills) {
  return vacanciesSkills.map(vacancySkills => {
    const res = curSkills.reduce((memo, curr) => memo + (vacancySkills.includes(curr) ? 1 : 0), 0)
    return res * 100 / vacancySkills.length
  })
}

function getComparisonResult(curSkills, vacanciesSkills) {
  const arr = checkComparison(curSkills, vacanciesSkills)
  let res = 0
  for (let i = 0; i < arr.length; i++) {
    res += arr[i]
  }
  return res
}

function calcWeight(skills, skillsWeight) {
  return skills.reduce((memo, curr) => memo + (skillsWeight[curr] || 5), 0)
}

function createSkillArray(length) {
  let res = []
  for (let i = 0; i < length; i++)
    res.push(0)
  return res
}

function skillsToArray(skills, skillsKeys) {
  let skillsArray = createSkillArray(skillsKeys.length)
  for (let i = 0; i < skills.length; i++) {
    const index = skillsKeys.indexOf(skills[i])
    skillsArray[index] = 1
  }
  return skillsArray
}

function arrayToSkills(skillsArray, skillsKeys) {
  return skillsArray.reduce((memo, curr, index) =>
    Boolean(curr) ? [...memo, skillsKeys[index]] : memo, [])
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

function removeEls(skillsArr, skillsKeys) {
  let set = new Set()
  let res = []
  for (let i = 0; i < skillsArr.length; i++) {
    const cur = JSON.stringify(arrayToSkills(skillsArr[i], skillsKeys))
    if (!set.has(cur)) {
      set.add(cur)
      res.push(skillsArr[i])
    }
  }
  return res
}

function reincornation(skillsArr, skillsWeightArray, defaultSkillsArray) {
  const curIndexArray = []
  const weightArr = skillsArr.reduce((memo, res, index) => {
    if (res) {
      memo.push(skillsWeightArray[index])
      curIndexArray.push(index)
    }
    return memo
  }, [])
  const weight = weightArr.reduce((memo, res) => memo + res, 0)
  if (weight < maxWeight) {
    return skillsArr
  }
  let maxWeightIndex = null
  let search = true
  while (search) {
    const maxVal = Math.max(...weightArr)
    maxWeightIndex = weightArr.indexOf(maxVal)
    if (defaultSkillsArray[curIndexArray[maxWeightIndex]] !== 1) {
      search = false
    }
    else {
      weightArr[maxWeightIndex] = -Infinity
    }
  }
  skillsArr[curIndexArray[maxWeightIndex]] = 0
  return reincornation(skillsArr, skillsWeightArray, defaultSkillsArray)
}

function getStartPopulation(defaultSkillsArray) {
  let population = []
  for (let i = 0; i < numberOfPopulation; i++) {
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
    if (!population[i + 1]) {
      continue
    }
    const [firstChild, secondChild] = hybridization(population[i], population[i + 1], defaultSkillsArray)
    newPopulation.push(firstChild, secondChild)
  }

  let populationLength = newPopulation.length
  for (let i = 0; i < populationLength; i++) {
    newPopulation.push(mutation(newPopulation[i], defaultSkillsArray))
  }

  let reincornationPopulation = []
  for (let i = 0; i < newPopulation.length; i++) {
    reincornationPopulation.push(reincornation(newPopulation[i], skillsWeightArray, defaultSkillsArray))
  }

  let populationWithoutDuplicates = removeEls(reincornationPopulation, skillsKeys)

  let sortedPopulation = populationWithoutDuplicates
    .map((cur, index) => ({
      val: getComparisonResult(arrayToSkills(cur, skillsKeys), vacanciesSkills),
      index
    }))
    .sort((a, b) => a.val <= b.val ? 1 : -1)
    .map(cur => reincornationPopulation[cur.index])

  return removeEls(sortedPopulation, skillsKeys).slice(0, numberOfPopulation)
}

export default function (req, res, next) {
  const {vacancies, skillComplexities, student} = res

  if (Object.prototype.toString.call(student) !== "[object Object]") {
    return next(new HttpError(401))
  }

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
  for (let i = 0; i < times; i++) {
    population = populationCycle(
      population,
      defaultSkillsArray,
      skillsKeys,
      vacanciesSkills,
      skillsWeightArray
    )
  }

  const roadMaps = population
    .slice(0, 5)
    .map(x => arrayToSkills(x, skillsKeys).sort((a, b) => {
      if (defaultSkills[a] && !defaultSkills[b]) {
        return -1
      }
      if (!defaultSkills[a] && defaultSkills[b]) {
        return 1
      }
      return skillsWeight[a] <= skillsWeight[b] ? 1 : -1
    }))
    .map(curSkills => {
      const resultValue = getComparisonResult(curSkills, vacanciesSkills)
      return {
        skills: curSkills,
        resultValue,
        avarageComparison: resultValue / vacanciesSkills.length,
        resultPercent: checkComparison(curSkills, vacanciesSkills),
        resultWeight: calcWeight(curSkills, skillsWeight)
      }
    })

  res.send({roadMaps})
}
