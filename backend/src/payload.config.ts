import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Clients } from './collections/Clients'
import { Projects } from './collections/Projects'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { ContactPage } from './globals/ContactPage'
import { Footer } from './globals/Footer'
import { OperationsMaintenancePage } from './globals/OperationsMaintenancePage'
import { ServicesHeader } from './globals/ServicesHeader'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Environomics CMS',
    },
  },
  collections: [Users, Media, Projects, Clients, Testimonials],
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
  editor: lexicalEditor(),
  globals: [HomePage, ServicesHeader, OperationsMaintenancePage, ContactPage, Footer],
  secret: process.env.PAYLOAD_SECRET || 'dev-only-change-this-secret',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },
})
