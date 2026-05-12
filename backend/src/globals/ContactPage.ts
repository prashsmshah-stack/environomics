import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: {
    group: 'Pages',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'ctaCards',
      type: 'array',
      label: '4 CTA Cards After Hero',
      minRows: 4,
      maxRows: 4,
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'action', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'external', type: 'checkbox', defaultValue: false },
        { name: 'icon', type: 'text', defaultValue: 'arrow_forward' },
      ],
    },
    {
      name: 'inquiryForm',
      type: 'group',
      label: 'Inquiry Form',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Inquiry Form', required: true },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'Provide your technical requirements below for a detailed assessment.',
        },
        {
          name: 'serviceOptions',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'fields',
          type: 'array',
          admin: {
            description: 'Controls labels/placeholders for the main form fields.',
            initCollapsed: true,
          },
          fields: [
            { name: 'key', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'placeholder', type: 'text' },
            { name: 'type', type: 'text', defaultValue: 'text' },
            { name: 'required', type: 'checkbox', defaultValue: false },
          ],
        },
        { name: 'submitLabel', type: 'text', defaultValue: 'Submit Technical Inquiry' },
        { name: 'successMessage', type: 'textarea' },
      ],
    },
    {
      name: 'facility',
      type: 'group',
      label: 'Visit Our Facilities / Map',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'Corporate Headquarters' },
        { name: 'officeTitle', type: 'text', defaultValue: 'Registered Office' },
        { name: 'companyName', type: 'text', defaultValue: 'Environomics Projects LLP' },
        { name: 'address', type: 'textarea', required: true },
        { name: 'hours', type: 'text', defaultValue: 'Mon to Sat: 9:00 AM to 6:30 PM IST' },
        { name: 'mapTitle', type: 'text', defaultValue: 'Visit Our Facilities' },
        {
          name: 'mapDescription',
          type: 'textarea',
          defaultValue: 'View our engineering studio and live project monitoring centers.',
        },
        {
          name: 'mapDestination',
          type: 'textarea',
          admin: {
            description: 'Only this destination controls the Google Maps query.',
          },
        },
      ],
    },
    {
      name: 'urgentInquiry',
      type: 'group',
      label: 'Urgent Inquiry Box',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Urgent Inquiries?' },
        { name: 'description', type: 'textarea' },
        { name: 'phoneLabel', type: 'text', defaultValue: 'Industrial Hotline (24/7)' },
        { name: 'phone', type: 'text', required: true },
        { name: 'emailLabel', type: 'text', defaultValue: 'Project Support' },
        { name: 'email', type: 'text', required: true },
      ],
    },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'linkedin', type: 'text' },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'handle', type: 'text' },
        { name: 'url', type: 'text', required: true },
        { name: 'logo', type: 'relationship', relationTo: 'media' },
      ],
    },
  ],
}
