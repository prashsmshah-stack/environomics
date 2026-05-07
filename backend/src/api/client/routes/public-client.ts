export default {
  routes: [
    {
      method: 'GET',
      path: '/public/clients',
      handler: 'client.publicFind',
      config: {
        auth: false,
      },
    },
  ],
};
