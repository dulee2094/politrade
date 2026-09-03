import { Party } from '../types';

export interface PartyStyle {
  name: Party;
  bgLight: string;
  text: string;
  border: string;
  badgeBg: string;
}

export const PARTY_STYLES: Record<Party, PartyStyle> = {
  '국민의힘': {
    name: '국민의힘',
    bgLight: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  },
  '더불어민주당': {
    name: '더불어민주당',
    bgLight: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  },
  '조국혁신당': {
    name: '조국혁신당',
    bgLight: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    badgeBg: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
  },
  '개혁신당': {
    name: '개혁신당',
    bgLight: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
  '무소속': {
    name: '무소속',
    bgLight: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    badgeBg: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  },
};

export function getPartyStyle(party: Party): PartyStyle {
  return PARTY_STYLES[party] || PARTY_STYLES['무소속'];
}
