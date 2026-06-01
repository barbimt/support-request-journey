export const copy = {
  nav: {
    skipToMain: 'Skip to main content',
    home: 'Home',
    requestSupport: 'Request support',
    browseServices: 'Browse support services',
  },
  validation: {
    problemHeading: 'There is a problem',
    serviceTitleRequired: 'Enter a service title.',
  },
  supportRequest: {
    pageHeading: 'Request support',
    submitButton: 'Send support request',
    submitSuccess: 'Your support request has been submitted',
  },
  manageServices: {
    heading: 'Manage services',
    existingServicesHeading: 'Existing services',
    createButton: 'Create service',
    saveButton: 'Save changes',
    addServiceLink: 'Add a service to the directory',
    serviceAddedSuffix: 'has been added.',
    serviceUpdatedSuffix: 'has been updated.',
    editLink: 'Edit',
    editServiceLink: 'Edit service',
    viewDetailsLink: 'View service details',
    tryAgainButton: 'Try again',
  },
  deleteDialog: {
    deleteButton: 'Delete',
    title: 'Delete this service?',
    confirmButton: 'Yes, delete service',
  },
  errors: {
    pageLoadHeading: 'We could not load this page',
    notFound404Heading: 'This page does not exist',
    serviceNotFoundHeading: 'Service not found',
  },
  theme: {
    darkModeButton: 'Dark mode',
    lightModeButton: 'Light mode',
  },
  services: {
    viewDetailsLink: /View service details for/i,
    requestSupportFromDetail: 'Request support',
  },
} as const
