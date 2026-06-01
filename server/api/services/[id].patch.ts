import type { ServiceForm } from '~/interfaces/serviceForm'
import type { RailsService, RailsValidationErrors } from '~/utils/apiMappers'
import { mapRailsServiceToService, mapServiceFormToRails } from '~/utils/apiMappers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<ServiceForm>(event)

  try {
    const railsService = await railsFetch<RailsService>(`/services/${id}`, {
      method: 'PATCH',
      body: mapServiceFormToRails(body),
    })

    return mapRailsServiceToService(railsService)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      if (error.statusCode === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Service not found',
        })
      }

      if (error.statusCode === 422) {
        const data = (error as { data?: RailsValidationErrors }).data

        throw createError({
          statusCode: 422,
          statusMessage: data?.message ?? 'There are validation errors.',
          data: {
            message: data?.message ?? 'There are validation errors.',
            errors: data?.errors ?? {},
          },
        })
      }
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to update service.',
    })
  }
})
