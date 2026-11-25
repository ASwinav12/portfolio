import { Award, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { storageUrl } from '@/lib/storage'
import { absoluteUrl, formatDate } from '@/lib/utils'
import type { Certificate } from '@/lib/types'

export function CertificationsSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section id="certifications" className="section relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials"
          description="Certificates are added here only after they are earned and verified — with the issuing organisation and credential link where available."
        />

        {certificates.length === 0 ? (
          <Reveal className="mt-12">
            <EmptyState
              icon={Award}
              title="No certificates listed yet"
              description="I have not added any certifications so far. This section will be updated as and when credentials are earned — nothing here is invented."
            />
          </Reveal>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate, index) => {
              const file = storageUrl('documents', certificate.file_path)
              const link = absoluteUrl(certificate.credential_url)
              return (
                <Reveal key={certificate.id} delay={(index % 3) * 80}>
                  <Card className="flex h-full flex-col p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                      <Award size={20} strokeWidth={1.7} />
                    </span>
                    <h3 className="mt-4 text-[15.5px] font-semibold leading-snug text-white">
                      {certificate.name}
                    </h3>
                    {certificate.issuer ? (
                      <p className="mt-1 text-[13px] text-cyan-300/90">{certificate.issuer}</p>
                    ) : null}
                    {certificate.issue_date ? (
                      <p className="mt-1 text-[12px] text-slate-500">
                        Issued {formatDate(certificate.issue_date)}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap gap-4 pt-5">
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-300 hover:text-white"
                        >
                          Verify credential <ExternalLink size={12} />
                        </a>
                      ) : null}
                      {file ? (
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-white"
                        >
                          View certificate
                        </a>
                      ) : null}
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
