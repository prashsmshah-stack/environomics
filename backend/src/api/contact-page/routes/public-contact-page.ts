export default {
  routes: [
    {
      method: 'GET',
      path: '/public/contact-page',
      handler: 'contact-page.publicFind',
      config: {
        auth: false,
      },
    },
  ],
};
