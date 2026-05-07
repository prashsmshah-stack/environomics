import type { Core } from '@strapi/strapi';

const singleTypePageNames = [
  { uid: 'api::home-page.home-page', pageName: 'Home' },
  { uid: 'api::contact-page.contact-page', pageName: 'Contact Us' },
  { uid: 'api::footer.footer', pageName: 'Footer' },
] as const;

const contentManagerConfigurations = [
  {
    uid: 'api::home-page.home-page',
    mainField: 'pageName',
    list: ['pageName', 'updatedAt'],
    sortBy: 'pageName',
    sortOrder: 'ASC',
  },
  {
    uid: 'api::project.project',
    mainField: 'name',
    list: ['displayOrder', 'name', 'industry', 'projectSize', 'isVisible'],
    sortBy: 'displayOrder',
    sortOrder: 'ASC',
  },
  {
    uid: 'api::client.client',
    mainField: 'name',
    list: ['displayOrder', 'name', 'isVisible', 'updatedAt'],
    sortBy: 'displayOrder',
    sortOrder: 'ASC',
  },
  {
    uid: 'api::testimonial.testimonial',
    mainField: 'companyName',
    list: ['displayOrder', 'companyName', 'tag', 'isVisible'],
    sortBy: 'displayOrder',
    sortOrder: 'ASC',
  },
  {
    uid: 'api::contact-page.contact-page',
    mainField: 'pageName',
    list: ['pageName', 'updatedAt'],
    sortBy: 'pageName',
    sortOrder: 'ASC',
  },
  {
    uid: 'api::lead.lead',
    mainField: 'company',
    list: ['submittedAt', 'sourcePage', 'name', 'company', 'service', 'status'],
    sortBy: 'submittedAt',
    sortOrder: 'DESC',
  },
  {
    uid: 'api::footer.footer',
    mainField: 'pageName',
    list: ['pageName', 'updatedAt'],
    sortBy: 'pageName',
    sortOrder: 'ASC',
  },
] as const;

async function ensureSingleTypePageNames(strapi: Core.Strapi) {
  for (const item of singleTypePageNames) {
    const entry = await strapi.db.query(item.uid as any).findOne({ select: ['id', 'pageName'] } as any);

    if (!entry?.id || String(entry.pageName ?? '').trim() === item.pageName) {
      continue;
    }

    await strapi.db.query(item.uid as any).update({
      where: { id: entry.id },
      data: { pageName: item.pageName },
    } as any);
  }
}

async function ensureContentManagerMainFields(strapi: Core.Strapi) {
  for (const item of contentManagerConfigurations) {
    const key = `plugin_content_manager_configuration_content_types::${item.uid}`;
    const row = await strapi.db.connection('strapi_core_store_settings').where({ key }).first();

    if (!row?.value) {
      continue;
    }

    const config = JSON.parse(row.value);
    config.settings = {
      ...(config.settings || {}),
      mainField: item.mainField,
      defaultSortBy: item.sortBy,
      defaultSortOrder: item.sortOrder,
    };

    config.layouts = {
      ...(config.layouts || {}),
      list: [
        ...item.list,
        ...((config.layouts?.list || []).filter((field: string) => !item.list.includes(field as never))),
      ].slice(0, 6),
    };

    await strapi.db.connection('strapi_core_store_settings').where({ key }).update({
      value: JSON.stringify(config),
    });
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureSingleTypePageNames(strapi);
    await ensureContentManagerMainFields(strapi);
  },
};
