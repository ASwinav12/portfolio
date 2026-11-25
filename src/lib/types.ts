export type Socials = {
  github?: string | null
  linkedin?: string | null
  instagram?: string | null
}

export type Profile = {
  id: string
  full_name: string
  headline: string
  about: string | null
  email: string | null
  phone: string | null
  location: string | null
  availability: string | null
  photo_path: string | null
  resume_path: string | null
  resume_label: string | null
  socials: Socials | null
  updated_at: string
}

export type Education = {
  id: string
  degree: string
  institution: string
  location: string | null
  duration: string | null
  status: string
  description: string | null
  sort_order: number
}

export type Experience = {
  id: string
  role: string
  organization: string
  location: string | null
  duration: string | null
  type: 'internship' | 'training'
  description: string | null
  technologies: string[]
  sort_order: number
}

export type Skill = {
  id: string
  name: string
  category: string
  level: string
  sort_order: number
}

export type TrainingModule = {
  id: string
  title: string
  description: string | null
  topics: string[]
  sort_order: number
}

export type Project = {
  id: string
  title: string
  slug: string
  summary: string
  description: string | null
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  image_path: string | null
  featured: boolean
  sort_order: number
}

export type Certificate = {
  id: string
  name: string
  issuer: string | null
  issue_date: string | null
  credential_url: string | null
  file_path: string | null
  file_type: 'pdf' | 'image' | null
  sort_order: number
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  company: string | null
  enquiry_type: string
  subject: string
  message: string
  ip_hash: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

export type SiteContent = {
  profile: Profile
  education: Education[]
  experience: Experience[]
  trainingModules: TrainingModule[]
  skills: Skill[]
  projects: Project[]
  certificates: Certificate[]
}

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string }
