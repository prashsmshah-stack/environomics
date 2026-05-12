import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site Sections',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Pioneering the industrial transition to sustainable infrastructure through high-precision engineering and EPC excellence.',
    },
    { name: 'year', type: 'text', defaultValue: '2026' },
    {
      name: 'services',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'quickLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'bottomWords',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
}
