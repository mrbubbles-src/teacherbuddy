import Image from 'next/image';

import DashboardCards from '@/components/dashboard/dashboard-cards';
import Logo from '@/public/images/teacherbuddy-logo.png';

export default function Page() {
  return (
    <>
      <section className="justify-self-center mb-5 max-w-8/12">
        <Image
          src={Logo}
          alt="TeacherBuddy Logo"
          width={895}
          height={372}
          preload={true}
          placeholder="blur"
          blurDataURL={Logo.blurDataURL}
        />
      </section>
      <DashboardCards />
    </>
  );
}
