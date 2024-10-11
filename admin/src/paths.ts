export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password',  updatePasswordForm: '/auth/update-password-form' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    add: '/dashboard/add',
    edit: '/dashboard/edit', // Use a function to create the path
    items: '/dashboard/items',
    orders: '/dashboard/orders',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
