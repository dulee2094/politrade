import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { PressBadge } from './PressBadge';
import { X, Calendar, Wallet, CheckCircle2, ShieldCheck, Newspaper, Award, History } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface UserProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDetailModal: React.FC<UserProfileDetailModalProps> = ({ isOpen, onClose }) => {
  const { user } = useStore();

  if (!isOpen) return null;

  const holdingsCount = Object.values(user.holdings || {}).filter(h => h && h.shares > 0).length;
  const tradeLogs = user.tradeHistory || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
                <PressBadge mediaName={user.pressName || 'KBS'} />
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {user.verifiedEmail || 'reporter@kbs.co.kr'} • 정기 매월 지원금 회원
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Balance & Allowance Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 p-4 rounded-2xl border border-blue-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              현재 보유 가상머니
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {formatPoints(user.balance || 0)}
            </div>
            <p className="text-[11px] text-slate-400">자유로운 매매 및 민심 토론 지원 포인트</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              월간 자동 정기 지원금
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              100,000 P / 매월
            </div>
            <p className="text-[11px] text-slate-400">매월 1일 자정 시스템 자동 지급</p>
          </div>
        </div>

        {/* Account Privileges */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-3 text-xs">
          <h4 className="font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>신뢰 검증 회원 혜택 & 권한</span>
          </h4>

          <ul className="space-y-2 text-slate-300 font-mono">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>언론사 공식 인증 뱃지 표시 (<strong className="text-white">{user.pressName || 'KBS'}</strong>)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>매월 초 10만P 정기 매매 지원금 100% 무상 지급</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>주간 Best 3 / Worst 3 의원 주주 배당금(+1,000P) 정산 권한</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>민심 토론방 베스트 한줄평 작성 및 포상금(+2,000P) 획득 자격</span>
            </li>
          </ul>
        </div>

        {/* Recent Trade History Snippet */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <History className="w-4 h-4 text-indigo-400" />
            <span>최근 체결 내역 ({tradeLogs.length}건 / 보유 {holdingsCount}종목)</span>
          </h4>

          {tradeLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center bg-slate-900/60 rounded-xl border border-slate-800">
              아직 체결된 매매 내역이 없습니다.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {tradeLogs.slice(0, 5).map((log, idx) => (
                <div key={idx} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {log.type === 'BUY' ? '매수' : '매도'}
                    </span>
                    <span className="font-bold text-white">{log.politicianName}</span>
                    <span className="text-slate-400">{log.shares}주</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-slate-300">{formatPoints(log.pricePerShare)}</span>
                    <span className="text-slate-500 ml-2">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all border border-slate-700"
        >
          확인 및 닫기
        </button>

      </div>
    </div>
  );
};
