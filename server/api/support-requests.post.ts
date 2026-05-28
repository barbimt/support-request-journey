import type { SupportRequestForm } from '~/interfaces/supportRequest'
import type { RailsValidationErrors } from '~/utils/apiMappers'
import { mapSupportRequestFormToRails } from '~/utils/apiMappers'

interface SupportRequestBody extends SupportRequestForm {
  serviceId?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SupportRequestBody>(event)

  try {
    return await railsFetch('/support_requests', {
      method: 'POST',
      body: mapSupportRequestFormToRails(body, body.serviceId),
    })
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
      statusMessage: 'Unable to submit support request.',
    })
  }
})
