import config from '@payload-config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const repoRoot = path.resolve(dirname, '../../..')

type MediaSeed = {
  key: string
  alt: string
  caption?: string
  file: string
}

const mediaSeeds: MediaSeed[] = [
  {
    key: 'heroDesktop',
    alt: 'Environomics homepage hero background',
    file: 'public/imgs/hero-2560.jpg',
  },
  {
    key: 'heroMobile',
    alt: 'Environomics homepage hero background mobile',
    file: 'public/imgs/hero-1600.jpg',
  },
  {
    key: 'about',
    alt: 'Environomics industrial project team and site overview',
    file: 'imgs/450x600 copy.jpg.jpeg',
  },
  {
    key: 'solarRooftop',
    alt: 'Solar Rooftop',
    file: 'imgs/S1.png',
  },
  {
    key: 'groundMount',
    alt: 'Ground Mount Solar',
    file: 'imgs/S2.png',
  },
  {
    key: 'operationsMaintenance',
    alt: 'Operations & Maintenance',
    file: 'imgs/S3.png',
  },
  {
    key: 'hvac',
    alt: 'HVAC & Clean Room Systems',
    file: 'imgs/HVAC IMAGE.jpeg',
  },
]

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
      caption: seed.caption,
    },
    filePath: path.resolve(repoRoot, seed.file),
  })

  return created.id
}

async function seedHomePage() {
  const payload = await getPayload({ config })
  const media = new Map<string, number>()

  for (const seed of mediaSeeds) {
    media.set(seed.key, await findOrCreateMedia(payload, seed))
  }

  const mediaId = (key: string) => {
    const id = media.get(key)

    if (!id) {
      throw new Error(`Missing seeded media: ${key}`)
    }

    return id
  }

  await payload.updateGlobal({
    slug: 'home-page',
    depth: 0,
    data: {
      title: "India's Trusted Turnkey EPC Partner",
      subtitle: 'Solar, HVAC & Industrial Utilities',
      eyebrow: 'Trusted Industrial Utility Experts',
      description:
        'From 30 kWp rooftop systems to 5 MWp ground mount plants, Environomics engineers, builds, and maintains the utility infrastructure that cuts your energy costs by up to 80%, reduces your carbon output, and keeps your facility running without disruption.',
      heroCtas: [
        {
          label: 'Explore Our Projects',
          href: '/projects',
          icon: 'arrow_forward',
          style: 'primary',
        },
        {
          label: 'Download Our Catalogue',
          href: '/Environomics_EPC_Catalogue_2025.pdf',
          icon: 'download',
          style: 'secondary',
        },
        {
          label: 'Our Culture',
          href: '/culture',
          icon: 'diversity_3',
          style: 'green',
        },
      ],
      primaryCtaLabel: 'Explore Our Projects',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: 'Download Our Catalogue',
      secondaryCtaHref: '/Environomics_EPC_Catalogue_2025.pdf',
      heroImage: mediaId('heroDesktop'),
      heroImageMobile: mediaId('heroMobile'),
      aboutTitle: 'About Environomics',
      aboutBody:
        "For over a decade, Environomics Projects LLP has delivered EPC projects for India's reputed commercial and industrial clients. Based in Ahmedabad, Gujarat, we are a turnkey EPC company we design, procure, build, and maintain the utility infrastructure that runs your operations. That includes megawatt-scale solar plants, pharmaceutical HVAC systems, compressed air networks, and industrial automation.",
      aboutImage: mediaId('about'),
      certifications: [
        { label: 'In-house R&D' },
        { label: 'Quality Components' },
        { label: '24/7 Support' },
      ],
      impactTitle: 'Engineering a Greener Future, Our Verified Global Impact',
      impactCards: [
        {
          icon: 'bolt',
          value: '90,000+ MWh',
          label: 'Clean Energy Generated',
        },
        {
          icon: 'co2',
          value: '72,000 T',
          label: 'CO2 Emissions Avoided',
        },
        {
          icon: 'payments',
          value: '720 M+',
          label: 'Client Energy Savings',
        },
        {
          icon: 'verified',
          value: '125+',
          label: 'Delivered On Time',
          sublabel: 'Across 8+ industrial sectors',
        },
      ],
      videosTitle: 'Environomics Projects',
      videosIntro:
        'Featured from our YouTube presence, with room to add more Environomics videos here.',
      featuredVideos: [
        {
          kind: 'youtube',
          title: 'Environomics Projects',
          youtubeUrl: 'https://youtu.be/c98iCb4pRg4',
        },
        {
          kind: 'placeholder',
          title: 'More Videos Coming Soon',
          description:
            'Use this space for another Environomics YouTube feature, plant walkthrough, or client testimonial.',
        },
      ],
      servicesTitle: 'Specialized Engineering Services',
      services: [
        {
          title: 'Solar Rooftop',
          description:
            'Commercial and industrial rooftop solar solutions engineered for maximum yield and ROI.',
          href: '/services?tab=solar-rooftop',
          image: mediaId('solarRooftop'),
          alt: 'Solar Rooftop',
        },
        {
          title: 'Ground Mount',
          description:
            'Utility-scale deployments with advanced tracking and grid-integration capabilities.',
          href: '/services?tab=ground-mount',
          image: mediaId('groundMount'),
          alt: 'Ground Mount Solar',
        },
        {
          title: 'Operations & Maintenance',
          description:
            'Comprehensive O&M services ensuring peak performance and system longevity.',
          href: '/om',
          image: mediaId('operationsMaintenance'),
          alt: 'Operations & Maintenance',
        },
        {
          title: 'HVAC & Clean Room Systems',
          description:
            'Specialized environmental control for pharmaceutical and high-tech manufacturing.',
          href: '/services?tab=hvac',
          image: mediaId('hvac'),
          alt: 'HVAC & Clean Room Systems',
        },
      ],
    },
  })

  payload.logger.info('Home page content seeded from the current website.')
}

await seedHomePage().catch((error) => {
  console.error(error)
  process.exit(1)
})
