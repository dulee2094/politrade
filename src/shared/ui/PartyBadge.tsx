import React from 'react';
import { Party } from '../../types';
import { getPartyStyle } from '../../config/partyConfig';

interface PartyBadgeProps {
  party: Party;
  className?: string;
}

export const PartyBadge: React.FC<PartyBadgeProps> = ({ party, className = '' }) => {
  const style = getPartyStyle(party);

  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border inline-block ${style.badgeBg} ${className}`}>
      {party}
    </span>
  );
};
