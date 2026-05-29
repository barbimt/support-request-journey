import type { RailsService } from '~/utils/apiMappers'
import { mapRailsServiceToService } from '~/utils/apiMappers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const service = await railsFetch<RailsService>(`/services/${id}`)

    return mapRailsServiceToService(service)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to load service.',
    })
  }
})
