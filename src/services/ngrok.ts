import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import axios from 'axios'
import { z } from 'zod'

type NgrokTunnelsAPIResponse = z.infer<typeof NgrokTunnelsAPIResponseSchema>

export const getNgrokUrls = async () => {
  try {
    const {
      data: { tunnels },
    } = await axios.get<NgrokTunnelsAPIResponse>(
      'http://127.0.0.1:4040/api/tunnels',
    )

    return tunnels.map((tunnel) => tunnel.public_url)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('ngrok is not running, please run `ngrok http {port}`')
      }

      throw new Error('there is an error while connecting to ngrok')
    }
  }
}
