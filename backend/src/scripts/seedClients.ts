import config from '@payload-config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const repoRoot = path.resolve(dirname, '../../..')

type ClientSeed = {
  file: string
  name: string
}

const clients: ClientSeed[] = [
  { name: 'GRG Cotspin', file: 'imgs/grg-cotspin-logo-file_043e1bdf2bc6.png' },
  { name: 'Honda India', file: 'imgs/honda logo.jpeg' },
  { name: 'Welspun Group', file: 'imgs/welspun-group-logo-file_691e4428648d.png' },
  { name: 'Otsuka Pharmaceuticals', file: 'imgs/otsuka-pharmaceuticals-logo-file_354705f3c73c.png' },
  { name: 'Baxter Pharmaceutical', file: 'imgs/baxter-pharma.png' },
  { name: 'Siemens Energy', file: 'imgs/siemens-energy-logo-file_168dd66dfbe0.png' },
  { name: 'Jindal', file: 'imgs/jindal-logo-file_bcdd5088a36a.png' },
  { name: 'Raviraj Foils', file: 'imgs/raviraj-foils-logo.png' },
  { name: 'Amol Minechem', file: 'imgs/amol logo.jpg' },
  { name: 'Akash Fashion', file: 'imgs/akash-fashion-logo-file_3d02fd9f2d7e.png' },
  { name: 'Somany Evergreen', file: 'imgs/somany-evergreen-logo-file_6b618d4ad7ec.png' },
  { name: 'Monginis Foods', file: 'imgs/monginis-foods-logo-file_40d1304548f9.png' },
  { name: 'Fuji SilverTech', file: 'imgs/fuji-silvertech.png' },
  { name: 'Colgate-Palmolive', file: 'imgs/colgate-palmolive.png' },
  { name: 'Rohan Dyes (RDL)', file: 'imgs/rohan-dyes-rdl-logo-file_47fd7fb33496.png' },
  { name: 'Delhi University', file: 'imgs/delhi-university-logo-file_7c6be9bd037e.png' },
  { name: 'DPS Bopal', file: 'imgs/dps-bopal-logo-file_0a08270638a7.png' },
  { name: 'Busch Vacuum', file: 'imgs/busch-vacuum.png' },
  { name: 'JMC Paper', file: 'imgs/jmc-paper-logo-file_9a5baf8a06b3.png' },
  { name: 'Aqseptence', file: 'imgs/aqseptence-logo-file_509cbaf36a71.png' },
  { name: 'Screenotex', file: 'imgs/screenotex-logo-file_24f693b9a209.png' },
  { name: 'CTM Technical Textiles', file: 'imgs/ctm-technical-textiles-logo-file_f6c0469883d1.png' },
  { name: 'RSL Dye & Chemical', file: 'imgs/rsl-dye-chemical-logo-file_78afe19a0b85.png' },
  { name: 'Raghuvir Exim', file: 'imgs/raghuvir-exim-logo-file_8d24d8396597.png' },
  { name: 'Swiss', file: 'imgs/swiss-logo-file_8766853106b7.png' },
  { name: 'Wideangle', file: 'imgs/wideangle-logo-file_030cc7809828.png' },
  { name: 'Western Shellcast', file: 'imgs/2024_western_pal_shellcast.png' },
  { name: 'HYS Lifecare', file: 'imgs/hys-lifecare-logo-file_25823f7f8690.jpg' },
  { name: 'Bharat Beams', file: 'imgs/bharat-beams-logo-file_bd0d1c734d32.png' },
  { name: 'Dangee Dums', file: 'imgs/Dangee Dums logo.jpeg' },
  { name: 'Shree Bhagwat Vidyapith Trust', file: 'imgs/Shree Bhagwat Vidyapith Trust Logo.jpeg' },
  { name: 'The Pioneer Magnesia Works', file: 'imgs/The Pioneer Magnesia Works logo.jpeg' },
]

async function findOrCreateMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  client: ClientSeed,
): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: {
      alt: {
        equals: `${client.name} logo`,
      },
    },
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: `${client.name} logo`,
    },
    filePath: path.resolve(repoRoot, client.file),
  })

  return created.id
}

async function seedClients() {
  const payload = await getPayload({ config })

  for (const [index, client] of clients.entries()) {
    const logo = await findOrCreateMedia(payload, client)
    const sortOrder = index + 1
    const existing = await payload.find({
      collection: 'clients',
      depth: 0,
      limit: 1,
      where: {
        name: {
          equals: client.name,
        },
      },
    })

    const data = {
      name: client.name,
      logo,
      sortOrder,
    }

    if (existing.docs[0]) {
      await payload.update({
        id: existing.docs[0].id,
        collection: 'clients',
        context: { skipSortOrderSync: true },
        data,
      })
    } else {
      await payload.create({
        collection: 'clients',
        context: { skipSortOrderSync: true },
        data,
      })
    }
  }

  payload.logger.info(`Seeded ${clients.length} clients from the current website.`)
}

await seedClients().catch((error) => {
  console.error(error)
  process.exit(1)
})
