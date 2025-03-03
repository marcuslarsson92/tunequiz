// app/components/CollapsibleSideBar.tsx
'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

export default function CollapsibleSideBar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div 
      className={` text-white fixed top-45 left-2 h-full transition-all duration-300 z-30 flex flex-col ${
        expanded ? 'w-48' : 'w-14'
      }`}
    >
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar} 
        className="flex items-center p-2 space-x-2 w-10 h-10 p-2 mb-2 ml-2 rounded hover:bg-[#227cbd]/80 transition duration-200"
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? (
          <ChevronLeftIcon className="h-5 w-5" />
        ) : (
          <Bars3Icon className="h-5 w-5" />
        )}
      </button>
      
      <div className="flex-1 flex flex-col">
        <nav className="flex flex-col gap-2 px-2">
          <Link
            href="/createQuiz"
            className={`flex items-center space-x-2 hover:bg-[#227cbd] p-2 rounded ${
              pathname === '/createQuiz' ? 'bg-[#227cbd]' : ''
            }`}
            title="Create Quiz"
          >
            <HomeIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
            {expanded && <span className="truncate">Create Quiz</span>}
          </Link>

          <Link
            href="/playQuiz"
            className={`flex items-center space-x-2 hover:bg-[#227cbd] p-2 rounded ${
              pathname === '/playQuiz' ? 'bg-[#227cbd]' : ''
            }`}
            title="Play Quiz"
          >
            <UserCircleIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
            {expanded && <span className="truncate">Play Quiz</span>}
          </Link>

          <button 
          onClick={() => signOut({ callbackUrl: '/'})}
          className="flex items-center gap-2 p-2 rounded hover:bg-[#227cbd] w-full"
          title="Log Out"
        >
          <ArrowLeftEndOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {expanded && <span className="truncate">Log Out</span>}
        </button>
        </nav>
      </div>
    </div>
  );
}