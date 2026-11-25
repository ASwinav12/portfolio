-- ============================================================================
-- ASWIN A V — Portfolio database schema
-- Project: aswin-av-portfolio
-- ----------------------------------------------------------------------------
-- Security model
--   * Public visitors (anon role) may READ public content only.
--   * The portfolio owner (authenticated, email = aswinav277@gmail.com) may
--     write everything. Authorisation is enforced by Row Level Security.
--   * No service_role key is used anywhere in the application.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Helper: is the current JWT the portfolio owner?
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'aswinav277@gmail.com'
     and coalesce(auth.jwt() ->> 'role', '') = 'authenticated';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- profile — single row with the public identity of the site
-- ----------------------------------------------------------------------------
create table public.profile (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null default 'ASWIN A V',
  headline      text not null default 'Aspiring DevOps Engineer | Cloud Computing Enthusiast',
  about         text,
  email         text,
  phone         text,
  location      text,
  availability  text,
  photo_path    text,
  resume_path   text,
  resume_label  text,
  socials       jsonb not null default '{"github":"","linkedin":"","instagram":""}'::jsonb,
  updated_at    timestamptz not null default now()
);

comment on table public.profile is 'Public portfolio profile (single row).';

-- ----------------------------------------------------------------------------
-- education
-- ----------------------------------------------------------------------------
create table public.education (
  id            uuid primary key default gen_random_uuid(),
  degree        text not null,
  institution   text not null,
  location      text,
  duration      text,
  status        text not null default 'Completed',
  description   text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- experience — internships and training programmes
-- ----------------------------------------------------------------------------
create table public.experience (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  organization  text not null,
  location      text,
  duration      text,
  type          text not null default 'training' check (type in ('internship', 'training')),
  description   text,
  technologies  text[] not null default '{}',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- skills — tagged, categorised, honest proficiency labels
-- ----------------------------------------------------------------------------
create table public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  level       text not null default 'Foundational Knowledge',
  sort_order  integer not null default 0
);

create index if not exists skills_category_idx on public.skills (category, sort_order);

-- ----------------------------------------------------------------------------
-- training_modules — DevOps & Cloud curriculum shown on the site
-- ----------------------------------------------------------------------------
create table public.training_modules (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  topics       text[] not null default '{}',
  sort_order   integer not null default 0
);

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  summary       text not null,
  description   text,
  tech_stack    text[] not null default '{}',
  github_url    text,
  live_url      text,
  image_path    text,
  featured      boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- certificates
-- ----------------------------------------------------------------------------
create table public.certificates (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  issuer          text,
  issue_date      date,
  credential_url  text,
  file_path       text,
  file_type       text check (file_type in ('pdf', 'image')),
  sort_order      integer not null default 0
);

-- ----------------------------------------------------------------------------
-- contact_messages — public enquiries (insert only, never public read)
-- ----------------------------------------------------------------------------
create table public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  company       text,
  enquiry_type  text not null default 'General enquiry',
  subject       text not null,
  message       text not null,
  ip_hash       text,
  status        text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at    timestamptz not null default now(),
  constraint contact_name_length    check (char_length(name) between 2 and 120),
  constraint contact_email_format   check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint contact_subject_length check (char_length(subject) between 2 and 200),
  constraint contact_message_length check (char_length(message) between 10 and 5000)
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_ip_idx on public.contact_messages (ip_hash, created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profile           enable row level security;
alter table public.education         enable row level security;
alter table public.experience        enable row level security;
alter table public.skills            enable row level security;
alter table public.training_modules  enable row level security;
alter table public.projects          enable row level security;
alter table public.certificates      enable row level security;
alter table public.contact_messages  enable row level security;

-- ---------- public read ----------
create policy "profile_public_read"          on public.profile          for select using (true);
create policy "education_public_read"        on public.education        for select using (true);
create policy "experience_public_read"       on public.experience       for select using (true);
create policy "skills_public_read"           on public.skills           for select using (true);
create policy "training_modules_public_read" on public.training_modules for select using (true);
create policy "projects_public_read"         on public.projects         for select using (true);
create policy "certificates_public_read"     on public.certificates     for select using (true);

-- ---------- owner write ----------
create policy "profile_admin_write"          on public.profile          for all using (public.is_admin()) with check (public.is_admin());
create policy "education_admin_write"        on public.education        for all using (public.is_admin()) with check (public.is_admin());
create policy "experience_admin_write"       on public.experience       for all using (public.is_admin()) with check (public.is_admin());
create policy "skills_admin_write"           on public.skills           for all using (public.is_admin()) with check (public.is_admin());
create policy "training_modules_admin_write" on public.training_modules for all using (public.is_admin()) with check (public.is_admin());
create policy "projects_admin_write"         on public.projects         for all using (public.is_admin()) with check (public.is_admin());
create policy "certificates_admin_write"     on public.certificates     for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contact messages: anonymous insert only ----------
create policy "contact_anon_insert" on public.contact_messages for insert to anon with check (true);
create policy "contact_admin_read"  on public.contact_messages for select to authenticated using (public.is_admin());
create policy "contact_admin_write" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "contact_admin_delete" on public.contact_messages for delete to authenticated using (public.is_admin());

-- ============================================================================
-- STORAGE — public read, owner-only write
-- ============================================================================
insert into storage.buckets (id, name, public) values
  ('images', 'images', true),
  ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "images_public_read"    on storage.objects for select using (bucket_id = 'images');
create policy "documents_public_read" on storage.objects for select using (bucket_id = 'documents');

create policy "images_admin_insert"   on storage.objects for insert   to authenticated with check (bucket_id = 'images' and public.is_admin());
create policy "images_admin_update"   on storage.objects for update   to authenticated using (bucket_id = 'images' and public.is_admin());
create policy "images_admin_delete"   on storage.objects for delete   to authenticated using (bucket_id = 'images' and public.is_admin());

create policy "documents_admin_insert" on storage.objects for insert   to authenticated with check (bucket_id = 'documents' and public.is_admin());
create policy "documents_admin_update" on storage.objects for update   to authenticated using (bucket_id = 'documents' and public.is_admin());
create policy "documents_admin_delete" on storage.objects for delete   to authenticated using (bucket_id = 'documents' and public.is_admin());

-- ============================================================================
-- SEED — verified information supplied by ASWIN A V
-- ============================================================================
insert into public.profile (full_name, headline, about, email, phone, location, availability, socials)
values (
  'ASWIN A V',
  'Aspiring DevOps Engineer | Cloud Computing Enthusiast',
  'I am a Computer Engineering graduate from Kerala with a growing focus on DevOps and cloud infrastructure. My diploma gave me a solid base in computer systems, hardware and programming, which I have built on through a six-month DevOps Engineering programme at Zoople Technologies and a one-month React Development internship at Softroniics.

I enjoy working where development meets operations — writing shell scripts, building CI/CD pipelines, containerising applications, and understanding how infrastructure is provisioned, deployed and monitored. I am currently deepening my practical knowledge of AWS, Kubernetes, Terraform and observability tooling.

I am looking for an entry-level DevOps or Cloud role where I can contribute, learn from experienced engineers and keep growing.',
  'aswinav277@gmail.com',
  '+91 8590318938',
  'Kerala, India',
  'Open to entry-level DevOps and Cloud opportunities',
  '{"github":"https://github.com/ASwinav12","linkedin":"https://www.linkedin.com/in/aswin-av-650ab7287/","instagram":"https://www.instagram.com/asw1n.av/"}'::jsonb
);

insert into public.education (degree, institution, location, duration, status, description, sort_order) values
  ('Diploma in Computer Engineering', 'Majlis Polytechnic College', 'Valanchery, Kerala', 'Three-year diploma', 'Completed',
   'Computer Engineering diploma following the Kerala Polytechnic Revision 2021 curriculum, covering computer fundamentals, architecture, hardware, programming and computer applications.', 1),
  ('Diploma in Computer Applications (DCA)', 'Kerala State Rutronix', 'Kerala', NULL, 'Completed',
   'Foundation in computer applications, office productivity tools and everyday computing practice.', 2),
  ('Bachelor of Commerce (B.Com)', 'Andhra University', NULL, 'Online Degree Programme', 'Currently Pursuing',
   'Online undergraduate degree programme in commerce, pursued alongside my technical training.', 3);

insert into public.experience (role, organization, location, duration, type, description, technologies, sort_order) values
  ('React Development Intern', 'Softroniics', 'Calicut, Kerala', 'One month', 'internship',
   'Introductory practical exposure to React and frontend development — building UI components, working with props and state, and understanding how a component-based interface fits together.',
   '{"React","JavaScript","HTML","CSS"}', 1),
  ('DevOps Engineering Programme', 'Zoople Technologies', 'Calicut, Kerala', 'Six months', 'training',
   'Structured DevOps and cloud training covering Linux and shell scripting, Git and GitHub, Jenkins CI/CD pipelines, Docker, Kubernetes, Terraform, Ansible, and monitoring with Prometheus and Grafana.',
   '{"Linux","Git","Jenkins","CI/CD","Docker","Kubernetes","Terraform","Ansible","Prometheus","Grafana"}', 2);

insert into public.training_modules (title, description, topics, sort_order) values
  ('Linux & Shell Scripting', 'Working comfortably on the command line and automating repetitive work.', '{"File systems","Permissions","Processes","Bash scripting","Systemd"}', 1),
  ('Cloud with AWS', 'Core cloud services and how they fit into a deployment.', '{"EC2","S3","IAM","VPC","CloudWatch"}', 2),
  ('Git, GitHub & GitLab', 'Version control, branching and collaborative workflows.', '{"Branching","Pull requests","Merge conflicts","CI integration"}', 3),
  ('Jenkins & CI/CD Pipelines', 'Automating build, test and deployment stages.', '{"Pipeline as code","Jenkinsfile","Build stages","Deployment"}', 4),
  ('Docker & Containerization', 'Packaging applications into portable containers.', '{"Dockerfile","Images","Compose","Registries"}', 5),
  ('Kubernetes', 'Orchestrating containers across a cluster.', '{"Pods","Deployments","Services","ConfigMaps"}', 6),
  ('Terraform', 'Provisioning infrastructure as code.', '{"Providers","State","Modules","Plan & apply"}', 7),
  ('Ansible', 'Configuration management and automation.', '{"Playbooks","Inventory","Roles","Idempotency"}', 8),
  ('Prometheus & Grafana', 'Monitoring, dashboards and alerting.', '{"Metrics","Exporters","Dashboards","Alert rules"}', 9),
  ('DevSecOps Fundamentals', 'Building security into the pipeline from the start.', '{"Secrets management","Image scanning","Least privilege"}', 10),
  ('AI for DevOps', 'Exploring where AI assists automation and operations.', '{"AIOps concepts","Automation assist","Observability insights"}', 11);

insert into public.skills (name, category, level, sort_order) values
  ('Linux',                        'DevOps & Cloud', 'Practical Exposure',   1),
  ('AWS',                          'DevOps & Cloud', 'Currently Learning',   2),
  ('Git',                          'DevOps & Cloud', 'Practical Exposure',   3),
  ('GitHub',                       'DevOps & Cloud', 'Practical Exposure',   4),
  ('GitLab',                       'DevOps & Cloud', 'Basic Knowledge',      5),
  ('Jenkins',                      'DevOps & Cloud', 'Practical Exposure',   6),
  ('CI/CD',                        'DevOps & Cloud', 'Practical Exposure',   7),
  ('Docker',                       'DevOps & Cloud', 'Practical Exposure',   8),
  ('Kubernetes',                   'DevOps & Cloud', 'Currently Learning',   9),
  ('Terraform',                    'DevOps & Cloud', 'Currently Learning',  10),
  ('Ansible',                      'DevOps & Cloud', 'Currently Learning',  11),
  ('Prometheus',                   'DevOps & Cloud', 'Currently Learning',  12),
  ('Grafana',                      'DevOps & Cloud', 'Currently Learning',  13),
  ('Virtualization',               'DevOps & Cloud', 'Basic Knowledge',     14),
  ('Monitoring & Observability',   'DevOps & Cloud', 'Currently Learning',  15),
  ('C Programming',                'Programming Languages', 'Foundational Knowledge', 1),
  ('Python',                       'Programming Languages', 'Foundational Knowledge', 2),
  ('VB.NET',                       'Programming Languages', 'Basic Knowledge',       3),
  ('HTML',                         'Web Development', 'Practical Exposure', 1),
  ('CSS',                          'Web Development', 'Practical Exposure', 2),
  ('JavaScript',                   'Web Development', 'Basic Knowledge',    3),
  ('React Fundamentals',           'Frontend Framework', 'Practical Exposure', 1),
  ('Computer Fundamentals',        'Computer Engineering', 'Foundational Knowledge', 1),
  ('Computer Generations',         'Computer Engineering', 'Foundational Knowledge', 2),
  ('Computer Architecture & Organization', 'Computer Engineering', 'Foundational Knowledge', 3),
  ('Computer Hardware',            'Computer Engineering', 'Foundational Knowledge', 4),
  ('Hardware & Software Concepts', 'Computer Engineering', 'Foundational Knowledge', 5),
  ('Basic Computer Systems',       'Computer Engineering', 'Foundational Knowledge', 6),
  ('Database Fundamentals',        'Database & Applications', 'Basic Knowledge', 1),
  ('DBMS Fundamentals',            'Database & Applications', 'Basic Knowledge', 2),
  ('Computer Applications',        'Database & Applications', 'Foundational Knowledge', 3);
