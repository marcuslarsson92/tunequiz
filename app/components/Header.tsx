// app/components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full">
      {/* Header which adjust to fit diffrent screens */}
      <div className="relative w-full h-80 md:h-80 lg:h-80">
        <Image
          src="/images/header.jpg"
          alt="Header Background"
          fill
          style={{ objectFit: 'cover' }}
          priority // For fast loading
        />
      </div>
        <h1 className="text-[#227cbd] text-center py-4 text-4xl md:text-4xl font-bold">TuneQuiz</h1>
    </header>
  );
};

export default Header;
