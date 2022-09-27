import { aggregateReports, printEpics } from './aggregation'
import ClockifyApi from './api'

const App = async () => {
  const api = new ClockifyApi()
  await api.initWorkspace()

  const reportLines = await api.getDailyReport(0)
  const aggregatedData = aggregateReports(reportLines)

  printEpics(aggregatedData)
}

export default App
