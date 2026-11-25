import type {
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  SiteContent,
  Skill,
  TrainingModule,
} from '@/lib/types'
import { createClient } from '@/lib/supabase/server'

/**
 * Mirror of the seeded database content.
 *
 * Used only when the database cannot be reached (e.g. a local build without
 * network access). Production always reads live data from Supabase, so Admin
 * Dashboard edits appear on the site without a redeploy.
 */
export const FALLBACK_CONTENT: SiteContent = {
  profile: {
    id: 'local',
    full_name: 'ASWIN A V',
    headline: 'Aspiring DevOps Engineer | Cloud Computing Enthusiast',
    about:
      'I am a Computer Engineering graduate from Kerala with a growing focus on DevOps and cloud infrastructure. My diploma gave me a solid base in computer systems, hardware and programming, which I have built on through a six-month DevOps Engineering programme at Zoople Technologies and a one-month React Development internship at Softroniics.\n\nI enjoy working where development meets operations — writing shell scripts, building CI/CD pipelines, containerising applications, and understanding how infrastructure is provisioned, deployed and monitored. I am currently deepening my practical knowledge of AWS, Kubernetes, Terraform and observability tooling.\n\nI am looking for an entry-level DevOps or Cloud role where I can contribute, learn from experienced engineers and keep growing.',
    email: 'aswinav277@gmail.com',
    phone: '+91 8590318938',
    location: 'Kerala, India',
    availability: 'Open to entry-level DevOps and Cloud opportunities',
    photo_path: null,
    resume_path: null,
    resume_label: null,
    socials: {
      github: 'https://github.com/ASwinav12',
      linkedin: 'https://www.linkedin.com/in/aswin-av-650ab7287/',
      instagram: 'https://www.instagram.com/asw1n.av/',
    },
    updated_at: new Date(0).toISOString(),
  },
  education: [
    {
      id: 'edu-1',
      degree: 'Diploma in Computer Engineering',
      institution: 'Majlis Polytechnic College',
      location: 'Valanchery, Kerala',
      duration: 'Three-year diploma',
      status: 'Completed',
      description:
        'Computer Engineering diploma following the Kerala Polytechnic Revision 2021 curriculum, covering computer fundamentals, architecture, hardware, programming and computer applications.',
      sort_order: 1,
    },
    {
      id: 'edu-2',
      degree: 'Diploma in Computer Applications (DCA)',
      institution: 'Kerala State Rutronix',
      location: 'Kerala',
      duration: null,
      status: 'Completed',
      description:
        'Foundation in computer applications, office productivity tools and everyday computing practice.',
      sort_order: 2,
    },
    {
      id: 'edu-3',
      degree: 'Bachelor of Commerce (B.Com)',
      institution: 'Andhra University',
      location: null,
      duration: 'Online Degree Programme',
      status: 'Currently Pursuing',
      description:
        'Online undergraduate degree programme in commerce, pursued alongside my technical training.',
      sort_order: 3,
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'React Development Intern',
      organization: 'Softroniics',
      location: 'Calicut, Kerala',
      duration: 'One month',
      type: 'internship',
      description:
        'Introductory practical exposure to React and frontend development — building UI components, working with props and state, and understanding how a component-based interface fits together.',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
      sort_order: 1,
    },
    {
      id: 'exp-2',
      role: 'DevOps Engineering Programme',
      organization: 'Zoople Technologies',
      location: 'Calicut, Kerala',
      duration: 'Six months',
      type: 'training',
      description:
        'Structured DevOps and cloud training covering Linux and shell scripting, Git and GitHub, Jenkins CI/CD pipelines, Docker, Kubernetes, Terraform, Ansible, and monitoring with Prometheus and Grafana.',
      technologies: [
        'Linux',
        'Git',
        'Jenkins',
        'CI/CD',
        'Docker',
        'Kubernetes',
        'Terraform',
        'Ansible',
        'Prometheus',
        'Grafana',
      ],
      sort_order: 2,
    },
  ],
  trainingModules: [
    {
      id: 'tr-1',
      title: 'Linux & Shell Scripting',
      description: 'Working comfortably on the command line and automating repetitive work.',
      topics: ['File systems', 'Permissions', 'Processes', 'Bash scripting', 'Systemd'],
      sort_order: 1,
    },
    {
      id: 'tr-2',
      title: 'Cloud with AWS',
      description: 'Core cloud services and how they fit into a deployment.',
      topics: ['EC2', 'S3', 'IAM', 'VPC', 'CloudWatch'],
      sort_order: 2,
    },
    {
      id: 'tr-3',
      title: 'Git, GitHub & GitLab',
      description: 'Version control, branching and collaborative workflows.',
      topics: ['Branching', 'Pull requests', 'Merge conflicts', 'CI integration'],
      sort_order: 3,
    },
    {
      id: 'tr-4',
      title: 'Jenkins & CI/CD Pipelines',
      description: 'Automating build, test and deployment stages.',
      topics: ['Pipeline as code', 'Jenkinsfile', 'Build stages', 'Deployment'],
      sort_order: 4,
    },
    {
      id: 'tr-5',
      title: 'Docker & Containerization',
      description: 'Packaging applications into portable containers.',
      topics: ['Dockerfile', 'Images', 'Compose', 'Registries'],
      sort_order: 5,
    },
    {
      id: 'tr-6',
      title: 'Kubernetes',
      description: 'Orchestrating containers across a cluster.',
      topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps'],
      sort_order: 6,
    },
    {
      id: 'tr-7',
      title: 'Terraform',
      description: 'Provisioning infrastructure as code.',
      topics: ['Providers', 'State', 'Modules', 'Plan & apply'],
      sort_order: 7,
    },
    {
      id: 'tr-8',
      title: 'Ansible',
      description: 'Configuration management and automation.',
      topics: ['Playbooks', 'Inventory', 'Roles', 'Idempotency'],
      sort_order: 8,
    },
    {
      id: 'tr-9',
      title: 'Prometheus & Grafana',
      description: 'Monitoring, dashboards and alerting.',
      topics: ['Metrics', 'Exporters', 'Dashboards', 'Alert rules'],
      sort_order: 9,
    },
    {
      id: 'tr-10',
      title: 'DevSecOps Fundamentals',
      description: 'Building security into the pipeline from the start.',
      topics: ['Secrets management', 'Image scanning', 'Least privilege'],
      sort_order: 10,
    },
    {
      id: 'tr-11',
      title: 'AI for DevOps',
      description: 'Exploring where AI assists automation and operations.',
      topics: ['AIOps concepts', 'Automation assist', 'Observability insights'],
      sort_order: 11,
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Linux', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 1 },
    { id: 'sk-2', name: 'AWS', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 2 },
    { id: 'sk-3', name: 'Git', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 3 },
    { id: 'sk-4', name: 'GitHub', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 4 },
    { id: 'sk-5', name: 'GitLab', category: 'DevOps & Cloud', level: 'Basic Knowledge', sort_order: 5 },
    { id: 'sk-6', name: 'Jenkins', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 6 },
    { id: 'sk-7', name: 'CI/CD', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 7 },
    { id: 'sk-8', name: 'Docker', category: 'DevOps & Cloud', level: 'Practical Exposure', sort_order: 8 },
    { id: 'sk-9', name: 'Kubernetes', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 9 },
    { id: 'sk-10', name: 'Terraform', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 10 },
    { id: 'sk-11', name: 'Ansible', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 11 },
    { id: 'sk-12', name: 'Prometheus', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 12 },
    { id: 'sk-13', name: 'Grafana', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 13 },
    { id: 'sk-14', name: 'Virtualization', category: 'DevOps & Cloud', level: 'Basic Knowledge', sort_order: 14 },
    { id: 'sk-15', name: 'Monitoring & Observability', category: 'DevOps & Cloud', level: 'Currently Learning', sort_order: 15 },
    { id: 'sk-16', name: 'C Programming', category: 'Programming Languages', level: 'Foundational Knowledge', sort_order: 1 },
    { id: 'sk-17', name: 'Python', category: 'Programming Languages', level: 'Foundational Knowledge', sort_order: 2 },
    { id: 'sk-18', name: 'VB.NET', category: 'Programming Languages', level: 'Basic Knowledge', sort_order: 3 },
    { id: 'sk-19', name: 'HTML', category: 'Web Development', level: 'Practical Exposure', sort_order: 1 },
    { id: 'sk-20', name: 'CSS', category: 'Web Development', level: 'Practical Exposure', sort_order: 2 },
    { id: 'sk-21', name: 'JavaScript', category: 'Web Development', level: 'Basic Knowledge', sort_order: 3 },
    { id: 'sk-22', name: 'React Fundamentals', category: 'Frontend Framework', level: 'Practical Exposure', sort_order: 1 },
    { id: 'sk-23', name: 'Computer Fundamentals', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 1 },
    { id: 'sk-24', name: 'Computer Generations', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 2 },
    { id: 'sk-25', name: 'Computer Architecture & Organization', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 3 },
    { id: 'sk-26', name: 'Computer Hardware', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 4 },
    { id: 'sk-27', name: 'Hardware & Software Concepts', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 5 },
    { id: 'sk-28', name: 'Basic Computer Systems', category: 'Computer Engineering', level: 'Foundational Knowledge', sort_order: 6 },
    { id: 'sk-29', name: 'Database Fundamentals', category: 'Database & Applications', level: 'Basic Knowledge', sort_order: 1 },
    { id: 'sk-30', name: 'DBMS Fundamentals', category: 'Database & Applications', level: 'Basic Knowledge', sort_order: 2 },
    { id: 'sk-31', name: 'Computer Applications', category: 'Database & Applications', level: 'Foundational Knowledge', sort_order: 3 },
  ],
  projects: [],
  certificates: [],
}

type Query<T> = Promise<{ data: T | null; error: { message: string } | null }>

async function settle<T>(query: Query<T>, fallback: T, label: string): Promise<T> {
  const { data, error } = await query
  if (error) {
    console.warn(`[content] ${label}: ${error.message} — using local fallback`)
    return fallback
  }
  return (data ?? fallback) as T
}

/** Reads all public portfolio content. Falls back to seeded content offline. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = await createClient()

    const [profile, education, experience, trainingModules, skills, projects, certificates] =
      await Promise.all([
        settle<Profile>(
          supabase.from('profile').select('*').limit(1).maybeSingle() as unknown as Query<Profile>,
          FALLBACK_CONTENT.profile,
          'profile',
        ),
        settle<Education[]>(
          supabase.from('education').select('*').order('sort_order') as unknown as Query<Education[]>,
          FALLBACK_CONTENT.education,
          'education',
        ),
        settle<Experience[]>(
          supabase.from('experience').select('*').order('sort_order') as unknown as Query<Experience[]>,
          FALLBACK_CONTENT.experience,
          'experience',
        ),
        settle<TrainingModule[]>(
          supabase.from('training_modules').select('*').order('sort_order') as unknown as Query<TrainingModule[]>,
          FALLBACK_CONTENT.trainingModules,
          'training_modules',
        ),
        settle<Skill[]>(
          supabase.from('skills').select('*').order('category').order('sort_order') as unknown as Query<Skill[]>,
          FALLBACK_CONTENT.skills,
          'skills',
        ),
        settle<Project[]>(
          supabase.from('projects').select('*').order('sort_order') as unknown as Query<Project[]>,
          FALLBACK_CONTENT.projects,
          'projects',
        ),
        settle<Certificate[]>(
          supabase.from('certificates').select('*').order('sort_order') as unknown as Query<Certificate[]>,
          FALLBACK_CONTENT.certificates,
          'certificates',
        ),
      ])

    return { profile, education, experience, trainingModules, skills, projects, certificates }
  } catch (error) {
    console.warn('[content] database unavailable — using local fallback:', (error as Error).message)
    return FALLBACK_CONTENT
  }
}

/** Reads the public profile row, falling back to the seeded values offline. */
export async function getProfile(): Promise<Profile> {
  try {
    const supabase = await createClient()
    return await settle<Profile>(
      supabase.from('profile').select('*').limit(1).maybeSingle() as unknown as Query<Profile>,
      FALLBACK_CONTENT.profile,
      'profile',
    )
  } catch (error) {
    console.warn('[content] profile unavailable — using local fallback:', (error as Error).message)
    return FALLBACK_CONTENT.profile
  }
}

export const PROFICIENCY_ORDER = [
  'Practical Exposure',
  'Foundational Knowledge',
  'Basic Knowledge',
  'Currently Learning',
]
