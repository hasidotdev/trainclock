import { ReportLine } from './api'

interface Epic {
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
      epic.tasks.push(...epicRest)
    }
    epic.durationSecs += line.durationSec
  })

  return epics
}

export const printEpics = (epics: Epic[]): void => {
  const EPIC_LENGTH = 300
  const TASKS_LENGTH = 100
  const DURATION_LENGTH = 6

  const uniqueTasks = (value: string, idx: number, self: string[]) =>
    self.indexOf(value) === idx

  const prettyTable = epics.map((epic) => ({
    name: epic.name.padEnd(EPIC_LENGTH),
    tasks: epic.tasks.filter(uniqueTasks).join(', ').padEnd(TASKS_LENGTH),
    minutes: (epic.durationSecs / 60).toFixed(2).padStart(DURATION_LENGTH),
  }))

  prettyTable.push({
    name: 'SUM'.padEnd(EPIC_LENGTH),
    tasks: ''.padEnd(TASKS_LENGTH),
    minutes: (
      epics.reduce((prev, curr) => {
        return prev + curr.durationSecs
      }, 0) / 60
    )
      .toFixed(2)
      .padStart(DURATION_LENGTH),
  })
  console.table(prettyTable)
}
