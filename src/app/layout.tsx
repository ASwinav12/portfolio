import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const description =
  'Portfolio of ASWIN A V — an aspiring DevOps Engineer and Cloud Computing enthusiast from Kerala, India. Computer Engineering background, six-month DevOps training at Zoople Technologies, and hands-on learning across Linux, CI/CD, Docker, Kubernetes, Terraform and AWS.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ASWIN A V | Aspiring DevOps Engineer & Cloud Computing Enthusiast',
    template: '%s | ASWIN A V',
  },
  description,
  keywords: [
    'ASWIN A V',
    'DevOps Engineer',
    'Cloud Computing',
    'Kerala',
    'Linux',
    'CI/CD',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS',
    'Entry level DevOps',
    'Portfolio',
  ],
  authors: [{ name: 'ASWIN A V', url: siteUrl }],
  creator: 'ASWIN A V',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'ASWIN A V — Portfolio',
    title: 'ASWIN A V | Aspiring DevOps Engineer & Cloud Computing Enthusiast',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASWIN A V | Aspiring DevOps Engineer & Cloud Computing Enthusiast',
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#04060c',
  width: 'device-width',
  initialScale: 1,
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'ASWIN A V',
  email: 'mailto:aswinav277@gmail.com',
  telephone: '+91 8590318938',
  url: siteUrl,
  jobTitle: 'Aspiring DevOps Engineer',
  description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kerala',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/ASwinav12',
    'https://www.linkedin.com/in/aswin-av-650ab7287/',
    'https://www.instagram.com/asw1n.av/',
  ],
  knowsAbout: [
    'Linux',
    'AWS',
    'Git',
    'GitHub',
    'GitLab',
    'Jenkins',
    'CI/CD',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Ansible',
    'Prometheus',
    'Grafana',
    'Monitoring and Observability',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="relative min-h-screen bg-[#04060c] font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
