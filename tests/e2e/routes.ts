export const appPages = {
  home: {
    path: '/',
    label: 'home page',
  },
  services: {
    path: '/services',
    label: 'services page',
  },
  requestSupport: {
    path: '/request-support',
    label: 'request support page',
  },
  manageServices: {
    path: '/manage/services',
    label: 'manage services page',
  },
} as const

export type AppPageId = keyof typeof appPages

export const errorPages = {
  notFound: {
    path: '/this-route-does-not-exist',
    label: '404 error page',
  },
  serviceNotFound: {
    path: '/services/nonexistent-id-999',
    label: 'service not found',
  },
} as const

export const axePageScenarios = [
  ...(Object.keys(appPages) as AppPageId[]).map((page) => ({
    page,
    theme: 'light' as const,
    viewport: 'desktop' as const,
  })),
  {
    page: 'home' as const,
    theme: 'dark' as const,
    viewport: 'desktop' as const,
  },
  ...(['home', 'services'] as const satisfies readonly AppPageId[]).map((page) => ({
    page,
    theme: 'light' as const,
    viewport: 'mobile' as const,
  })),
]

export const mobileMenuAxePages = ['home', 'services'] as const satisfies readonly AppPageId[]

export function axeScenarioLabel(scenario: {
  page: AppPageId
  theme: 'light' | 'dark'
  viewport: 'desktop' | 'mobile'
}): string {
  return `${appPages[scenario.page].label} (${scenario.theme} mode, ${scenario.viewport})`
}
