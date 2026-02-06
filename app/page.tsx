import Image from 'next/image';

import DashboardCards from '@/components/dashboard/dashboard-cards';
import Logo from '@/public/images/teacherbuddy-logo.png';

/**
 * Renders the dashboard landing page with branding and primary workflow cards.
 * Use this route as the entry point for navigating all TeacherBuddy tools.
 */
export default function Page() {
  return (
    <>
      <section className="justify-self-center mb-5 max-w-full md:max-w-2/3 lg:max-w-2/4 xl:max-w-4/6">
        <Image
          src={Logo}
          alt="TeacherBuddy Logo"
          width={895}
          height={372}
          priority
          placeholder="blur"
          blurDataURL={Logo.blurDataURL}
        />
      </section>
      <DashboardCards />
    </>
  );
}
