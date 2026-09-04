// Shared between the onboarding form and the admin Team edit form so both
// offer the identical set of positions. `rank` determines display order on
// the About page (lower = higher up). Grouped in tiers with gaps so new
// positions can be inserted without renumbering.

export const POSITIONS = [
  { label: 'Founder & CEO',                    rank: 10 },
  { label: 'Co-Founder',                       rank: 15 },
  { label: 'Chief Technology Officer',         rank: 20 },
  { label: 'Chief Operating Officer',          rank: 20 },
  { label: 'Chief Product Officer',            rank: 20 },
  { label: 'Head of Engineering',              rank: 30 },
  { label: 'Head of Product',                  rank: 30 },
  { label: 'Head of Design',                   rank: 30 },
  { label: 'Head of Operations',               rank: 30 },
  { label: 'Head of Marketing & Sales',        rank: 30 },
  { label: 'Senior Software Engineer',         rank: 40 },
  { label: 'Senior IoT Engineer',              rank: 40 },
  { label: 'Senior Hardware Engineer',         rank: 40 },
  { label: 'Senior Product Designer',          rank: 40 },
  { label: 'Software Engineer',                rank: 50 },
  { label: 'IoT Engineer',                     rank: 50 },
  { label: 'Hardware Engineer',                rank: 50 },
  { label: 'UI/UX Designer',                   rank: 50 },
  { label: 'Product Designer',                 rank: 50 },
  { label: 'QA Engineer',                      rank: 50 },
  { label: 'Data Analyst',                     rank: 50 },
  { label: 'Marketing Associate',              rank: 60 },
  { label: 'Sales Associate',                  rank: 60 },
  { label: 'Business Development Associate',   rank: 60 },
  { label: 'Operations Associate',             rank: 60 },
  { label: 'Customer Success Associate',       rank: 60 },
] as const
