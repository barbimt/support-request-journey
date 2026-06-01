export const getRailsApiBase = (): string => {
  const config = useRuntimeConfig()
  return config.apiBase
}

export const railsFetch = <T>(path: string, options?: Parameters<typeof $fetch>[1]) => {
  const apiBase = getRailsApiBase()

  return $fetch<T>(`${apiBase}${path}`, options)
}
