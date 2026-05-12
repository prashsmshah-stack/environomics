import config from '@payload-config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const repoRoot = path.resolve(dirname, '../../..')
const generatedDir = path.resolve(dirname, '../../.seed-generated/testimonials')
const sourcePdfPath = path.resolve(repoRoot, 'public/downloads/customer-testimonial-certificates-scan.pdf')

const standardDescription =
  'Live, commissioned installation with documented performance data and ongoing operations support.'

type TestimonialSeed = {
  capacity: string
  coverImage: string
  id: string
  installed: string
  page: number
  tag: string
  title: string
}

const testimonials: TestimonialSeed[] = [
  {
    id: 'wide-angle-2017',
    title: 'Wide Angle',
    tag: 'Industrial Solar',
    capacity: '120 kWp',
    installed: '2017',
    coverImage: 'public/imgs/testimonials/testimonial-1.png',
    page: 2,
  },
  {
    id: 'loyal-equipments-2017',
    title: 'Loyal Equipments Ltd',
    tag: 'Industrial Solar',
    capacity: '120 kWp',
    installed: '2017',
    coverImage: 'public/imgs/testimonials/testimonial-2.png',
    page: 5,
  },
  {
    id: 'otsuka-pharmaceutical-2018',
    title: 'Otsuka Pharmaceutical India Pvt. Ltd.',
    tag: 'Pharma',
    capacity: '2024 kWp',
    installed: '2018',
    coverImage: 'public/imgs/testimonials/testimonial-3.png',
    page: 7,
  },
  {
    id: 'bharat-beams-2018',
    title: 'Bharat Beams Pvt Ltd',
    tag: 'Industrial Solar',
    capacity: '122 kWp',
    installed: '2018',
    coverImage: 'public/imgs/testimonials/testimonial-4.png',
    page: 10,
  },
  {
    id: 'busch-vacuum-2020',
    title: 'Busch Vacuum India Private Limited',
    tag: 'Engineering',
    capacity: '72 kWp',
    installed: '2020',
    coverImage: 'public/imgs/testimonials/testimonial-5.png',
    page: 13,
  },
  {
    id: 'swiss-pharma-2021',
    title: 'Swiss Pharma Pvt Ltd',
    tag: 'Pharma',
    capacity: '200 kWp',
    installed: '2021',
    coverImage: 'public/imgs/testimonials/testimonial-6.png',
    page: 14,
  },
  {
    id: 'somany-evergreen-2022',
    title: 'Somany Evergreen Knits Ltd',
    tag: 'Manufacturing',
    capacity: '900 kWp',
    installed: '2022',
    coverImage: 'public/imgs/testimonials/testimonial-8.png',
    page: 18,
  },
  {
    id: 'raviraj-foils-2022',
    title: 'Raviraj Foils Ltd',
    tag: 'Manufacturing',
    capacity: '2100 kWp',
    installed: '2022',
    coverImage: 'public/imgs/testimonials/testimonial-9.png',
    page: 21,
  },
  {
    id: 'siemens-energy-2023',
    title: 'Siemens Energy',
    tag: 'Engineering',
    capacity: '1300 kWp',
    installed: '2023',
    coverImage: 'public/imgs/testimonials/testimonial-10.png',
    page: 23,
  },
  {
    id: 'johnson-screens-2023',
    title: 'Johnson Screens',
    tag: 'Industrial Solar',
    capacity: '170 kWp',
    installed: '2023',
    coverImage: 'public/imgs/testimonials/testimonial-11.png',
    page: 27,
  },
  {
    id: 'honda-motorcycle-2023',
    title: 'Honda Motorcycle & Scooter India Pvt. Ltd',
    tag: 'Automotive',
    capacity: '2500 kWp',
    installed: '2023',
    coverImage: 'public/imgs/testimonials/testimonial-12.png',
    page: 28,
  },
  {
    id: 'baxter-pharmaceuticals-2024',
    title: 'Baxter Pharmaceuticals India Private Ltd',
    tag: 'Pharma',
    capacity: '1300 kWp',
    installed: '2024',
    coverImage: 'public/imgs/testimonials/testimonial-13.png',
    page: 29,
  },
  {
    id: 'loyal-equipments-2024',
    title: 'Loyal Equipments Ltd',
    tag: 'Industrial Solar',
    capacity: '250 kWp',
    installed: '2024',
    coverImage: 'public/imgs/testimonials/johnson-screens.png',
    page: 27,
  },
  {
    id: 'fuji-silvertech-2024',
    title: 'Fuji Silvertech',
    tag: 'Manufacturing',
    capacity: '525.8 kWp',
    installed: '2024',
    coverImage: 'public/imgs/testimonials/testimonial-15.png',
    page: 32,
  },
  {
    id: 'colgate-palmolive-2025',
    title: 'Colgate Palmolive India Ltd',
    tag: 'FMCG',
    capacity: '250 kWp',
    installed: '2025',
    coverImage: 'public/imgs/testimonials/testimonial-16.png',
    page: 35,
  },
]

function fileSafe(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function splitCertificatePdf(seed: TestimonialSeed, sourcePdf: PDFDocument) {
  await mkdir(generatedDir, { recursive: true })

  const pdf = await PDFDocument.create()
  const [page] = await pdf.copyPages(sourcePdf, [seed.page - 1])
  pdf.addPage(page)

  const bytes = await pdf.save()
  const outputPath = path.join(generatedDir, `${fileSafe(seed.id)}.pdf`)
  await writeFile(outputPath, bytes)
  return outputPath
}

async function findOrCreateMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  {
    alt,
    filePath,
  }: {
    alt: string
    filePath: string
  },
): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: {
      alt: {
        equals: alt,
      },
    },
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt,
    },
    filePath,
  })

  return created.id
}

async function seedTestimonials() {
  const payload = await getPayload({ config })
  const sourcePdfBytes = await readFile(sourcePdfPath)
  const sourcePdf = await PDFDocument.load(sourcePdfBytes)

  for (const [index, testimonial] of testimonials.entries()) {
    const coverImage = await findOrCreateMedia(payload, {
      alt: `${testimonial.title} ${testimonial.installed} testimonial cover image`,
      filePath: path.resolve(repoRoot, testimonial.coverImage),
    })
    const certificatePath = await splitCertificatePdf(testimonial, sourcePdf)
    const certificateFile = await findOrCreateMedia(payload, {
      alt: `${testimonial.title} ${testimonial.installed} individual testimonial certificate`,
      filePath: certificatePath,
    })

    const data = {
      status: 'published' as const,
      sortOrder: index + 1,
      title: testimonial.title,
      tag: testimonial.tag,
      subtitle: 'Client Reference',
      capacity: testimonial.capacity,
      installed: testimonial.installed,
      description: standardDescription,
      coverImage,
      certificateFile,
    }

    const existing = await payload.find({
      collection: 'testimonials',
      depth: 0,
      limit: 1,
      where: {
        title: {
          equals: testimonial.title,
        },
        installed: {
          equals: testimonial.installed,
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        id: existing.docs[0].id,
        collection: 'testimonials',
        context: { skipSortOrderSync: true },
        data,
      })
    } else {
      await payload.create({
        collection: 'testimonials',
        context: { skipSortOrderSync: true },
        data,
      })
    }
  }

  payload.logger.info(`Seeded ${testimonials.length} testimonials with individual PDFs.`)
}

await seedTestimonials().catch((error) => {
  console.error(error)
  process.exit(1)
})
