import { factories } from '@strapi/strapi';

const LEAD_UID = 'api::lead.lead' as any;

function cleanString(value: unknown, maxLength = 500) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function cleanText(value: unknown, maxLength = 5000) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function requireField(ctx: any, value: string, field: string) {
  if (!value) {
    ctx.throw(400, `${field} is required.`);
  }
}

export default factories.createCoreController(LEAD_UID, () => ({
  async submit(ctx) {
    const body = ctx.request.body?.data || ctx.request.body || {};
    const name = cleanString(body.name, 160);
    const company = cleanString(body.company, 180);
    const email = cleanString(body.email, 180);
    const phone = cleanString(body.phone, 80);
    const requirement = cleanText(body.requirement, 5000);

    requireField(ctx, name, 'Name');
    requireField(ctx, company, 'Company');
    requireField(ctx, email, 'Email');
    requireField(ctx, phone, 'Phone');
    requireField(ctx, requirement, 'Requirement');

    const lead = await strapi.db.query(LEAD_UID).create({
      data: {
        name,
        company,
        email,
        phone,
        requirement,
        designation: cleanString(body.designation, 160),
        service: cleanString(body.service, 160),
        projectSize: cleanString(body.projectSize, 120),
        location: cleanString(body.location, 180),
        source: cleanString(body.source, 180),
        sourcePage: cleanString(body.sourcePage, 120) || 'Contact Us',
        pagePath: cleanString(body.pagePath, 300),
        formName: cleanString(body.formName, 120) || 'Inquiry Form',
        status: 'New',
        submittedAt: new Date().toISOString(),
        userAgent: cleanText(ctx.request.headers['user-agent'], 1000),
      },
    } as any);

    ctx.body = {
      data: {
        id: lead.id,
        submittedAt: lead.submittedAt,
      },
    };
  },
}));
