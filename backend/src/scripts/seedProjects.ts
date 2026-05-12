import config from '@payload-config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const repoRoot = path.resolve(dirname, '../../..')

type MediaSeed = {
  alt: string
  file: string
}

type ProjectSeed = {
  capacity: string
  cover: string
  description: string
  gallery?: string[]
  industry: string
  listingCover?: string
  logo: string
  name: string
  plantType?: string
  sortOrder: number
  year: string
}

const projects: ProjectSeed[] = [
  {
    name: 'GRG COTSPIN',
    industry: 'Textiles',
    capacity: '4,200 kWp Solar',
    year: '2023',
    description: '2023  TEXTILES  Largest single install. Anchor proof point.',
    cover: 'public/imgs/projects/grg-cotspin.jpg',
    logo: 'imgs/grg-cotspin-logo-file_043e1bdf2bc6.png',
    gallery: ['imgs/GRG IMAGE 1.jpeg', 'imgs/GRG IMAGE 2.jpeg', 'imgs/GRG IMAGE 3.jpeg'],
    sortOrder: 10,
  },
  {
    name: 'HONDA INDIA',
    industry: 'Automotive',
    capacity: '2,500 kWp Solar',
    year: '2023',
    description: '2023  AUTOMOTIVE  Global brand. Highest name recognition.',
    cover: 'public/imgs/projects/honda-india.jpg',
    logo: 'imgs/honda logo.jpeg',
    gallery: [
      'imgs/HONDA IMAGE 1.jpeg',
      'imgs/HONDA IMAGE 2.jpeg',
      'imgs/HONDA IMAGE 3.jpeg',
      'imgs/HONDA IMAGE 4.jpeg',
    ],
    sortOrder: 20,
  },
  {
    name: 'OTSUKA PHARMACEUTICALS',
    industry: 'Pharma',
    capacity: '2,024 kWp Solar',
    year: '2018',
    description: '2018  PHARMA  7 yrs live  Longevity proof. Still above P50 in 2025.',
    cover: 'imgs/otsuka cover image.jpeg',
    logo: 'imgs/otsuka-pharmaceuticals-logo-file_354705f3c73c.png',
    gallery: [
      'imgs/OTSUKA IMAGE 1.jpeg',
      'imgs/OTSUKA IMAGE 2.jpeg',
      'imgs/OTSUKA IMAGE 3.jpeg',
      'imgs/OTSUKA IMAGE 4.jpeg',
    ],
    sortOrder: 30,
  },
  {
    name: 'WELSPUN GROUP',
    industry: 'Textiles',
    capacity: '2,000 kWp Solar',
    year: '2024',
    description: '2024  TEXTILES  National conglomerate. Scale + recency.',
    cover: 'public/imgs/projects/welspun-group.jpg',
    logo: 'imgs/welspun-group-logo-file_691e4428648d.png',
    gallery: [
      'imgs/welspun gallary1.jpeg',
      'imgs/welspun gallary2.jpeg',
      'imgs/welspun gallary3.jpeg',
      'imgs/welspun gallary 4.jpeg',
    ],
    sortOrder: 40,
  },
  {
    name: 'SIEMENS ENERGY',
    industry: 'Engineering',
    capacity: '1,300 kWp Solar',
    year: '2023',
    description: '2023  ENGINEERING  Global MNC. Strongest credibility signal.',
    cover: 'public/imgs/projects/siemens-energy.jpg',
    logo: 'imgs/siemens-energy-logo-file_168dd66dfbe0.png',
    gallery: [
      'imgs/SIEMENS IMAGE 1.jpeg',
      'imgs/SIEMENS IMAGE 2.jpeg',
      'imgs/SIEMENS IMAGE 3.jpeg',
      'imgs/SIEMENS IMAGE 4.jpeg',
      'imgs/SIEMENS IMAGE 5.jpeg',
      'imgs/SIEMENS IMAGE 6.jpeg',
    ],
    sortOrder: 50,
  },
  {
    name: 'BAXTER PHARMA',
    industry: 'Pharma',
    capacity: '1,300 kWp Solar',
    year: '2024',
    description: '2024  PHARMA  Global pharma MNC. GMP-grade proof.',
    cover: 'imgs/baxter cover image.jpeg',
    listingCover: 'imgs/baxter cover image final.jpeg',
    logo: 'imgs/baxter-pharma.png',
    gallery: ['imgs/BAXTER IMAGES 1.jpeg', 'imgs/BAXTER IMAGE 5.jpeg'],
    sortOrder: 60,
  },
  {
    name: 'COLGATE-PALMOLIVE',
    industry: 'FMCG',
    capacity: '250 kWp Solar',
    year: '2025',
    description: '2025  FMCG  Household global name. FMCG diversity.',
    cover: 'public/imgs/projects/colgate-palmolive.jpg',
    logo: 'imgs/colgate-palmolive.png',
    gallery: [
      'imgs/COLGATE IMAGES 1.jpeg',
      'imgs/COLGATE IMAGES 2.jpeg',
      'imgs/COLGATE IMAGES 3.jpeg',
      'imgs/COLGATE IMAGES 4.jpeg',
      'imgs/COLGATE IMAGES 5.jpeg',
    ],
    sortOrder: 70,
  },
  {
    name: 'AMOL MINECHEM',
    industry: 'Chemicals',
    capacity: '1,899 kWp Solar',
    year: '2022-23',
    description: '2022-23  CHEMICALS  Largest chemicals install. Sector diversity.',
    cover: 'public/imgs/projects/amol-minechem.jpg',
    logo: 'imgs/amol logo.jpg',
    gallery: [
      'imgs/AMOL MINECHEM IMAGE 1.jpeg',
      'imgs/AMOL MINECHEM IMAGE 2.jpeg',
      'imgs/AMOL MINECHEM IMAGE 3.jpeg',
      'imgs/AMOL MINECHEM IMAGE 4.jpeg',
    ],
    sortOrder: 80,
  },
  {
    name: 'RAVIRAJ FOILS',
    industry: 'Manufacturing',
    capacity: '1,899 kWp Solar',
    year: '2022-23',
    description: '2022-23  MANUFACTURING  Multi-phase proof. Repeat-client signal.',
    cover: 'public/imgs/projects/raviraj-foils.png',
    logo: 'imgs/raviraj-foils-logo.png',
    gallery: [
      'imgs/RAVIRAJ FOILS IMAGE 1.jpeg',
      'imgs/RAVIRAJ FOILS IMAGE 2.jpeg',
      'imgs/RAVIRAJ FOILS IMAGE 3.jpeg',
    ],
    sortOrder: 90,
  },
  {
    name: 'AKASH FASHION',
    industry: 'Textiles',
    capacity: '999 kWp Solar',
    year: '2021',
    description: '2021  TEXTILES  Sub-MW to MW scale. Textiles depth.',
    cover: 'public/imgs/projects/akash-fashion.jpg',
    logo: 'imgs/akash-fashion-logo-file_3d02fd9f2d7e.png',
    gallery: [
      'imgs/AKASH FASHION IMAGE 1.jpeg',
      'imgs/AKASH FASHION IMAGE 2.jpeg',
      'imgs/AKASH FASHION IMAGE 3.jpeg',
      'imgs/AKASH FASHION IMAGE 4.jpeg',
    ],
    sortOrder: 100,
  },
  {
    name: 'MONGINIS FOODS',
    industry: 'Food & Bev',
    capacity: '780 kWp Solar',
    year: '2018',
    description: '2018  FOOD & BEV  Recognisable brand. Food sector coverage.',
    cover: 'public/imgs/projects/monginis-foods.jpg',
    logo: 'imgs/monginis-foods-logo-file_40d1304548f9.png',
    gallery: ['imgs/MONGINIES IMAGE 1.jpeg'],
    sortOrder: 110,
  },
  {
    name: 'ROHAN DYES (RDL)',
    industry: 'Chemicals',
    capacity: '325 kWp Solar',
    year: '2020',
    description: '2020  CHEMICALS  Chemical sector breadth. Steady delivery.',
    cover: 'public/imgs/projects/rohan-dyes-rdl.jpg',
    logo: 'imgs/rohan-dyes-rdl-logo-file_47fd7fb33496.png',
    gallery: ['imgs/ROHAN DYES IMAGE 1.jpeg', 'imgs/ROHAN DYES  IMAGE 2.jpeg'],
    sortOrder: 120,
  },
  {
    name: 'FUJI SILVERTECH',
    industry: 'Manufacturing',
    capacity: '528.5 kWp Solar',
    year: '2025',
    description: '2025  MANUFACTURING  Most recent. Above yield.',
    cover: 'public/imgs/projects/fuji-silvertech.jpg',
    logo: 'imgs/fuji-silvertech.png',
    gallery: [
      'imgs/FUJI SILVERTECH IMAGE 1.jpeg',
      'imgs/FUJI SILVERTECH IMAGE 2.jpeg',
      'imgs/FUJI SILVERTECH IMAGE 3.jpeg',
      'imgs/FUJI SILVERTECH IMAGE 4.jpeg',
      'imgs/FUJI SILVERTECH IMAGE 5.jpeg',
    ],
    sortOrder: 130,
  },
  {
    name: 'SOMANY EVERGREEN',
    industry: 'Tiles / MFG',
    capacity: '900 kWp Solar',
    year: '2022',
    description: '2022  TILES / MFG  Known Indian brand. Tiles sector unique.',
    cover: 'public/imgs/projects/somany-evergreen.jpg',
    logo: 'imgs/somany-evergreen-logo-file_6b618d4ad7ec.png',
    gallery: [
      'imgs/SOMAY IMAGE 1.jpeg',
      'imgs/SOMAY IMAGE 2.jpeg',
      'imgs/SOMAY IMAGE 3.jpeg',
      'imgs/SOMAY IMAGE 4.jpeg',
      'imgs/SOMAY IMAGE 5.jpeg',
    ],
    sortOrder: 140,
  },
  {
    name: 'BUSCH VACUUM',
    industry: 'Engineering',
    capacity: '72 kWp Solar + HVAC',
    year: '2020',
    description: '2020  ENGINEERING  Dual-service (Solar + HVAC).',
    cover: 'public/imgs/projects/busch-vacuum.jpg',
    logo: 'imgs/busch-vacuum.png',
    gallery: [
      'imgs/BUSCH VACUUM IMAGE 1.jpeg',
      'imgs/BUSCH VACUUM IMAGE 2.jpeg',
      'imgs/BUSCH VACUUM IMAGE 3.jpeg',
      'imgs/BUSH VACUUM IMAGE 4.jpeg',
    ],
    sortOrder: 150,
  },
]

function normalizeProjectSlug(value = '') {
  return (
    String(value ?? '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'
  )
}

async function findOrCreateMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  seed: MediaSeed,
): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: {
      alt: {
        equals: seed.alt,
      },
    },
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: seed.alt,
    },
    filePath: path.resolve(repoRoot, seed.file),
  })

  return created.id
}

async function seedProjects() {
  const payload = await getPayload({ config })

  for (const project of projects) {
    const slug = normalizeProjectSlug(project.name)
    const logo = await findOrCreateMedia(payload, {
      alt: `${project.name} logo`,
      file: project.logo,
    })
    const cover = await findOrCreateMedia(payload, {
      alt: `${project.name} case study cover image`,
      file: project.cover,
    })
    const listingCover = project.listingCover
      ? await findOrCreateMedia(payload, {
          alt: `${project.name} projects page cover image`,
          file: project.listingCover,
        })
      : undefined

    const galleryImages = []

    for (const [index, file] of (project.gallery ?? []).entries()) {
      galleryImages.push({
        image: await findOrCreateMedia(payload, {
          alt: `${project.name} site image ${index + 1}`,
          file,
        }),
        alt: `${project.name} site image ${index + 1}`,
      })
    }

    const data = {
      status: 'published' as const,
      sortOrder: project.sortOrder,
      name: project.name,
      slug,
      industry: project.industry,
      year: project.year,
      capacity: project.capacity,
      plantType: project.plantType ?? 'Solar',
      description: project.description,
      meta: project.description,
      companyIcon: logo,
      companyIconAlt: `${project.name} Logo`,
      image: cover,
      listingImage: listingCover,
      hideListingCover: false,
      hideListingLogo: false,
      galleryImages,
    }

    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        id: existing.docs[0].id,
        collection: 'projects',
        data,
      })
    } else {
      await payload.create({
        collection: 'projects',
        data,
      })
    }
  }

  payload.logger.info(`Seeded ${projects.length} projects from the current website.`)
}

await seedProjects().catch((error) => {
  console.error(error)
  process.exit(1)
})
