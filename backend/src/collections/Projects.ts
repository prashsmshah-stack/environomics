import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { makeAfterDeleteReorderHook, makeBeforeChangeReorderHook } from './reorder'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    defaultColumns: ['name', 'industry', 'year', 'capacity', 'status', 'sortOrder'],
    group: 'Content',
    useAsTitle: 'name',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterDelete: [makeAfterDeleteReorderHook('projects')],
    beforeChange: [makeBeforeChangeReorderHook('projects')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Project Tab',
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
              defaultValue: 100,
              required: true,
              admin: {
                description: 'Lower numbers appear first on the Projects page.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Company Name',
                  required: true,
                },
                {
                  name: 'slug',
                  type: 'text',
                  admin: {
                    description: 'URL key used by case study links, for example honda-india.',
                  },
                  required: true,
                  unique: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'industry',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'year',
                  type: 'text',
                  label: 'Commissioned Year',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'capacity',
                  type: 'text',
                  label: 'Plant Size / Capacity',
                  required: true,
                },
                {
                  name: 'plantType',
                  type: 'text',
                  label: 'Plant Type',
                  defaultValue: 'Solar',
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Project Overview',
              required: true,
            },
            {
              name: 'meta',
              type: 'textarea',
              label: 'Legacy Listing Meta',
              admin: {
                description: 'Keeps compatibility with the existing frontend fallback structure.',
              },
            },
          ],
        },
        {
          label: 'Images & Logo',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'companyIcon',
                  type: 'relationship',
                  label: 'Company Icon / Logo',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'companyIconAlt',
                  type: 'text',
                  label: 'Logo Alt Text',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'image',
                  type: 'relationship',
                  label: 'Case Study Cover Image',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'listingImage',
                  type: 'relationship',
                  label: 'Projects Page Cover Image',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional. If empty, the case study cover image can be used as the listing cover.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'hideListingCover',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'hideListingLogo',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'galleryImages',
              type: 'array',
              label: 'Case Study Gallery Images',
              labels: {
                singular: 'Gallery Image',
                plural: 'Gallery Images',
              },
              admin: {
                description: 'Add, remove, and reorder the images shown inside the project case study.',
                initCollapsed: true,
              },
              fields: [
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
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
