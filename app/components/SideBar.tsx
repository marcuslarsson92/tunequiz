// app/components/SideBar.tsx
'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';


export default function SideBar() {
  const pathname = usePathname(); // to highlight active link if needed

  return (
    <div className="w-48 bg-gray-800 text-white p-4 flex flex-col">

      <nav className="flex flex-col gap-4">

        <Link
          href="/createQuiz"
          className={`flex items-center space-x-2 hover:bg-gray-700 p-2 rounded 
            ${pathname === '/createQuiz' ? 'bg-gray-700' : ''}`}
        >
          <HomeIcon className="h-6 w-6" aria-hidden="true" />
          <span>Create Quiz</span>
        </Link>

        {/* Another link or profile link, etc. */}
        <Link
          href="/playQuiz"
          className={`flex items-center space-x-2 hover:bg-gray-700 p-2 rounded 
            ${pathname === '/playQuiz' ? 'bg-gray-700' : ''}`}
        >
          <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
          <span>Play Quiz</span>
        </Link>
      </nav>

      {/* Log out button*/}
      <button onClick={() => signOut({ callbackUrl: '/'})}
      className='flex items-center gap-2 p-2 rounded hover:bg-gray-700 mt-auto'
      >
        <ArrowLeftEndOnRectangleIcon className='w-5 h-5' />
        <span>Log Out</span>
      </button>
    </div>
  );
}
