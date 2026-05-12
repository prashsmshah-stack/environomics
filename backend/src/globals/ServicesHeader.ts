import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const ServicesHeader: GlobalConfig = {
  slug: 'services-header',
  label: 'Services Header',
  admin: {
    group: 'Site Sections',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Header Services Hover Images',
      admin: {
        description: 'Only controls the image shown when hovering each Services item in the header.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'imageAlt',
          type: 'text',
        },
      ],
    },
  ],
}
