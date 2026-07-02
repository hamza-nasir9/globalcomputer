import { notFound } from 'next/navigation';
import { COURSE_DETAILS, getCourseBySlug } from '@/lib/data';
import CourseDetailClient from './CourseDetailClient';

export const dynamicParams = true;

export function generateStaticParams() {
  return COURSE_DETAILS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: 'Course Not Found — GCI' };
  return {
    title: `${course.name} — GCI Global Computer Institute`,
    description: course.description,
    openGraph: {
      title: `${course.name} — GCI`,
      description: course.description,
      images: [{ url: course.heroImage }],
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
