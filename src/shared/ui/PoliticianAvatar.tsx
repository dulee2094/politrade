import React, { useState } from 'react';
import { Party } from '../../types';

interface PoliticianAvatarProps {
  src: string;
  name: string;
  party?: Party;
  className?: string;
}

export const PoliticianAvatar: React.FC<PoliticianAvatarProps> = ({
  src,
  name,
  party,
  className = 'w-12 h-12 rounded-2xl',
}) => {
  const [hasError, setHasError] = useState(false);

  // Party Color Accents for Initials Avatar Fallback
  const getPartyColor = (p?: Party) => {
    switch (p) {
      case '국민의힘':
        return 'bg-rose-900/90 text-rose-200 border-rose-500/50';
      case '더불어민주당':
        return 'bg-blue-900/90 text-blue-200 border-blue-500/50';
      case '개혁신당':
        return 'bg-amber-900/90 text-amber-200 border-amber-500/50';
      case '조국혁신당':
        return 'bg-indigo-900/90 text-indigo-200 border-indigo-500/50';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`${className} ${getPartyColor(
          party
        )} flex items-center justify-center font-extrabold text-sm border shadow-md font-sans shrink-0 select-none`}
        title={name}
      >
        {name ? name.slice(0, 2) : '의원'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
      className={`${className} object-cover ring-2 ring-slate-700/80 shadow-md shrink-0`}
    />
  );
};
