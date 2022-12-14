import dotenv from 'dotenv'
import axios from 'axios'

export interface ReportLine {
  description: string
  durationSec: number
}

interface ClockifyTimeEntry {
  description: string
  timeInterval: { duration: number }
}

interface ClockifyReport {
  timeentries: ClockifyTimeEntry[]
}

interface ClockifyUserData {
  defaultWorkspace: string
}

type Endpoint = 'base' | 'reports'

class Api {
  private apiKey: string | false
  private projectId: string | false

  private workspaceId = ''

  private baseUrls: Record<Endpoint, string> = {
    base: 'https://api.clockify.me/api/v1/',
    reports: 'https://reports.api.clockify.me/v1/',
  }

  constructor() {
    dotenv.config()
    this.apiKey = process.env.CLOCKIFY_API_KEY || false
    this.projectId = process.env.PROJECT_ID || false
  }

  public async initWorkspace() {
    const userData = await this.getUserData()
    this.workspaceId = userData.defaultWorkspace as string
  }

  public async getDailyReport(daysInPast = 0): Promise<ReportLine[]> {
    const dayStamp = Date.now() - 86400000 * daysInPast

    const startDate = new Date(new Date(dayStamp).setHours(0, 0, 0, 0))
    const startDateStr = startDate.toISOString()
    const endDate = new Date(new Date(dayStamp).setHours(23, 59, 59, 999))
    const endDateStr = endDate.toISOString()

    const reports = await this.getReport(startDateStr, endDateStr)
    return reports.timeentries.map((tE: ClockifyTimeEntry) => ({
      description: tE.description,
      durationSec: tE.timeInterval.duration / 60,
    }))
  }

  private async getReport(
    dateRangeStart: string,
    dateRangeEnd: string
  ): Promise<ClockifyReport> {
    const url = `workspaces/${this.workspaceId}/reports/detailed`

    return await this.post(url, 'reports', {
      dateRangeStart,
      dateRangeEnd,
      detailedFilter: {
        page: 1,
        pageSize: 1000,
      },
      projects: this.projectId
        ? {
            contains: 'CONTAINS',
            ids: [this.projectId],
          }
        : undefined,
    })
  }

  private async getUserData(): Promise<ClockifyUserData> {
    return (await this.get('user')) as ClockifyUserData
  }

  private async get(url: string, endpoint: Endpoint = 'base') {
    return this.doFetch(url, 'GET', undefined, endpoint)
  }
  private async post(
    url: string,
    endpoint: Endpoint = 'base',
    body: Record<string, unknown>
  ) {
    return this.doFetch(url, 'POST', body, endpoint)
  }

  private async doFetch(
    url: string,
    method = 'GET',
    requestBody: Record<string, unknown> | undefined,
    endpoint: Endpoint
  ) {
    if (!this.apiKey) {
      throw new Error('No API-Key found')
    }

    try {
      const res = await axios({
        method,
        url: `${this.baseUrls[endpoint]}${url}`,
        data: requestBody || undefined,
        headers: {
          'content-type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
      })
      return res.data
    } catch (e) {
      console.error(e)
    }
  }
}

export default Api
