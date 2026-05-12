import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

const sectionTitle = (name = 'title', label = 'Title') =>
  ({
    name,
    type: 'text',
    label,
    required: true,
  }) as const

const mediaRelationship = (name: string, label: string, required = false) =>
  ({
    name,
    type: 'relationship',
    label,
    relationTo: 'media',
    required,
  }) as const

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Pages',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            sectionTitle('title', 'Main Title'),
            {
              name: 'subtitle',
              type: 'text',
              defaultValue: 'Solar, HVAC & Industrial Utilities',
              required: true,
            },
            {
              name: 'eyebrow',
              type: 'text',
              defaultValue: 'Trusted Industrial Utility Experts',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'From 30 kWp rooftop systems to 5 MWp ground mount plants, Environomics engineers, builds, and maintains the utility infrastructure that cuts your energy costs by up to 80%, reduces your carbon output, and keeps your facility running without disruption.',
              required: true,
            },
            {
              name: 'heroCtas',
              type: 'array',
              label: 'Hero CTA Buttons',
              labels: {
                singular: 'CTA Button',
                plural: 'CTA Buttons',
              },
              admin: {
                description: 'Add, remove, reorder, and edit the three hero calls to action.',
                initCollapsed: true,
              },
              defaultValue: [
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
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  admin: {
                    description: 'Material Symbols icon name, for example arrow_forward.',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary blue', value: 'primary' },
                    { label: 'Glass secondary', value: 'secondary' },
                    { label: 'Green', value: 'green' },
                  ],
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryCtaLabel',
                  type: 'text',
                  defaultValue: 'Explore Our Projects',
                  required: true,
                },
                {
                  name: 'primaryCtaHref',
                  type: 'text',
                  defaultValue: '/projects',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'secondaryCtaLabel',
                  type: 'text',
                  defaultValue: 'Download Our Catalogue',
                },
                {
                  name: 'secondaryCtaHref',
                  type: 'text',
                  defaultValue: '/Environomics_EPC_Catalogue_2025.pdf',
                },
              ],
            },
            mediaRelationship('heroImage', 'Desktop Hero Image'),
            mediaRelationship('heroImageMobile', 'Mobile Hero Image'),
            mediaRelationship('heroVideo', 'Hero Background Video'),
          ],
        },
        {
          label: 'About Environomics',
          fields: [
            {
              ...sectionTitle('aboutTitle', 'Section Title'),
              defaultValue: 'About Environomics',
            },
            {
              name: 'aboutBody',
              type: 'textarea',
              defaultValue:
                "For over a decade, Environomics Projects LLP has delivered EPC projects for India's reputed commercial and industrial clients. Based in Ahmedabad, Gujarat, we are a turnkey EPC company we design, procure, build, and maintain the utility infrastructure that runs your operations. That includes megawatt-scale solar plants, pharmaceutical HVAC systems, compressed air networks, and industrial automation.",
              required: true,
            },
            mediaRelationship('aboutImage', 'About Image'),
            {
              name: 'certifications',
              type: 'array',
              labels: {
                singular: 'Certification',
                plural: 'Certifications',
              },
              defaultValue: [
                { label: 'In-house R&D' },
                { label: 'Quality Components' },
                { label: '24/7 Support' },
              ],
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Verified Global Impact',
          fields: [
            {
              ...sectionTitle('impactTitle', 'Section Title'),
              defaultValue: 'Engineering a Greener Future, Our Verified Global Impact',
            },
            {
              name: 'impactCards',
              type: 'array',
              labels: {
                singular: 'Impact Card',
                plural: 'Impact Cards',
              },
              admin: {
                initCollapsed: true,
              },
              defaultValue: [
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
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  admin: {
                    description: 'Material Symbols icon name used by the frontend.',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'sublabel',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'YouTube Section',
          fields: [
            {
              ...sectionTitle('videosTitle', 'Section Title'),
              defaultValue: 'Environomics Projects',
            },
            {
              name: 'videosIntro',
              type: 'textarea',
              defaultValue:
                'Featured from our YouTube presence, with room to add more Environomics videos here.',
            },
            {
              name: 'featuredVideos',
              type: 'array',
              labels: {
                singular: 'Featured Video',
                plural: 'Featured Videos',
              },
              admin: {
                initCollapsed: true,
              },
              defaultValue: [
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
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  defaultValue: 'youtube',
                  options: [
                    { label: 'YouTube Embed', value: 'youtube' },
                    { label: 'External Video URL', value: 'external' },
                    { label: 'Uploaded Video', value: 'upload' },
                    { label: 'Placeholder', value: 'placeholder' },
                  ],
                  required: true,
                },
                sectionTitle('title', 'Video Title'),
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.kind === 'youtube',
                    description: 'Paste a YouTube watch, share, or embed URL.',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.kind === 'external',
                  },
                },
                mediaRelationship('uploadedVideo', 'Uploaded Video'),
                mediaRelationship('thumbnail', 'Thumbnail Image'),
              ],
            },
          ],
        },
        {
          label: 'Specialized Engineering Services',
          fields: [
            {
              ...sectionTitle('servicesTitle', 'Section Title'),
              defaultValue: 'Specialized Engineering Services',
            },
            {
              name: 'services',
              type: 'array',
              labels: {
                singular: 'Service Card',
                plural: 'Service Cards',
              },
              admin: {
                initCollapsed: true,
              },
              defaultValue: [
                {
                  title: 'Solar Rooftop',
                  description:
                    'Commercial and industrial rooftop solar solutions engineered for maximum yield and ROI.',
                  href: '/services?tab=solar-rooftop',
                  alt: 'Solar Rooftop',
                },
                {
                  title: 'Ground Mount',
                  description:
                    'Utility-scale deployments with advanced tracking and grid-integration capabilities.',
                  href: '/services?tab=ground-mount',
                  alt: 'Ground Mount Solar',
                },
                {
                  title: 'Operations & Maintenance',
                  description:
                    'Comprehensive O&M services ensuring peak performance and system longevity.',
                  href: '/om',
                  alt: 'Operations & Maintenance',
                },
                {
                  title: 'HVAC & Clean Room Systems',
                  description:
                    'Specialized environmental control for pharmaceutical and high-tech manufacturing.',
                  href: '/services?tab=hvac',
                  alt: 'HVAC & Clean Room Systems',
                },
              ],
              fields: [
                sectionTitle('title', 'Service Title'),
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  defaultValue: '/services',
                  required: true,
                },
                mediaRelationship('image', 'Service Image'),
                {
                  name: 'alt',
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
