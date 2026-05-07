import { factories } from '@strapi/strapi';

const CONTACT_PAGE_UID = 'api::contact-page.contact-page' as any;
const CTA_CARD_PRESENTATION = [
  {
    href: '/contact?focus=form',
    external: false,
    color: 'text-primary',
    extraClass: '',
    titleHoverColor: '',
  },
  {
    href: '/Environomics_EPC_Catalogue_2025.pdf',
    external: true,
    color: 'text-primary',
    extraClass: '',
    titleHoverColor: '',
  },
  {
    href: '/projects',
    external: false,
    color: 'text-primary',
    extraClass: '',
    titleHoverColor: '',
  },
  {
    href: 'whatsapp',
    external: true,
    color: 'text-[#25D366]',
    extraClass: 'cta-whatsapp',
    titleHoverColor: 'group-hover:text-[#25D366]',
  },
] as const;
const CONTACT_FORM_CONSTANTS = {
  submitButtonLabel: 'Submit Technical Inquiry',
  submittingButtonLabel: 'Submitting Inquiry...',
  successTitle: 'Inquiry Submitted',
  successMessage:
    'Your email app has been opened with the inquiry details. Please send the email to complete your request.',
  closeButtonLabel: 'Close',
  officeIcon: 'corporate_fare',
  mapsIcon: 'map',
  mapsDecorativeIcon: 'explore',
} as const;

function visibleItems(items: any[] = []) {
  return (Array.isArray(items) ? items : []).filter((item) => item?.isVisible !== false);
}

function serializeCtaCard(card: any, index: number) {
  const presentation = CTA_CARD_PRESENTATION[index] || CTA_CARD_PRESENTATION[0];

  return {
    id: card.id || `cta-card-${index + 1}`,
    eyebrow: card.eyebrow,
    title: card.title,
    action: card.action,
    href: presentation.href,
    external: presentation.external,
    color: presentation.color,
    extraClass: presentation.extraClass,
    titleHoverColor: presentation.titleHoverColor,
  };
}

function serializeFormField(field: any, index: number) {
  return {
    id: field.id || `form-field-${index + 1}`,
    key: field.fieldKey,
    label: field.label,
    placeholder: field.placeholder,
    type: field.inputType,
    required: Boolean(field.required),
  };
}

function serializeSocialLink(social: any, index: number) {
  return {
    id: social.id || `social-${index + 1}`,
    platform: social.platform,
    url: social.url,
  };
}

function serializeContactPage(page: any) {
  if (!page) {
    return null;
  }

  const heroSection = page.heroSection || {};
  const inquirySection = page.inquirySection || {};
  const contactDetails = page.contactDetails || {};
  const officeSection = page.officeSection || {};
  const mapSection = page.mapSection || {};
  const supportSection = page.supportSection || {};

  return {
    id: page.documentId || page.id,
    heroTitle: heroSection.heroTitle,
    heroIntro: heroSection.heroIntro,
    heroNote: heroSection.heroNote,
    ctaCards: visibleItems(page.ctaCards).map(serializeCtaCard),
    formHeading: inquirySection.formHeading,
    formDescription: inquirySection.formDescription,
    formFields: visibleItems(inquirySection.formFields).map(serializeFormField),
    serviceOptions: visibleItems(inquirySection.serviceOptions).map((item: any) => item.text),
    serviceFieldLabel: inquirySection.serviceFieldLabel,
    projectSizeLabel: inquirySection.projectSizeLabel,
    projectSizePlaceholder: inquirySection.projectSizePlaceholder,
    locationLabel: inquirySection.locationLabel,
    locationPlaceholder: inquirySection.locationPlaceholder,
    requirementLabel: inquirySection.requirementLabel,
    requirementPlaceholder: inquirySection.requirementPlaceholder,
    sourceLabel: inquirySection.sourceLabel,
    sourcePlaceholder: inquirySection.sourcePlaceholder,
    submitButtonLabel: CONTACT_FORM_CONSTANTS.submitButtonLabel,
    submittingButtonLabel: CONTACT_FORM_CONSTANTS.submittingButtonLabel,
    successTitle: CONTACT_FORM_CONSTANTS.successTitle,
    successMessage: CONTACT_FORM_CONSTANTS.successMessage,
    closeButtonLabel: CONTACT_FORM_CONSTANTS.closeButtonLabel,
    phone: contactDetails.phone,
    email: contactDetails.email,
    address: contactDetails.address,
    linkedin: contactDetails.linkedin,
    socialLinks: visibleItems(page.socialLinks).map(serializeSocialLink),
    officeBadge: officeSection.officeBadge,
    officeIcon: CONTACT_FORM_CONSTANTS.officeIcon,
    officeTitle: officeSection.officeTitle,
    companyName: officeSection.companyName,
    businessHoursLabel: officeSection.businessHoursLabel,
    businessHoursText: officeSection.businessHoursText,
    mapsTitle: mapSection.mapsTitle,
    mapsDescription: mapSection.mapsDescription,
    mapsButtonLabel: mapSection.mapsButtonLabel,
    mapsIcon: CONTACT_FORM_CONSTANTS.mapsIcon,
    mapsDecorativeIcon: CONTACT_FORM_CONSTANTS.mapsDecorativeIcon,
    urgentTitle: supportSection.urgentTitle,
    urgentDescription: supportSection.urgentDescription,
    hotlineLabel: supportSection.hotlineLabel,
    supportLabel: supportSection.supportLabel,
  };
}

export default factories.createCoreController(CONTACT_PAGE_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    const contactPage = await strapi.db.query(CONTACT_PAGE_UID).findOne({
      populate: {
        heroSection: true,
        ctaCards: true,
        inquirySection: {
          populate: {
            formFields: true,
            serviceOptions: true,
          },
        },
        contactDetails: true,
        socialLinks: true,
        officeSection: true,
        mapSection: true,
        supportSection: true,
      },
    } as any);

    ctx.body = {
      data: serializeContactPage(contactPage),
    };
  },
}));
