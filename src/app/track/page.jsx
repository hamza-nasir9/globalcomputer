import TrackingPageClient from './TrackingPageClient';

export const metadata = {
  title: 'Track Application | Global Computer Institute',
  description: 'Check your admission application status using your Tracking ID.',
};

export default function TrackingPage() {
  return <TrackingPageClient />;
}
