import type { ServiceForm } from '~/interfaces/serviceForm'
import type { RailsService, RailsValidationErrors } from '~/utils/apiMappers'
import { mapRailsServiceToService, mapServiceFormToRails } from '~/utils/apiMappers'

export default defineEventHandler(async (event) => {
  const body = await readBody<ServiceForm>(event)

  try {
    const railsService = await railsFetch<RailsService>('/services', {
      method: 'POST',
      body: mapServiceFormToRails(body),
    })

    return mapRailsServiceToService(railsService)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 422) {
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

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to create service.',
    })
  }
})
