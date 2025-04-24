import Image from 'next/image';
import React from 'react';

const LandingBackground = () => (
  <div className="absolute inset-0 z-0">
    <Image
      src="/material-background.jpg"
      alt="Material background"
      fill
      className="object-cover blur-sm"
      priority
    />
    <div className="absolute inset-0 bg-black/50" />
  </div>
);

export default LandingBackground; 