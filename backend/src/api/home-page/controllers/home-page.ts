import { factories } from '@strapi/strapi';

const HOME_PAGE_UID = 'api::home-page.home-page' as any;

const HOME_PAGE_FIXED_CONTENT = {
  primaryCtaLabel: 'Explore Our Projects',
  primaryCtaUrl: '/projects',
  secondaryCtaLabel: 'Download Our Catalogue',
  secondaryCtaUrl: '/Environomics_EPC_Catalogue_2025.pdf',
  cultureCtaLabel: 'Our Culture',
  cultureCtaUrl: '/culture',
  certifications: ['In-house R&D', 'Quality Components', '24/7 Support'],
  impactHeading: 'Engineering a Greener Future, Our Verified Global Impact',
  impactCards: [
    { icon: 'bolt', value: '90,000+ MWh', label: 'Clean Energy Generated' },
    { icon: 'co2', value: '72,000 T', label: 'CO2 Emissions Avoided' },
    { icon: 'payments', value: '720 M+', label: 'Client Energy Savings' },
    { icon: 'verified', value: '125+', label: 'Delivered On Time', sublabel: 'Across 8+ industrial sectors' },
  ],
  videosHeading: 'Environomics Projects',
  videosDescription: 'Featured from our YouTube presence, with room to add more Environomics videos here.',
  servicesHeading: 'Specialized Engineering Services',
};

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

function getMediaItems(mediaItems: any[] = [], fallbackAlt = '') {
  return (Array.isArray(mediaItems) ? mediaItems : [])
    .map((media, index) => ({
      id: media.documentId || media.id || `${fallbackAlt}-${index}`,
      ...getMediaItem(media, `${fallbackAlt} image ${index + 1}`),
    }))
    .filter((item) => item.url);
}

function toArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function getYouTubeId(url = '') {
  const value = String(url).trim();

  return (
    value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{6,})/)?.[1] ||
    value.match(/[?&]v=([A-Za-z0-9_-]{6,})/)?.[1] ||
    ''
  );
}

function serializeHomeService(service: any, index: number) {
  return {
    id: service.id || `home-service-${index + 1}`,
    title: service.title,
    description: service.description,
    href: service.href,
    linkLabel: service.linkLabel || 'Learn More',
    displayOrder: index + 1,
    coverImage: getMediaItem(service.coverImage, `${service.title} service`),
  };
}

function serializeHomeVideo(video: any, index: number) {
  const youtubeUrl = String(video.youtubeUrl || '').trim();
  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = getMediaUrl(video.thumbnailImage) || (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : '');

  return {
    id: video.id || `home-video-${index + 1}`,
    title: video.title,
    youtubeUrl,
    videoId,
    embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : youtubeUrl,
    thumbnailUrl,
    watchUrl: videoId ? `https://youtu.be/${videoId}` : youtubeUrl,
    displayOrder: index + 1,
    kind: videoId ? 'embed' : 'link',
  };
}

function serializeCultureTopic(topic: any, index: number) {
  return {
    id: topic.slug || topic.id || `culture-topic-${index + 1}`,
    title: topic.title,
    slug: topic.slug,
    icon: topic.icon || 'diversity_3',
    description: topic.description,
    displayOrder: index + 1,
    coverImage: getMediaItem(topic.coverImage, `${topic.title} cover`),
    galleryImages: getMediaItems(topic.galleryImages, topic.title),
  };
}

function serializeHomePage(homePage: any) {
  if (!homePage) {
    return null;
  }

  const visibleServices = toArray(homePage.services).filter((service: any) => service?.isVisible !== false);
  const visibleVideos = toArray(homePage.videos).filter((video: any) => video?.isVisible !== false);
  const visibleCultureTopics = toArray(homePage.cultureTopics).filter((topic: any) => topic?.isVisible !== false);

  return {
    id: homePage.documentId || homePage.id,
    heroBadge: homePage.heroBadge,
    heroTitle: homePage.heroTitle,
    heroSubtitle: homePage.heroSubtitle,
    heroLead: homePage.heroLead,
    primaryCtaLabel: HOME_PAGE_FIXED_CONTENT.primaryCtaLabel,
    primaryCtaUrl: HOME_PAGE_FIXED_CONTENT.primaryCtaUrl,
    secondaryCtaLabel: HOME_PAGE_FIXED_CONTENT.secondaryCtaLabel,
    secondaryCtaUrl: HOME_PAGE_FIXED_CONTENT.secondaryCtaUrl,
    cultureCtaLabel: HOME_PAGE_FIXED_CONTENT.cultureCtaLabel,
    cultureCtaUrl: HOME_PAGE_FIXED_CONTENT.cultureCtaUrl,
    heroImage: getMediaItem(homePage.heroImage, 'Homepage hero image'),
    aboutHeading: homePage.aboutHeading,
    aboutBody: homePage.aboutBody,
    aboutImage: getMediaItem(homePage.aboutImage, 'About Environomics image'),
    certifications: HOME_PAGE_FIXED_CONTENT.certifications,
    impactHeading: HOME_PAGE_FIXED_CONTENT.impactHeading,
    impactCards: HOME_PAGE_FIXED_CONTENT.impactCards,
    videosHeading: HOME_PAGE_FIXED_CONTENT.videosHeading,
    videosDescription: HOME_PAGE_FIXED_CONTENT.videosDescription,
    videos: visibleVideos.map((video: any, index: number) => serializeHomeVideo(video, index)),
    servicesHeading: HOME_PAGE_FIXED_CONTENT.servicesHeading,
    services: visibleServices.map((service: any, index: number) => serializeHomeService(service, index)),
    cultureTopics: visibleCultureTopics.map((topic: any, index: number) => serializeCultureTopic(topic, index)),
  };
}

export default factories.createCoreController(HOME_PAGE_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    const homePage = await strapi.db.query(HOME_PAGE_UID).findOne({
      populate: {
        heroImage: true,
        aboutImage: true,
        services: {
          populate: {
            coverImage: true,
          },
        },
        videos: {
          populate: {
            thumbnailImage: true,
          },
        },
        cultureTopics: {
          populate: {
            coverImage: true,
            galleryImages: true,
          },
        },
      },
    } as any);

    ctx.body = {
      data: serializeHomePage(homePage),
    };
  },
}));
