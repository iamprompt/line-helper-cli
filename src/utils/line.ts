import { LIFFApp, LIFFAppSchema } from '@/models/liff'
import axios, { CreateAxiosDefaults } from 'axios'
import { z } from 'zod'
import { logger } from './logger'

const LINE_API_BASE_URL = 'https://api.line.me'

const createLINEInstance = (config?: CreateAxiosDefaults<any>) => {
  return axios.create({
    baseURL: LINE_API_BASE_URL,
    ...config,
  })
}

let LINEInstance = createLINEInstance()

// Get stateless channel access token
export const getLINEAccessToken = async (
  channelId: string,
  channelSecret: string,
) => {
  const data = new URLSearchParams()
  data.append('grant_type', 'client_credentials')
  data.append('client_id', channelId)
  data.append('client_secret', channelSecret)

  const response = await LINEInstance.post('/oauth2/v3/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  LINEInstance = createLINEInstance({
    headers: {
      Authorization: `Bearer ${response.data.access_token}`,
    },
  })

  return response.data.access_token as string
}

export const createLIFFApp = async (payload: z.input<typeof LIFFAppSchema>) => {
  try {
    const parsedPayload = await LIFFAppSchema.parseAsync(payload)
    const { data } = await LINEInstance.post<{
      liffId: string
    }>('/liff/v1/apps', parsedPayload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.response?.data.message)
    }
  }
}

export const getLIFFApps = async () => {
  const { data } = await LINEInstance.get<{
    apps: LIFFApp[]
  }>('/liff/v1/apps')
  return data.apps
}

export const findLIFFAppByLIFFId = (liffId: string, liffApps: LIFFApp[]) => {
  const data = liffApps.find((app) => app.liffId === liffId)
  return data
}

export const getLIFFApp = async (liffId: string) => {
  const apps = await getLIFFApps()
  return findLIFFAppByLIFFId(liffId, apps)
}

export const updateLIFFApp = async (
  liffId: string,
  payload: Partial<z.input<typeof LIFFAppSchema>>,
) => {
  const response = await LINEInstance.put(`/liff/v1/apps/${liffId}`, payload)
  return response.data
}
