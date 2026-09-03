import React from 'react';
import { WeeklyPoll } from '../types/board.types';
import { Vote, CheckCircle2 } from 'lucide-react';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { Party } from '../../../types';

interface PollWidgetProps {
  poll: WeeklyPoll;
  onVote: (optionId: string) => void;
}

export const PollWidget: React.FC<PollWidgetProps> = ({ poll, onVote }) => {
  const hasVoted = Boolean(poll.userVotedOptionId);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">{poll.title}</h3>
            <p className="text-xs text-indigo-300">언론사 기자 회원의 실시간 의정 활동 펄스 투표</p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">총 {poll.totalVotes}명 참여</span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {poll.options.map((opt) => {
          const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
          const isSelected = poll.userVotedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onVote(opt.id)}
              disabled={hasVoted}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              {/* Progress fill */}
              {hasVoted && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-blue-500/20 pointer-events-none transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white">{opt.politicianName}</span>
                <PartyBadge party={opt.party as Party} />
              </div>

              <div className="relative z-10 flex items-center space-x-2 font-mono text-xs font-bold">
                {hasVoted && <span>{pct}% ({opt.votes}표)</span>}
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>투표 참여가 완료되었습니다.</span>
        </div>
      )}
    </div>
  );
};
