import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'add-items', title: 'Add Items', href: paths.dashboard.add, icon: 'add-items' },
  { key: 'list-items ', title: 'List Items', href: paths.dashboard.items, icon: 'list-items' },
  { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'orders' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];

