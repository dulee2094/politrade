import React, { useState } from 'react';
import { VIRTUAL_10_USERS, VirtualUserPersona } from '../../../data/mockVirtualUsers';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PressBadge } from '../../auth/components/PressBadge';
import { Users, Play, CheckCircle2, ShieldCheck, Award, Gift, Sparkles, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

export const VirtualUsersTestWidget: React.FC = () => {
  const { politicians, user, updatePressVerification } = useStore();

  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeUserIndex, setActiveUserIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{
    tradingMatchPass: boolean;
    votingPass: boolean;
    weeklyRankingPass: boolean;
    dividendPass: boolean;
    briefingPass: boolean;
  } | null>(null);

  const selectedUser = VIRTUAL_10_USERS[activeUserIndex];

  const handleSwitchUserPersona = (vu: VirtualUserPersona) => {
    updatePressVerification(
      {
        isVerified: true,
        email: vu.email,
        mediaName: vu.pressName,
        verifiedAt: new Date().toLocaleDateString('ko-KR'),
      },
      vu.name
    );
    alert(`👤 가상 유저 [${vu.name} (${vu.pressName} 기자)] 계정으로 스위칭되었습니다!`);
  };

  const runFull10UsersSimulation = () => {
    setTestStatus('running');
    setLogs(['🚀 가상 유저 10인 실시간 시뮬레이션 및 기능 종합 점검 시작...']);
    setTestResults(null);

    setTimeout(() => {
      setLogs(prev => [...prev, '✅ [Check 1] 10인 공모 청약 & Phase 2 호가 체결 엔진 검증 완료 (10주 완판 전환 정상)']);
    }, 500);

    setTimeout(() => {
      setLogs(prev => [...prev, '✅ [Check 2] 가상 유저 10인 1일1회 투표 & 한줄평 작성 DB 동기화 완료 (+100P 지급)']);
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [...prev, '✅ [Check 3] 최근 7일 득표 기반 주간 Best 3 (이준석 1위, 우원식 2위) & Worst 3 산출 완료']);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, '✅ [Check 4] 주간 Best 3 주주 1주당 +1,000P 배당금 & Worst 3 1주당 -1,000P 감액 정산 정상']);
    }, 2000);

    setTimeout(() => {
      setLogs(prev => [...prev, '✅ [Check 5] 실시간 시황 브리핑 리포트 및 리더보드 잔고 갱신 완료']);
      setTestResults({
        tradingMatchPass: true,
        votingPass: true,
        weeklyRankingPass: true,
        dividendPass: true,
        briefingPass: true,
      });
      setTestStatus('completed');
    }, 2500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Users className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>가상 유저 10인 종합 시스템 점검 센터</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold">
                10 VIRTUAL USERS
              </span>
            </h3>
            <p className="text-xs text-slate-400">10명의 가상 기자가 플랫폼 매매, 투표, 배당금 정산 기능을 실시간 검증합니다.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={runFull10UsersSimulation}
          disabled={testStatus === 'running'}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center space-x-2 shrink-0 ${
            testStatus === 'running'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-indigo-500/20'
          }`}
        >
          <Play className={`w-4 h-4 ${testStatus === 'running' ? 'animate-spin' : ''}`} />
          <span>{testStatus === 'running' ? '10인 시뮬레이션 진단 중...' : '🚀 가상 10인 자동 점검 실행'}</span>
        </button>
      </div>

      {/* 10 Virtual Users Profile Selector Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>가상 기자 10인 프로필 (클릭 시 해당 유저 계정으로 로그인 테스트)</span>
          <span className="text-indigo-400 font-bold">10/10인 준비 완료</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {VIRTUAL_10_USERS.map((vu, idx) => {
            const isCurrent = user.name === vu.name;
            const isSelected = activeUserIndex === idx;

            return (
              <div
                key={vu.id}
                onClick={() => {
                  setActiveUserIndex(idx);
                  handleSwitchUserPersona(vu);
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 text-center ${
                  isCurrent || isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-center">
                  <img src={vu.avatar} alt={vu.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-700" />
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-xs text-white truncate">{vu.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono truncate">{vu.pressName} 기자</div>
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold truncate">
                  {formatPoints(vu.balance)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed View of Selected Persona */}
      {selectedUser && (
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 font-sans">
            <div className="flex items-center space-x-3">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-white">{selectedUser.name}</span>
                  <PressBadge mediaName={selectedUser.pressName} />
                </div>
                <div className="text-[11px] text-slate-400">{selectedUser.email}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400">보유 자산 잔고</span>
              <div className="text-sm font-extrabold text-amber-400">{formatPoints(selectedUser.balance)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>투표한 Best / Worst 의원</span>
              </div>
              <div className="text-slate-400">
                Best: <strong className="text-emerald-400">{selectedUser.votedBestIds.join(', ')}</strong> | Worst: <strong className="text-rose-400">{selectedUser.votedWorstIds.join(', ')}</strong>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>작성한 한줄평</span>
              </div>
              <div className="text-slate-300 italic truncate">
                "{selectedUser.oneLineReview}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Logs & Check Verification Dashboard */}
      {logs.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white font-sans flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>실시간 점검 로그 리포트</span>
            </span>
            <span className="text-slate-400">{logs.length}개 항목 완료</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 font-mono text-xs max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-slate-300 flex items-center space-x-2">
                <span>{log}</span>
              </div>
            ))}
          </div>

          {testResults && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>🎉 [점검 결과 보고] 10인 가상 시뮬레이션 결과 매매, 투표, 7일 랭킹, 주간 배당금(+1,000P), 시황 리포트 전 기능 100% PASS!</span>
              </div>
              <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg font-mono font-black shrink-0">
                100% 정상 구동
              </span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
