import config from '@payload-config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const repoRoot = path.resolve(dirname, '../../..')

const contactAddress = '417 Ratna High Street, Naranpura, Ahmedabad, 380013, Gujarat, India'
const contactEmail = 'sampath.kumar@epl.net.in, engineering@epl.net.in'
const contactPhone = '7981758883'

async function media(payload: Awaited<ReturnType<typeof getPayload>>, alt: string, file: string) {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { alt: { equals: alt } },
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.resolve(repoRoot, file),
  })

  return created.id
}

async function seedSiteSections() {
  const payload = await getPayload({ config })
  const solarRooftop = await media(payload, 'Header Solar Rooftop hover image', 'imgs/S1.png')
  const groundMount = await media(payload, 'Header Ground Mount hover image', 'imgs/S2.png')
  const hvac = await media(payload, 'Header HVAC hover image', 'imgs/HVAC IMAGE.jpeg')
  const footerLogo = await media(payload, 'Footer Environomics white logo', 'imgs/Logo White.png')

  await payload.updateGlobal({
    slug: 'services-header',
    data: {
      items: [
        { title: 'Solar Rooftop Solutions', image: solarRooftop, imageAlt: 'Solar rooftop solutions' },
        { title: 'Ground Mount Solar Plants', image: groundMount, imageAlt: 'Ground mount solar plants' },
        { title: 'HVAC & Pharmaceutical Clean Rooms', image: hvac, imageAlt: 'HVAC and pharmaceutical clean rooms' },
        { title: 'Electrification, Automation & Energy Audits', imageAlt: '' },
      ],
    },
  })

  const galleryItems = []
  for (let index = 1; index <= 12; index += 1) {
    const fileNumber = String(index).padStart(2, '0')
    const title =
      [
        'Wet Testing for Safer Modules',
        'Healthy Panels. Higher Output.',
        'Small Connector. Big Risk.',
        'Inverter Components',
        'Clean Fans Reliable Performance.',
        'Smart Laying Safer Power.',
        'Spread the Load. Reduce the Heat.',
        'Ageing Impact on Solar Assets',
        'Fix the Loose, Stop the Heat.',
        'Harmonics Testing',
        'AC Cable Faults',
        'Healthy Panels. Higher Output.',
      ][index - 1] ?? `Solar O&M Image ${index}`

    galleryItems.push({
      title,
      description: '',
      image: await media(payload, `Solar O&M gallery image ${fileNumber}`, `public/imgs/om/om-gallery-${fileNumber}.jpeg`),
      alt: `${title} - Solar O&M image ${index}`,
    })
  }

  await payload.updateGlobal({
    slug: 'operations-maintenance-page',
    data: {
      galleryCtaLabel: 'View Solar O&M Images',
      galleryItems,
    },
  })

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      phone: contactPhone,
      email: contactEmail,
      address: contactAddress,
      linkedin: 'https://www.linkedin.com/company/environomics-projects-llp/',
      ctaCards: [
        { eyebrow: 'Assessment', title: 'Request a Free Feasibility Assessment', action: 'Get Started', href: '/contact?focus=form', external: false, icon: 'arrow_forward' },
        { eyebrow: 'Resources', title: 'Download Our Project Catalogue', action: 'Download Now', href: '/Environomics_EPC_Catalogue_2025.pdf', external: true, icon: 'download' },
        { eyebrow: 'Success Stories', title: 'View Our Project Portfolio', action: 'Explore Gallery', href: '/projects', external: false, icon: 'arrow_forward' },
        { eyebrow: 'Quick Chat', title: 'Connect with Our Team on WhatsApp', action: 'Open WhatsApp', href: 'https://wa.me/917981758833', external: true, icon: 'chat' },
      ],
      inquiryForm: {
        title: 'Inquiry Form',
        subtitle: 'Provide your technical requirements below for a detailed assessment.',
        serviceOptions: ['Solar Rooftop', 'Ground Mount', 'O&M', 'HVAC', 'Automation', 'Energy Audit', 'Other'].map((label) => ({ label })),
        fields: [
          { key: 'name', label: 'Your Name (required)', placeholder: 'e.g. John Doe', type: 'text', required: true },
          { key: 'company', label: 'Company / Organisation (required)', placeholder: 'e.g. Environomics Ind.', type: 'text', required: true },
          { key: 'designation', label: 'Designation', placeholder: 'e.g. Plant Manager', type: 'text' },
          { key: 'email', label: 'Email Address (required)', placeholder: 'name@company.com', type: 'email', required: true },
          { key: 'phone', label: 'Phone / WhatsApp (required)', placeholder: contactPhone, type: 'tel', required: true },
        ],
        submitLabel: 'Submit Technical Inquiry',
        successMessage: 'Your email app has been opened with the inquiry details. Please send the email to complete your request.',
      },
      facility: {
        badge: 'Corporate Headquarters',
        officeTitle: 'Registered Office',
        companyName: 'Environomics Projects LLP',
        address: contactAddress,
        hours: 'Mon to Sat: 9:00 AM to 6:30 PM IST',
        mapTitle: 'Visit Our Facilities',
        mapDescription: 'View our engineering studio and live project monitoring centers.',
        mapDestination: contactAddress,
      },
      urgentInquiry: {
        title: 'Urgent Inquiries?',
        description: 'For immediate assistance regarding project maintenance or emergency audits, connect with our 24/7 industrial support team.',
        phoneLabel: 'Industrial Hotline (24/7)',
        phone: contactPhone,
        emailLabel: 'Project Support',
        email: contactEmail,
      },
      socials: [
        { platform: 'LinkedIn', handle: '@environomics-projects-llp', url: 'https://www.linkedin.com/company/environomics-projects-llp/' },
        { platform: 'YouTube', handle: 'Environomics Projects', url: 'https://www.youtube.com/watch?v=c98iCb4pRg4' },
        { platform: 'WhatsApp', handle: '+917981758833', url: 'https://wa.me/917981758833' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      logo: footerLogo,
      description: 'Pioneering the industrial transition to sustainable infrastructure through high-precision engineering and EPC excellence.',
      year: '2026',
      services: [
        { label: 'Solar EPC Solutions', href: '/services?tab=solar-rooftop' },
        { label: 'Industrial HVAC', href: '/services?tab=hvac' },
        { label: 'Clean Room Engineering', href: '/services?tab=hvac' },
        { label: 'Electrical Automation', href: '/services?tab=automation' },
        { label: 'O&M Services', href: '/om' },
      ],
      quickLinks: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Our Projects', href: '/projects' },
        { label: 'O&M', href: '/om' },
        { label: 'Our Clients', href: '/clients' },
        { label: 'Testimonials', href: '/testimonials' },
        { label: 'Innovation & R&D', href: '/innovation' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
      bottomWords: [{ label: 'Engineering' }, { label: 'Procurement' }, { label: 'Construction' }],
    },
  })

  payload.logger.info('Seeded services header, Solar O&M, contact page, and footer sections.')
}

await seedSiteSections().catch((error) => {
  console.error(error)
  process.exit(1)
})
