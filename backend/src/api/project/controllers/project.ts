import { factories } from '@strapi/strapi';

const PROJECT_UID = 'api::project.project' as any;

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

function serializeProject(project: any, includeGallery = false) {
  const payload: any = {
    id: project.documentId || project.id,
    name: project.name,
    slug: project.slug,
    industry: project.industry,
    projectSize: project.projectSize,
    year: project.year,
    description: project.description,
    displayOrder: project.displayOrder,
    coverImage: getMediaItem(project.coverImage, `${project.name} project`),
    logo: getMediaItem(project.logo, `${project.name} logo`),
  };

  if (includeGallery) {
    payload.galleryImages = getMediaItems(project.galleryImages, project.name);
  }

  return payload;
}

const projectQuery = {
  filters: {
    isVisible: true,
  },
  sort: [{ displayOrder: 'asc' }, { name: 'asc' }],
  populate: {
    coverImage: true,
    logo: true,
    galleryImages: true,
  },
} as any;

function setFreshProjectResponseHeaders(ctx: any) {
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  ctx.set('Pragma', 'no-cache');
  ctx.set('Expires', '0');
  ctx.set('Surrogate-Control', 'no-store');
}

function normalizeSlug(value = '') {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default factories.createCoreController(PROJECT_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    setFreshProjectResponseHeaders(ctx);
    const projects = await strapi.documents(PROJECT_UID).findMany(projectQuery);

    ctx.body = {
      data: projects.map((project: any) => serializeProject(project)),
    };
  },

  async publicFindOne(ctx) {
    setFreshProjectResponseHeaders(ctx);
    const slug = normalizeSlug(ctx.params.slug);

    if (!slug) {
      ctx.throw(400, 'Project slug is required');
    }

    const projects = await strapi.documents(PROJECT_UID).findMany({
      ...projectQuery,
      filters: {
        ...projectQuery.filters,
        slug,
      },
      limit: 1,
    } as any);

    const project = projects[0];

    if (!project) {
      ctx.body = {
        data: null,
      };
      return;
    }

    ctx.body = {
      data: serializeProject(project, true),
    };
  },
}));
