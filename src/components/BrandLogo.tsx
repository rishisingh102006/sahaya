import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* House outline with leaf inside icon matching the image */}
      <div className={`relative shrink-0 flex items-center justify-center ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      }`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* House outline in deep green */}
          <path
            d="M32 6L8 26V56C8 57.1046 8.89543 58 10 58H54C55.1046 58 56 57.1046 56 56V26L32 6Z"
            stroke="#1b4332"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* Inner roof accent / chimney */}
          <path
            d="M44 14V22"
            stroke="#1b4332"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Fresh green leaf inside house */}
          <path
            d="M23 44C23 44 26 31 39 30C39 30 40 43 27 45C25 45.3 23 44 23 44Z"
            fill="#52b788"
          />
          <path
            d="M24 43C28 38 34 34 38 31"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <div className="flex items-center leading-none">
          <span className={`font-extrabold tracking-tight text-[#1b4332] ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          }`}>
            Sahaya
          </span>
          <span className={`font-semibold text-[#52b788] ml-1.5 ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          }`}>
            Care
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] sm:text-[11px] font-medium text-[#40916c] mt-0.5 tracking-wide">
            Support Home & Care For Elders
          </p>
        )}
      </div>
    </div>
  );
};
