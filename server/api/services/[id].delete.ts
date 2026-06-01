export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    await railsFetch(`/services/${id}`, {
      method: 'DELETE',
    })

    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to delete service.',
    })
  }
})
