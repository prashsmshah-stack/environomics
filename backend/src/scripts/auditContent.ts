import config from '@payload-config'
import { getPayload } from 'payload'

type AuditLine = {
  actual: number | string
  expected?: number | string
  label: string
  ok: boolean
}

function pass(ok: boolean) {
  return ok ? 'OK' : 'MISSING'
}

function hasRelationship(value: unknown) {
  return Boolean(value && (typeof value === 'number' || typeof value === 'object'))
}

async function auditContent() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home-page', depth: 1 })
  const servicesHeader = await payload.findGlobal({ slug: 'services-header', depth: 1 })
  const om = await payload.findGlobal({ slug: 'operations-maintenance-page', depth: 1 })
  const contact = await payload.findGlobal({ slug: 'contact-page', depth: 1 })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })
  const projects = await payload.find({ collection: 'projects', depth: 1, limit: 200 })
  const clients = await payload.find({ collection: 'clients', depth: 1, limit: 200 })
  const testimonials = await payload.find({ collection: 'testimonials', depth: 1, limit: 200 })
  const media = await payload.find({ collection: 'media', depth: 0, limit: 500 })
  const pdfCount = media.docs.filter((item) => item.mimeType === 'application/pdf').length

  const lines: AuditLine[] = [
    {
      label: 'Home: hero image',
      ok: hasRelationship(home.heroImage),
      actual: hasRelationship(home.heroImage) ? 'present' : 'missing',
    },
    {
      label: 'Home: about image',
      ok: hasRelationship(home.aboutImage),
      actual: hasRelationship(home.aboutImage) ? 'present' : 'missing',
    },
    {
      label: 'Home: service cards with images',
      expected: 4,
      actual: home.services?.filter((item) => hasRelationship(item.image)).length ?? 0,
      ok: (home.services?.filter((item) => hasRelationship(item.image)).length ?? 0) >= 4,
    },
    {
      label: 'Services header hover items',
      expected: 4,
      actual: servicesHeader.items?.length ?? 0,
      ok: (servicesHeader.items?.length ?? 0) >= 4,
    },
    {
      label: 'Solar O&M gallery images',
      expected: 12,
      actual: om.galleryItems?.filter((item) => hasRelationship(item.image)).length ?? 0,
      ok: (om.galleryItems?.filter((item) => hasRelationship(item.image)).length ?? 0) >= 12,
    },
    {
      label: 'Projects',
      expected: 15,
      actual: projects.totalDocs,
      ok: projects.totalDocs >= 15,
    },
    {
      label: 'Projects with logo + cover',
      expected: 15,
      actual: projects.docs.filter((item) => hasRelationship(item.companyIcon) && hasRelationship(item.image)).length,
      ok: projects.docs.filter((item) => hasRelationship(item.companyIcon) && hasRelationship(item.image)).length >= 15,
    },
    {
      label: 'Clients',
      expected: 32,
      actual: clients.totalDocs,
      ok: clients.totalDocs >= 32,
    },
    {
      label: 'Clients with logo',
      expected: 32,
      actual: clients.docs.filter((item) => hasRelationship(item.logo)).length,
      ok: clients.docs.filter((item) => hasRelationship(item.logo)).length >= 32,
    },
    {
      label: 'Testimonials',
      expected: 15,
      actual: testimonials.totalDocs,
      ok: testimonials.totalDocs >= 15,
    },
    {
      label: 'Testimonials with cover + file',
      expected: 15,
      actual: testimonials.docs.filter(
        (item) => hasRelationship(item.coverImage) && hasRelationship(item.certificateFile),
      ).length,
      ok:
        testimonials.docs.filter(
          (item) => hasRelationship(item.coverImage) && hasRelationship(item.certificateFile),
        ).length >= 15,
    },
    {
      label: 'Individual testimonial PDFs',
      expected: 15,
      actual: pdfCount,
      ok: pdfCount >= 15,
    },
    {
      label: 'Contact: CTA cards',
      expected: 4,
      actual: contact.ctaCards?.length ?? 0,
      ok: (contact.ctaCards?.length ?? 0) === 4,
    },
    {
      label: 'Contact: inquiry fields',
      expected: 5,
      actual: contact.inquiryForm?.fields?.length ?? 0,
      ok: (contact.inquiryForm?.fields?.length ?? 0) >= 5,
    },
    {
      label: 'Footer: logo',
      ok: hasRelationship(footer.logo),
      actual: hasRelationship(footer.logo) ? 'present' : 'missing',
    },
    {
      label: 'Footer: links',
      expected: '5 services / 9 quick links',
      actual: `${footer.services?.length ?? 0} services / ${footer.quickLinks?.length ?? 0} quick links`,
      ok: (footer.services?.length ?? 0) >= 5 && (footer.quickLinks?.length ?? 0) >= 9,
    },
  ]

  for (const line of lines) {
    payload.logger.info(
      `${pass(line.ok)} - ${line.label}: ${line.actual}${line.expected ? ` (expected ${line.expected})` : ''}`,
    )
  }

  const failed = lines.filter((line) => !line.ok)

  if (failed.length) {
    throw new Error(`${failed.length} backend content checks failed.`)
  }

  payload.logger.info(`All ${lines.length} backend content checks passed.`)
}

await auditContent().catch((error) => {
  console.error(error)
  process.exit(1)
})
