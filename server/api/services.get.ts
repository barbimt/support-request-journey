import type { RailsService } from '~/utils/apiMappers'
import { mapRailsServiceToService } from '~/utils/apiMappers'

export default defineEventHandler(async (event) => {
  try {
    const services = await railsFetch<RailsService[]>('/services')
    const mapped = services.map(mapRailsServiceToService)

    if (process.env.NODE_ENV === 'production') {
      setResponseHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    }

    return mapped
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to load services.',
    })
  }
})
