import { paths } from '@/paths';
import { redirect } from 'next/navigation';

// Check if you want to redirect to a subpage like 'overview'
export default function Page(): never {
  // Redirect to dashboard overview
  redirect(paths.dashboard.overview); // This ensures it's redirecting to '/dashboard'
}
