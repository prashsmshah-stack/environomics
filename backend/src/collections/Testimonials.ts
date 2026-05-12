import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { makeAfterDeleteReorderHook, makeBeforeChangeReorderHook } from './reorder'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  admin: {
    defaultColumns: ['title', 'tag', 'installed', 'capacity', 'status', 'sortOrder'],
    group: 'Content',
    useAsTitle: 'title',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterDelete: [makeAfterDeleteReorderHook('testimonials')],
    beforeChange: [makeBeforeChangeReorderHook('testimonials')],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Display Position',
      defaultValue: 100,
      required: true,
      admin: {
        description: 'Set this to 7 to place the testimonial at position 7. Others shift automatically.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Company / Testimonial Title',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'Client Reference',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'capacity',
          type: 'text',
        },
        {
          name: 'installed',
          type: 'text',
          label: 'Installed / Year',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'relationship',
      label: 'Cover Image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'certificateFile',
      type: 'relationship',
      label: 'Individual Certificate File',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload the company-specific PDF or another file opened when this card is clicked.',
      },
    },
  ],
}
