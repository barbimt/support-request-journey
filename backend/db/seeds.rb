services = [
  {
    title: "Housing advice",
    category: "housing",
    description: "Free guidance on renting, homelessness prevention, disrepair, and understanding your housing rights in the local area.",
    eligibility: "Open to residents aged 16 and over who live in or are looking to move into the borough. Priority advice is available if you are at risk of homelessness.",
    contact_email: "housing.advice@example-council.gov.uk",
    phone: "0800 123 4567",
    opening_hours: "Monday to Friday, 9am to 5pm. Extended hours until 7pm on Wednesdays.",
    accessibility_notes: "Ground-floor office with step-free access, hearing loop at reception, and BSL interpretation available by appointment.",
    online_support: true
  },
  {
    title: "Family support",
    category: "family",
    description: "Practical and emotional support for families facing difficult times, including parenting help, relationship stress, and early help assessments.",
    eligibility: "Families with children under 18, or expectant parents, who live in the borough. Self-referrals and professional referrals are welcome.",
    contact_email: "family.support@example-council.gov.uk",
    phone: "0800 234 5678",
    opening_hours: "Monday to Thursday, 8:30am to 5pm. Friday, 8:30am to 4:30pm.",
    accessibility_notes: "Home visits can be arranged. Materials available in large print and easy-read formats on request.",
    online_support: true
  },
  {
    title: "Mental health support",
    category: "mental-health",
    description: "Short-term wellbeing support, signposting to NHS services, and help accessing counselling and community mental health groups.",
    eligibility: "Adults and young people aged 11+ registered with a GP in the area. Urgent crisis support is signposted to NHS 111 option 2.",
    contact_email: "wellbeing@example-council.gov.uk",
    phone: "0800 345 6789",
    opening_hours: "Monday to Friday, 9am to 6pm. Out-of-hours crisis signposting available on the answerphone.",
    accessibility_notes: "Quiet waiting area, flexible appointment lengths, and text relay service for phone contact.",
    online_support: true
  },
  {
    title: "SEND support",
    category: "send",
    description: "Information and advice for children and young people with special educational needs and disabilities, including EHCP guidance and local offer signposting.",
    eligibility: "Parents, carers, and young people up to age 25 with SEND living in the borough, or attending a local school.",
    contact_email: "send.iass@example-council.gov.uk",
    phone: "0800 456 7890",
    opening_hours: "Monday to Friday, 9am to 5pm. Term-time evening sessions on the first Tuesday of each month.",
    accessibility_notes: "Wheelchair accessible venue, sensory-friendly meeting room available, and documents in accessible formats.",
    online_support: false
  },
  {
    title: "Care leaver support",
    category: "care-leavers",
    description: "Dedicated support for care-experienced young people with housing, education, employment, health, and independent living skills.",
    eligibility: "Young people aged 16 to 25 who have been in care and are eligible for leaving care services from the local authority.",
    contact_email: "careleavers@example-council.gov.uk",
    phone: "0800 567 8901",
    opening_hours: "Monday to Friday, 10am to 6pm. Drop-in on Thursdays 2pm to 5pm.",
    accessibility_notes: "Personal adviser visits at a location that works for you. Online appointments and text support available.",
    online_support: true
  }
]

services.each do |attributes|
  Service.find_or_create_by!(title: attributes[:title]) do |service|
    service.assign_attributes(attributes)
  end
end

puts "Seeded #{Service.count} services."
