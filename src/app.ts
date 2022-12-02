import { aggregateReports, printEpics } from './aggregation'
import ClockifyApi from './api'
import commandLineArgs from 'command-line-args'

const App = async () => {
  let daysPast = 0
  try {
    const options = commandLineArgs([
      { name: 'daysPast', alias: 'd', type: Number, defaultValue: 0 },
    ])
    daysPast = options.daysPast ?? 0
  } catch (e) {
    console.warn('Error on parsing options', e)
  }

  const api = new ClockifyApi()
  await api.initWorkspace()

  const reportLines = await api.getDailyReport(daysPast)
  const aggregatedData = aggregateReports(reportLines)

  printEpics(aggregatedData)
}

export default App
