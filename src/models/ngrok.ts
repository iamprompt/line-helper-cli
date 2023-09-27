import { z } from 'zod'

const metricsSchema = z.object({
  count: z.number(),
  gauge: z.number(),
  rate1: z.number(),
  rate5: z.number(),
  rate15: z.number(),
  p50: z.number(),
  p90: z.number(),
  p95: z.number(),
  p99: z.number(),
})

export const NgrokTunnelSchema = z.object({
  name: z.string(),
  ID: z.string(),
  uri: z.string(),
  public_url: z.string(),
  proto: z.string(),
  config: z.object({
    addr: z.string(),
    inspect: z.boolean(),
  }),
  metrics: z.object({
    conns: metricsSchema,
    http: metricsSchema,
  }),
})

export const NgrokTunnelsAPIResponseSchema = z.object({
  tunnels: z.array(NgrokTunnelSchema),
  uri: z.string(),
})
