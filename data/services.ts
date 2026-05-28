import type { Service } from '~/types/service'

export const mockServices: Service[] = [
  {
    id: 'housing-advice',
    title: 'Housing advice',
    category: 'housing',
    description:
      'Free guidance on renting, homelessness prevention, disrepair, and understanding your housing rights in the local area.',
    eligibility:
      'Open to residents aged 16 and over who live in or are looking to move into the borough. Priority advice is available if you are at risk of homelessness.',
    contactEmail: 'housing.advice@example-council.gov.uk',
    phone: '0800 123 4567',
    openingHours: 'Monday to Friday, 9am to 5pm. Extended hours until 7pm on Wednesdays.',
    accessibilityNotes:
      'Ground-floor office with step-free access, hearing loop at reception, and BSL interpretation available by appointment.',
    onlineSupport: true,
  },
  {
    id: 'family-support',
    title: 'Family support',
    category: 'family',
    description:
      'Practical and emotional support for families facing difficult times, including parenting help, relationship stress, and early help assessments.',
    eligibility:
      'Families with children under 18, or expectant parents, who live in the borough. Self-referrals and professional referrals are welcome.',
    contactEmail: 'family.support@example-council.gov.uk',
    phone: '0800 234 5678',
    openingHours: 'Monday to Thursday, 8:30am to 5pm. Friday, 8:30am to 4:30pm.',
    accessibilityNotes:
      'Home visits can be arranged. Materials available in large print and easy-read formats on request.',
    onlineSupport: true,
  },
  {
    id: 'mental-health-support',
    title: 'Mental health support',
    category: 'mental-health',
    description:
      'Short-term wellbeing support, signposting to NHS services, and help accessing counselling and community mental health groups.',
    eligibility:
      'Adults and young people aged 11+ registered with a GP in the area. Urgent crisis support is signposted to NHS 111 option 2.',
    contactEmail: 'wellbeing@example-council.gov.uk',
    phone: '0800 345 6789',
    openingHours: 'Monday to Friday, 9am to 6pm. Out-of-hours crisis signposting available on the answerphone.',
    accessibilityNotes:
      'Quiet waiting area, flexible appointment lengths, and text relay service for phone contact.',
    onlineSupport: true,
  },
  {
    id: 'send-support',
    title: 'SEND support',
    category: 'send',
    description:
      'Information and advice for children and young people with special educational needs and disabilities, including EHCP guidance and local offer signposting.',
    eligibility:
      'Parents, carers, and young people up to age 25 with SEND living in the borough, or attending a local school.',
    contactEmail: 'send.iass@example-council.gov.uk',
    phone: '0800 456 7890',
    openingHours: 'Monday to Friday, 9am to 5pm. Term-time evening sessions on the first Tuesday of each month.',
    accessibilityNotes:
      'Wheelchair accessible venue, sensory-friendly meeting room available, and documents in accessible formats.',
    onlineSupport: false,
  },
  {
    id: 'care-leaver-support',
    title: 'Care leaver support',
    category: 'care-leavers',
    description:
      'Dedicated support for care-experienced young people with housing, education, employment, health, and independent living skills.',
    eligibility:
      'Young people aged 16 to 25 who have been in care and are eligible for leaving care services from the local authority.',
    contactEmail: 'careleavers@example-council.gov.uk',
    phone: '0800 567 8901',
    openingHours: 'Monday to Friday, 10am to 6pm. Drop-in on Thursdays 2pm to 5pm.',
    accessibilityNotes:
      'Personal adviser visits at a location that works for you. Online appointments and text support available.',
    onlineSupport: true,
  },
]
