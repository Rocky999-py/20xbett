
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    xs: 'scale-[0.4]',
    sm: 'scale-[0.55]',
    md: 'scale-[0.7] md:scale-100',
    lg: 'scale-[1] md:scale-125',
    xl: 'scale-[1.4] md:scale-[1.8]', 
  };

  return (
    <div className={`flex items-center select-none ${className} ${sizeClasses[size]} origin-left`}>
      <div className="mr-3 opacity-95 flex-shrink-0">
        <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15C50 15 25 35 25 65C25 75 35 85 50 85C65 85 75 75 75 65C75 35 50 15 50 15Z" stroke="white" strokeWidth="4" />
          <path d="M40 85V95M60 85V95" stroke="white" strokeWidth="4" />
          <circle cx="50" cy="45" r="5" stroke="white" strokeWidth="4" />
        </svg>
      </div>
      <div className="flex items-baseline font-logo leading-none tracking-[0.1em]">
        <span className="text-3xl md:text-4xl font-black text-crumpled">20</span>
        <span className="text-4xl md:text-5xl font-black text-x-glitch mx-1">X</span>
        <span className="text-xl md:text-2xl font-black text-crumpled self-end pb-1">Bet</span>
      </div>
    </div>
  );
};

export default Logo;
