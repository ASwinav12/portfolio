import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ASWIN A V — Portfolio',
    short_name: 'ASWIN A V',
    description:
      'Aspiring DevOps Engineer and Cloud Computing enthusiast — portfolio of ASWIN A V.',
    start_url: '/',
    display: 'standalone',
    background_color: '#04060c',
    theme_color: '#04060c',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
