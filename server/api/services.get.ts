import type { RailsService } from '~/utils/apiMappers'
import { mapRailsServiceToService } from '~/utils/apiMappers'

export default defineEventHandler(async () => {
  try {
    const services = await railsFetch<RailsService[]>('/services')
    return services.map(mapRailsServiceToService)
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to load services.',
    })
  }
})
