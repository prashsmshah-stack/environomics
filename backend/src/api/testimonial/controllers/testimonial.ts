import { factories } from '@strapi/strapi';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const TESTIMONIAL_UID = 'api::testimonial.testimonial' as any;

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

function serializeTestimonial(testimonial: any) {
  return {
    id: testimonial.documentId || testimonial.id,
    companyName: testimonial.companyName,
    tag: testimonial.tag,
    displayOrder: testimonial.displayOrder,
    filePageNumber: testimonial.filePageNumber,
    coverImage: getMediaItem(testimonial.coverImage, `${testimonial.companyName} testimonial`),
    attachment: getMediaItem(testimonial.attachment, `${testimonial.companyName} testimonial file`),
    fileHref: `/api/public/testimonials/${encodeURIComponent(testimonial.documentId || testimonial.id)}/file`,
  };
}

function getUploadPathFromUrl(url = '') {
  const cleanUrl = String(url || '').split('?')[0];

  if (!cleanUrl.startsWith('/uploads/')) {
    return '';
  }

  const relativeUploadPath = cleanUrl.replace(/^\/uploads\//, '').split('/').filter(Boolean);
  return path.join(process.cwd(), 'public', 'uploads', ...relativeUploadPath);
}

function sanitizeFileName(value = 'testimonial') {
  return String(value || 'testimonial')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'testimonial';
}

async function getVisibleTestimonials(strapi: any) {
  return strapi.documents(TESTIMONIAL_UID).findMany({
    filters: {
      isVisible: true,
    },
    sort: [{ displayOrder: 'asc' }, { companyName: 'asc' }],
    populate: {
      coverImage: true,
      attachment: true,
    },
  } as any);
}

function getPageRange(testimonial: any, testimonials: any[], pageCount: number) {
  const startPage = Math.max(1, Math.trunc(Number(testimonial.filePageNumber) || 1));
  const samePdfTestimonials = testimonials
    .filter((item: any) => item.attachment?.url === testimonial.attachment?.url)
    .map((item: any) => ({
      ...item,
      startPage: Math.max(1, Math.trunc(Number(item.filePageNumber) || 1)),
    }))
    .filter((item: any) => item.startPage >= startPage)
    .sort((left: any, right: any) => left.startPage - right.startPage);
  const nextStartPage = samePdfTestimonials.find((item: any) => item.startPage > startPage)?.startPage;
  const endPage = Math.min(pageCount, nextStartPage ? nextStartPage - 1 : pageCount);

  return {
    startPage: Math.min(startPage, pageCount),
    endPage: Math.max(Math.min(startPage, pageCount), endPage),
  };
}

export default factories.createCoreController(TESTIMONIAL_UID, ({ strapi }) => ({
  async publicFind(ctx) {
    const testimonials = await getVisibleTestimonials(strapi);

    ctx.body = {
      data: testimonials.map((testimonial: any) => serializeTestimonial(testimonial)),
    };
  },

  async publicFile(ctx) {
    const requestedId = String(ctx.params.id ?? '').trim();
    const testimonials = await getVisibleTestimonials(strapi);
    const testimonial = testimonials.find(
      (item: any) => String(item.documentId || item.id) === requestedId
    );

    if (!testimonial) {
      ctx.throw(404, 'Testimonial not found');
    }

    const attachmentUrl = testimonial.attachment?.url || '';
    const attachmentPath = getUploadPathFromUrl(attachmentUrl);

    if (!attachmentPath || !/\.pdf$/i.test(attachmentPath)) {
      ctx.throw(404, 'Testimonial PDF not found');
    }

    const sourceBytes = await fs.readFile(attachmentPath);
    const sourcePdf = await PDFDocument.load(sourceBytes);
    const pageCount = sourcePdf.getPageCount();
    const { startPage, endPage } = getPageRange(testimonial, testimonials, pageCount);
    const outputPdf = await PDFDocument.create();
    const pageIndexes = Array.from(
      { length: endPage - startPage + 1 },
      (_value, index) => startPage - 1 + index
    );
    const copiedPages = await outputPdf.copyPages(sourcePdf, pageIndexes);

    copiedPages.forEach((page) => outputPdf.addPage(page));

    const outputBytes = await outputPdf.save();
    const filename = `${sanitizeFileName(testimonial.companyName)}-testimonial.pdf`;

    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Disposition', `inline; filename="${filename}"`);
    ctx.set('Cache-Control', 'no-store');
    ctx.body = Buffer.from(outputBytes);
  },
}));
