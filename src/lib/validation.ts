import { z } from 'zod'

export const ENQUIRY_TYPES = [
  'Job opportunity',
  'Internship',
  'Freelance / project',
  'Collaboration',
  'General enquiry',
] as const

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.email('Please enter a valid email address.').max(200),
  company: z.string().trim().max(120).optional().default(''),
  enquiryType: z.enum(ENQUIRY_TYPES).default('General enquiry'),
  subject: z.string().trim().min(2, 'Please add a subject.').max(200),
  message: z.string().trim().min(10, 'Please write at least 10 characters.').max(5000),
  /** Honeypot — filled by bots, checked separately and silently accepted. */
  website: z.string().optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().trim().min(2).max(160),
  institution: z.string().trim().min(2).max(160),
  location: z.string().trim().max(160).optional().default(''),
  duration: z.string().trim().max(120).optional().default(''),
  status: z.string().trim().min(2).max(60),
  description: z.string().trim().max(2000).optional().default(''),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(160),
  location: z.string().trim().max(160).optional().default(''),
  duration: z.string().trim().max(120).optional().default(''),
  type: z.enum(['internship', 'training']),
  description: z.string().trim().max(3000).optional().default(''),
  technologies: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(120),
  level: z.string().trim().min(2).max(60),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const trainingSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).optional().default(''),
  topics: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(2).max(500),
  description: z.string().trim().max(5000).optional().default(''),
  tech_stack: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  github_url: z.string().trim().max(500).optional().default(''),
  live_url: z.string().trim().max(500).optional().default(''),
  image_path: z.string().trim().max(500).nullable().optional().default(null),
  featured: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(200),
  issuer: z.string().trim().max(160).optional().default(''),
  issue_date: z.string().trim().max(20).optional().default(''),
  credential_url: z.string().trim().max(500).optional().default(''),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  headline: z.string().trim().min(2).max(200),
  about: z.string().trim().max(8000).optional().default(''),
  email: z.email('Please enter a valid email address.').max(200),
  phone: z.string().trim().max(40).optional().default(''),
  location: z.string().trim().max(120).optional().default(''),
  availability: z.string().trim().max(200).optional().default(''),
  github: z.string().trim().max(500).optional().default(''),
  linkedin: z.string().trim().max(500).optional().default(''),
  instagram: z.string().trim().max(500).optional().default(''),
})
