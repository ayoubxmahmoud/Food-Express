import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
// Import the missing icons
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'; // For add-items
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List'; // For list-items
import { ShoppingCart as OrdersIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart'; // For orders

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  user: UserIcon,
  users: UsersIcon,
  'add-items': PlusIcon, // Add icon for add-items
  'list-items': ListIcon, // Add icon for list-items
  orders: OrdersIcon, // Add icon for orders
} as Record<string, Icon>;
