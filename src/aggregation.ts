import { ReportLine } from './api'

export interface Epic {
  name: string
  tasks: string[]
  durationSecs: number
}

export const aggregateReports = (reportLines: ReportLine[]): Epic[] => {
  const epics: Epic[] = []
  reportLines.forEach((line) => {
    const { description } = line
    const splitted = description.split(',')
    const [epicName, ...epicRest] = splitted
    const existingEpic = epics.find((epic) => epic.name === epicName)
    let epic: Epic
    if (!existingEpic) {
      epic = {
        name: epicName,
        tasks: [],
        durationSecs: 0,
      }
      epics.push(epic)
    } else {
      epic = existingEpic
    }

    if (splitted.length > 1) {
      epic.tasks.push(...epicRest.map((t) => t.trim()))
    }
    epic.durationSecs += line.durationSec
  })

  return epics
}

export const printEpics = (epics: Epic[]): void => {
  const EPIC_LENGTH = 80
  const TASKS_LENGTH = 90
  const DURATION_LENGTH = 14

  const uniqueTasks = (value: string, idx: number, self: string[]) =>
    +self.indexOf(value) === idx

  const prettyTable = epics.map((epic) => ({
    name: epic.name.padEnd(EPIC_LENGTH),
    tasks: epic.tasks.filter(uniqueTasks).join(', ').padEnd(TASKS_LENGTH),
    minutes: (epic.durationSecs / 60)
      .toFixed(2)
      .replace('.', ',')
      .padStart(DURATION_LENGTH),
  }))

  console.log('\n\n')
  console.log(
    [
      'EPIC'.padEnd(EPIC_LENGTH),
      'TASKS'.padEnd(TASKS_LENGTH),
      'DURATION (HRS)'.padStart(DURATION_LENGTH),
    ].join('')
  )
  console.log(''.padEnd(EPIC_LENGTH + TASKS_LENGTH + DURATION_LENGTH, '='))
  prettyTable.forEach((line) => {
    console.log(Object.values(line).join(''))
    console.log(''.padEnd(EPIC_LENGTH + TASKS_LENGTH + DURATION_LENGTH, '-'))
  })

  const sum = {
    name: 'SUM'.padEnd(EPIC_LENGTH),
    tasks: ''.padEnd(TASKS_LENGTH),
    minutes: (
      epics.reduce((prev, curr) => {
        return prev + curr.durationSecs
      }, 0) / 60
    )
      .toFixed(2)
      .replace('.', ',')
      .padStart(DURATION_LENGTH),
  }
  console.log(''.padEnd(EPIC_LENGTH + TASKS_LENGTH + DURATION_LENGTH, '='))
  console.log(Object.values(sum).join(''), '\n')
}
