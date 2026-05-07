export default {
  routes: [
    {
      method: 'GET',
      path: '/public/projects',
      handler: 'project.publicFind',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/projects/:slug',
      handler: 'project.publicFindOne',
      config: {
        auth: false,
      },
    },
  ],
};
