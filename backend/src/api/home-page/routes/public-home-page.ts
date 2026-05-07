export default {
  routes: [
    {
      method: 'GET',
      path: '/public/home-page',
      handler: 'home-page.publicFind',
      config: {
        auth: false,
      },
    },
  ],
};
