export default {
  routes: [
    {
      method: 'GET',
      path: '/public/footer',
      handler: 'footer.publicFind',
      config: {
        auth: false,
      },
    },
  ],
};
