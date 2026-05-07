import { factories } from '@strapi/strapi';

const FOOTER_UID = 'api::footer.footer' as any;
const FOOTER_COPYRIGHT = '\u00a9 2026 Environomics. All rights reserved.';
const FOOTER_BOTTOM_WORDS = ['Engineering', 'Procurement', 'Construction'];

function getMediaUrl(media: any) {
  if (!media) {
    return '';
  }

  if (Array.isArray(media)) {
    return getMediaUrl(media[0]);
  }

  return media.url || media.formats?.large?.url || media.formats?.medium?.url || media.formats?.thumbnail?.url || '';
}

function getMediaItem(media: any, fallbackAlt = '') {
  return {
    url: getMediaUrl(media),
    alternativeText: media?.alternativeText || fallbackAlt,
  };
}

function visibleItems(items: any[] = []) {
  return (Array.isArray(items) ? items : []).filter((item) => item?.isVisible !== false);
}

function isExternalLink(href: string) {
  const value = String(href || '').trim();
  return /^(https?:|mailto:|tel:)/i.test(value) || /\.pdf(?:$|\?)/i.test(value);
}

function serializeLink(link: any, index: number) {
  return {
    id: link.id || `link-${index + 1}`,
    label: link.label,
    href: link.href,
    isExternal: isExternalLink(link.href),
  };
}

function serializeSocialLink(social: any, index: number) {
  return {
    id: social.id || `social-${index + 1}`,
    platform: social.platform,
    url: social.url,
  };
}

function serializeFooter(footer: any) {
  if (!footer) {
    return null;
  }

  const brand = footer.brand || {};
  const servicesSection = footer.servicesSection || {};
  const quickLinksSection = footer.quickLinksSection || {};
  const contactSection = footer.contactSection || {};

  return {
    id: footer.documentId || footer.id,
    logo: getMediaItem(brand.logo, brand.logoAlt || 'Environomics Logo'),
    logoAlt: brand.logoAlt,
    description: brand.description,
    socialLinks: visibleItems(footer.socialLinks).map(serializeSocialLink),
    servicesHeading: servicesSection.heading,
    serviceLinks: visibleItems(servicesSection.links).map(serializeLink),
    quickLinksHeading: quickLinksSection.heading,
    quickLinks: visibleItems(quickLinksSection.links).map(serializeLink),
    contactHeading: contactSection.heading,
    address: contactSection.address,
    phone: contactSection.phone,
    email: contactSection.email,
    copyrightText: FOOTER_COPYRIGHT,
    bottomWords: FOOTER_BOTTOM_WORDS.map((text, index) => ({
      id: `bottom-word-${index + 1}`,
      text,
    })),
  };
}

export default factories.createCoreController(FOOTER_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    const footer = await strapi.db.query(FOOTER_UID).findOne({
      populate: {
        brand: {
          populate: {
            logo: true,
          },
        },
        socialLinks: true,
        servicesSection: {
          populate: {
            links: true,
          },
        },
        quickLinksSection: {
          populate: {
            links: true,
          },
        },
        contactSection: true,
      },
    } as any);

    ctx.body = {
      data: serializeFooter(footer),
    };
  },
}));
