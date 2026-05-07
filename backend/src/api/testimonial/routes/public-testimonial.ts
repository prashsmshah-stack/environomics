export default {
  routes: [
    {
      method: 'GET',
      path: '/public/testimonials',
      handler: 'testimonial.publicFind',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/testimonials/:id/file',
      handler: 'testimonial.publicFile',
      config: {
        auth: false,
      },
    },
  ],
};
