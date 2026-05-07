import type { Schema, Struct } from '@strapi/strapi';

export interface CommonLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_common_link_items';
  info: {
    description: 'Editable link';
    displayName: 'Link Item';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_common_social_links';
  info: {
    description: 'Editable social media link';
    displayName: 'Social Link';
  };
  attributes: {
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonTextItem extends Struct.ComponentSchema {
  collectionName: 'components_common_text_items';
  info: {
    description: 'Editable text item';
    displayName: 'Text Item';
  };
  attributes: {
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactContactDetails extends Struct.ComponentSchema {
  collectionName: 'components_contact_contact_details';
  info: {
    description: 'Base contact information';
    displayName: 'Contact Details';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Text;
    linkedin: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface ContactCtaCard extends Struct.ComponentSchema {
  collectionName: 'components_contact_cta_cards';
  info: {
    description: 'Contact page top CTA card';
    displayName: 'CTA Card';
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactFormField extends Struct.ComponentSchema {
  collectionName: 'components_contact_form_fields';
  info: {
    description: 'Contact inquiry form field';
    displayName: 'Form Field';
  };
  attributes: {
    fieldKey: Schema.Attribute.String & Schema.Attribute.Required;
    inputType: Schema.Attribute.Enumeration<['text', 'email', 'tel']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ContactHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_hero_sections';
  info: {
    description: 'Contact hero content';
    displayName: 'Hero Section';
  };
  attributes: {
    heroIntro: Schema.Attribute.Text;
    heroNote: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
  };
}

export interface ContactInquirySection extends Struct.ComponentSchema {
  collectionName: 'components_contact_inquiry_sections';
  info: {
    description: 'Contact form section';
    displayName: 'Inquiry Section';
  };
  attributes: {
    formDescription: Schema.Attribute.Text;
    formFields: Schema.Attribute.Component<'contact.form-field', true>;
    formHeading: Schema.Attribute.String;
    locationLabel: Schema.Attribute.String;
    locationPlaceholder: Schema.Attribute.String;
    projectSizeLabel: Schema.Attribute.String;
    projectSizePlaceholder: Schema.Attribute.String;
    requirementLabel: Schema.Attribute.String;
    requirementPlaceholder: Schema.Attribute.Text;
    serviceFieldLabel: Schema.Attribute.String;
    serviceOptions: Schema.Attribute.Component<'common.text-item', true>;
    sourceLabel: Schema.Attribute.String;
    sourcePlaceholder: Schema.Attribute.String;
  };
}

export interface ContactMapSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_map_sections';
  info: {
    description: 'Map callout content';
    displayName: 'Map Section';
  };
  attributes: {
    mapsButtonLabel: Schema.Attribute.String;
    mapsDescription: Schema.Attribute.Text;
    mapsTitle: Schema.Attribute.String;
  };
}

export interface ContactOfficeSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_office_sections';
  info: {
    description: 'Office card content';
    displayName: 'Office Section';
  };
  attributes: {
    businessHoursLabel: Schema.Attribute.String;
    businessHoursText: Schema.Attribute.String;
    companyName: Schema.Attribute.String;
    officeBadge: Schema.Attribute.String;
    officeTitle: Schema.Attribute.String;
  };
}

export interface ContactSupportSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_support_sections';
  info: {
    description: 'Urgent contact section';
    displayName: 'Support Section';
  };
  attributes: {
    hotlineLabel: Schema.Attribute.String;
    supportLabel: Schema.Attribute.String;
    urgentDescription: Schema.Attribute.Text;
    urgentTitle: Schema.Attribute.String;
  };
}

export interface FooterBrandSection extends Struct.ComponentSchema {
  collectionName: 'components_footer_brand_sections';
  info: {
    description: 'Footer brand content';
    displayName: 'Brand Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images'>;
    logoAlt: Schema.Attribute.String;
  };
}

export interface FooterContactSection extends Struct.ComponentSchema {
  collectionName: 'components_footer_contact_sections';
  info: {
    description: 'Footer contact details';
    displayName: 'Contact Section';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface FooterLinkSection extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_sections';
  info: {
    description: 'Footer link group';
    displayName: 'Link Section';
  };
  attributes: {
    heading: Schema.Attribute.String;
    links: Schema.Attribute.Component<'common.link-item', true>;
  };
}

export interface HomeCultureTopic extends Struct.ComponentSchema {
  collectionName: 'components_home_culture_topics';
  info: {
    description: 'Homepage culture topic and gallery';
    displayName: 'Culture Topic';
  };
  attributes: {
    coverImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    galleryImages: Schema.Attribute.Media<'images', true>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'diversity_3'>;
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_home_service_cards';
  info: {
    description: 'Homepage service card';
    displayName: 'Service Card';
  };
  attributes: {
    coverImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    linkLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Learn More'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeVideo extends Struct.ComponentSchema {
  collectionName: 'components_home_videos';
  info: {
    description: 'Homepage YouTube video';
    displayName: 'Video';
  };
  attributes: {
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    thumbnailImage: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    youtubeUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.link-item': CommonLinkItem;
      'common.social-link': CommonSocialLink;
      'common.text-item': CommonTextItem;
      'contact.contact-details': ContactContactDetails;
      'contact.cta-card': ContactCtaCard;
      'contact.form-field': ContactFormField;
      'contact.hero-section': ContactHeroSection;
      'contact.inquiry-section': ContactInquirySection;
      'contact.map-section': ContactMapSection;
      'contact.office-section': ContactOfficeSection;
      'contact.support-section': ContactSupportSection;
      'footer.brand-section': FooterBrandSection;
      'footer.contact-section': FooterContactSection;
      'footer.link-section': FooterLinkSection;
      'home.culture-topic': HomeCultureTopic;
      'home.service-card': HomeServiceCard;
      'home.video': HomeVideo;
    }
  }
}
