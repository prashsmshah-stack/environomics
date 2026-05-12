import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { makeAfterDeleteReorderHook, makeBeforeChangeReorderHook } from './reorder'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  admin: {
    defaultColumns: ['name', 'sortOrder', 'updatedAt'],
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
    afterDelete: [makeAfterDeleteReorderHook('clients')],
    beforeChange: [makeBeforeChangeReorderHook('clients')],
  },
  fields: [
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Display Position',
      defaultValue: 100,
      required: true,
      admin: {
        description: 'Set this to 7 to place the logo at position 7. Other logos shift automatically.',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Client Name',
      required: true,
    },
    {
      name: 'logo',
      type: 'relationship',
      label: 'Client Logo',
      relationTo: 'media',
      required: true,
    },
  ],
}
