import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const OperationsMaintenancePage: GlobalConfig = {
  slug: 'operations-maintenance-page',
  label: 'Solar O&M Page',
  admin: {
    group: 'Pages',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'galleryCtaLabel',
      type: 'text',
      label: 'Hero CTA Label',
      defaultValue: 'View Solar O&M Images',
      required: true,
    },
    {
      name: 'galleryItems',
      type: 'array',
      label: 'Images Opened by the Hero View CTA',
      admin: {
        description: 'These are the images shown on the Solar O&M gallery page.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
}
