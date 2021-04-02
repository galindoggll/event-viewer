export default [
  {
    path: '/',
    component: 'views/dashboard',
    auth: true,
  },
  {
    path: '/users',
    component: 'views/users',
    auth: true,
  },
  {
    path: '/events',
    component: 'views/events',
    auth: true,
  },
  {
    path: '/sign-in',
    component: 'views/sign-in',
    layout: 'minimal',
  },
  {
    path: '/sign-up',
    component: 'views/sign-up',
    layout: 'minimal',
  },
  {
    path: '/forgot-password',
    component: 'views/forgot-password',
    layout: 'minimal',
  },
  {
    path: '/password/reset',
    component: 'views/reset-password',
    layout: 'minimal',
  },
  {
    path: '/activate',
    component: 'views/activate',
    layout: 'minimal',
  },
];
