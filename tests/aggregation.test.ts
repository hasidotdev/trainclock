import { aggregateReports } from '../src/aggregation'
import { ReportLine } from '../src/api'

describe('Test aggregation', () => {
  let report: ReportLine[]

  beforeEach(() => {
    report = [
      {
        description: 'E1',
        durationSec: 10,
      },
      {
        description: 'E1, T1',
        durationSec: 10,
      },
      {
        description: 'E1, T2',
        durationSec: 10,
      },
      {
        description: 'E2, T1',
        durationSec: 10,
      },
    ]
  })

  it('should aggregate epics correctly', () => {
    const aggregation = aggregateReports(report)
    expect(aggregation.length).toBe(2)
    expect(aggregation[1].name).toBe('E2')
  })
  it('should aggregate tasks correctly', () => {
    const aggregation = aggregateReports(report)
    expect(aggregation[0].tasks).toEqual(['T1', 'T2'])
    expect(aggregation[1].tasks).toEqual(['T1'])
  })
  it('should aggregate time correctly', () => {
    const aggregation = aggregateReports(report)
    expect(aggregation[0].durationSecs).toBe(30)
  })
})
