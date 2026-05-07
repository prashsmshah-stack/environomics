export default {
  routes: [
    {
      method: 'POST',
      path: '/public/leads',
      handler: 'lead.submit',
      config: {
        auth: false,
      },
    },
  ],
};
