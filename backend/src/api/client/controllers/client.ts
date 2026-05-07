import { factories } from '@strapi/strapi';

const CLIENT_UID = 'api::client.client' as any;

function getMediaUrl(logo: any) {
  if (!logo) {
    return '';
  }

  if (Array.isArray(logo)) {
    return getMediaUrl(logo[0]);
  }

  return logo.url || logo.formats?.thumbnail?.url || '';
}

export default factories.createCoreController(CLIENT_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    const clients = await strapi.documents(CLIENT_UID).findMany({
      filters: {
        isVisible: true,
      },
      sort: [{ displayOrder: 'asc' }, { name: 'asc' }],
      populate: {
        logo: true,
      },
    } as any);

    ctx.body = {
      data: clients.map((client: any) => ({
        id: client.documentId || client.id,
        name: client.name,
        displayOrder: client.displayOrder,
        logo: {
          url: getMediaUrl(client.logo),
          alternativeText: client.logo?.alternativeText || client.name,
        },
      })),
    };
  },
}));
