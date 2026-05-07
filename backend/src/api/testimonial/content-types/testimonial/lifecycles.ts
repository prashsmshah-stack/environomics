const TESTIMONIAL_UID = 'api::testimonial.testimonial' as any;

declare const strapi: any;

let isSyncingDisplayOrder = false;

function toPositiveInteger(value: unknown, fallback: number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(1, Math.trunc(numericValue));
}

function clampOrder(value: number, itemCount: number) {
  if (itemCount <= 0) {
    return 1;
  }

  return Math.min(Math.max(value, 1), itemCount);
}

async function getAllTestimonials() {
  return strapi.db.query(TESTIMONIAL_UID).findMany({
    select: ['id', 'displayOrder', 'createdAt', 'updatedAt'],
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'asc' },
      { id: 'asc' },
    ],
  } as any);
}

async function persistSequentialOrder(testimonials: any[]) {
  if (!testimonials.length) {
    return;
  }

  isSyncingDisplayOrder = true;
  strapi.db.lifecycles.disable();

  try {
    for (const [index, testimonial] of testimonials.entries()) {
      const nextOrder = index + 1;

      if (Number(testimonial.displayOrder) === nextOrder) {
        continue;
      }

      await strapi.db.query(TESTIMONIAL_UID).update({
        where: { id: testimonial.id },
        data: { displayOrder: nextOrder },
      } as any);
    }
  } finally {
    strapi.db.lifecycles.enable();
    isSyncingDisplayOrder = false;
  }
}

async function moveTestimonialToRequestedOrder(testimonial: any) {
  if (!testimonial?.id || isSyncingDisplayOrder) {
    return;
  }

  const testimonials = await getAllTestimonials();
  const movedTestimonial = testimonials.find((item: any) => item.id === testimonial.id) || testimonial;
  const otherTestimonials = testimonials.filter((item: any) => item.id !== testimonial.id);
  const requestedOrder = clampOrder(
    toPositiveInteger(testimonial.displayOrder, testimonials.length),
    testimonials.length
  );

  otherTestimonials.splice(requestedOrder - 1, 0, movedTestimonial);
  await persistSequentialOrder(otherTestimonials);
}

async function normalizeTestimonialOrder() {
  if (isSyncingDisplayOrder) {
    return;
  }

  const testimonials = await getAllTestimonials();
  await persistSequentialOrder(testimonials);
}

export default {
  async afterCreate(event: any) {
    await moveTestimonialToRequestedOrder(event.result);
  },

  async afterUpdate(event: any) {
    await moveTestimonialToRequestedOrder(event.result);
  },

  async afterDelete() {
    await normalizeTestimonialOrder();
  },
};
