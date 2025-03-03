import React from 'react';
import Image from 'next/image';
import { Roboto } from 'next/font/google';

const Header = () => {
  return (
    <header className="w-full">
      {/* Headerbild med en container som anpassar sig för mobiler */}
      <div className="relative w-full h-80 md:h-80 lg:h-80">
        <Image
          src="/images/header.jpg" // Placera bilden i public/images/
          alt="Header Background"
          fill
          style={{ objectFit: 'cover' }}
          priority // Om bilden ska laddas snabbt (above the fold)
        />
      </div>

      {/* Text under bilden */}
        <h1 className="text-[#227cbd] text-center py-4 text-4xl md:text-4xl font-bold">TuneQuiz</h1>
    </header>
  );
};

export default Header;
