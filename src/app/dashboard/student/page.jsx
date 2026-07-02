/**
 * Student dashboard has been removed.
 * Redirect all visitors to homepage.
 */
import { redirect } from 'next/navigation';

export default function StudentDashboardPage() {
  redirect('/');
}
