import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { Party, ListingPetition } from '../../../types';
import { UNLISTED_POLITICIAN_CANDIDATES } from '../data/unlistedCandidates';
import { Vote, Sparkles, Clock, CheckCircle2, AlertCircle, PlusCircle, UserCheck, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface ListingPetitionHubProps {
  onGoToMarketTab: () => void;
}

export const ListingPetitionHub: React.FC<ListingPetitionHubProps> = ({ onGoToMarketTab }) => {
  const { petitions, createPetition, agreePetition, user, politicians } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(UNLISTED_POLITICIAN_CANDIDATES[0].id);
  const [formData, setFormData] = useState({
    name: UNLISTED_POLITICIAN_CANDIDATES[0].name,
    party: UNLISTED_POLITICIAN_CANDIDATES[0].party,
    district: UNLISTED_POLITICIAN_CANDIDATES[0].district,
    title: UNLISTED_POLITICIAN_CANDIDATES[0].title,
    bio: '',
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [candidatePartyFilter, setCandidatePartyFilter] = useState<string>('ALL');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState<string>('');

  const filteredCandidates = UNLISTED_POLITICIAN_CANDIDATES.filter(cand => {
    const matchParty = candidatePartyFilter === 'ALL' || cand.party === candidatePartyFilter;
    const matchSearch = 
      cand.name.includes(candidateSearchQuery) || 
      cand.district.includes(candidateSearchQuery) ||
      cand.title.includes(candidateSearchQuery);
    return matchParty && matchSearch;
  });

  const handleOpenModal = () => {
    setFeedback(null);
    setCandidatePartyFilter('ALL');
    setCandidateSearchQuery('');
    const firstCand = UNLISTED_POLITICIAN_CANDIDATES[0];
    if (firstCand) {
      setSelectedCandidateId(firstCand.id);
      setFormData({
        name: firstCand.name,
        party: firstCand.party,
        district: firstCand.district,
        title: firstCand.title,
        bio: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSelectCandidate = (candId: string) => {
    setSelectedCandidateId(candId);
    const cand = UNLISTED_POLITICIAN_CANDIDATES.find(c => c.id === candId);
    if (cand) {
      setFormData(prev => ({
        ...prev,
        name: cand.name,
        party: cand.party,
        district: cand.district,
        title: cand.title,
      }));
    }
  };

  // Total Mock Users Benchmark (50 users)
  const TOTAL_MOCK_USERS = 50;
  const TARGET_REQUIRED = Math.max(10, Math.ceil(TOTAL_MOCK_USERS * 0.10)); // 10

  const activePetitions = petitions.filter(p => p.status === 'ACTIVE');
  const approvedPetitions = petitions.filter(p => p.status === 'APPROVED');
  const expiredPetitions = petitions.filter(p => p.status === 'EXPIRED');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.name.trim() || !formData.district.trim() || !formData.title.trim()) {
      setFeedback({ type: 'error', message: '의원 이름, 지역구, 현직 타이틀을 모두 입력해 주세요.' });
      return;
    }

    const res = createPetition(formData);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setFormData({ name: '', party: '국민의힘', district: '', title: '', bio: '' });
      setIsModalOpen(false);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleAgreeClick = (petitionId: string) => {
    setFeedback(null);
    const res = agreePetition(petitionId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const getTimeRemaining = (expiresAtStr: string) => {
    const diff = new Date(expiresAtStr).getTime() - new Date().getTime();
    if (diff <= 0) return '기간 만료';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `D-${days}일 ${hours}시간 남음`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Top Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> COMMUNITY CONSENSUS
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold">
                ① 최소 10명 동의
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold">
                ② 전체 회원 10% 동의
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-slate-700">
                ⏱️ 10일 기한제 (포인트 0P)
              </span>
            </div>

            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>제22대 국회의원 신규 주식 상장 청원소</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              30인 외 미상장 국회의원의 신규 상장을 자유롭게 발의하고 동의할 수 있습니다.<br />
              발의일로부터 <strong className="text-amber-400">10일 이내</strong>에 <strong className="text-white font-bold">사용자 10명 이상 & 전체 회원의 10% 동의</strong>를 동시 충족하면 해당 의원의 주식이 <strong className="text-emerald-400">POLI주식 매매 시장에 자동 상장</strong>됩니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 shrink-0 border border-amber-400/40 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>신규 의원 상장 청원 발의하기 (0P)</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Notice */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg text-xs font-bold font-mono ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
            : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        }`}>
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">닫기</button>
        </div>
      )}

      {/* 2. Active Petitions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Vote className="w-5 h-5 text-amber-400" />
            <span>현재 진행 중인 상장 청원</span>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-mono border border-amber-500/30">
              {activePetitions.length}건 진행 중
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            목표: 동의 {TARGET_REQUIRED}명 달성 시 자동 상장
          </span>
        </div>

        {activePetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activePetitions.map((pet) => {
              const agreedCount = pet.agreedUsers.length;
              const pct = Math.min(100, Math.round((agreedCount / TARGET_REQUIRED) * 100));
              const hasAgreed = pet.agreedUsers.includes(user.name);
              const timeLeft = getTimeRemaining(pet.expiresAt);

              return (
                <div
                  key={pet.id}
                  className="bg-slate-900/90 hover:bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/40 p-5 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Candidate Top Profile Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <PoliticianAvatar
                          src={pet.imageUrl || ''}
                          name={pet.politicianName}
                          party={pet.party}
                          className="w-12 h-12 rounded-2xl"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-extrabold text-white">{pet.politicianName}</h4>
                            <PartyBadge party={pet.party} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{pet.district} • {pet.title}</p>
                        </div>
                      </div>

                      <span className="bg-slate-800 text-amber-300 text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{timeLeft}</span>
                      </span>
                    </div>

                    {/* Petition Reason Box */}
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-300 font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> 최초 발의자: <strong className="text-white">{pet.petitionerName}</strong>
                        </span>
                        <span>10일 기한 청원</span>
                      </div>
                      <p className="text-xs text-slate-200 italic mt-1 leading-relaxed">
                        "{pet.bio}"
                      </p>
                    </div>

                    {/* Consensus Progress Bar */}
                    <div className="space-y-1.5 font-mono pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">유저 동의 현황</span>
                        <span className="font-extrabold text-white">
                          <strong className="text-amber-400 text-sm">{agreedCount}명</strong> / 목표 {TARGET_REQUIRED}명 ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Agree Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleAgreeClick(pet.id)}
                      disabled={hasAgreed}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-md ${
                        hasAgreed
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-[1.01]'
                      }`}
                    >
                      <Vote className="w-4 h-4 text-emerald-300" />
                      <span>{hasAgreed ? '✅ 이미 동의함 (상장 대기 중)' : '✋ 나도 상장 동의하기 (0P 무료)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <Vote className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">현재 진행 중인 상장 청원이 없습니다.</p>
            <p className="text-xs text-slate-500">원하시는 22대 국회의원의 상장을 가장 먼저 발의해 보세요!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all"
            >
              ➕ 최초 상장 청원하기 (0P)
            </button>
          </div>
        )}
      </div>

      {/* 3. Approved / Expired History Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>최근 상장 성공 및 만료 기록</span>
          </h4>
          <span className="text-xs text-slate-500">자동 상장 승인건 & 재청원 가능건</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Approved Auto-Listed Items */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>🎉 유저 동의 달성으로 상장 완료된 의원</span>
              <span className="font-mono text-[10px]">{approvedPetitions.length}건</span>
            </div>
            {approvedPetitions.length > 0 ? (
              <div className="space-y-2">
                {approvedPetitions.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="font-extrabold text-white">{p.politicianName}</span>
                      <span className="text-[10px] text-slate-400">{p.party}</span>
                    </div>
                    <button
                      onClick={onGoToMarketTab}
                      className="text-[10px] text-blue-400 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>매매하러 가기</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2 text-center">최근 청원 상장 내역이 여기에 표시됩니다.</p>
            )}
          </div>

          {/* Expired Item Archive */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>⏱️ 10일 기간 만료 건 (재청원 가능)</span>
              <span className="font-mono text-[10px]">{expiredPetitions.length}건</span>
            </div>
            {expiredPetitions.length > 0 ? (
              <div className="space-y-2">
                {expiredPetitions.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 font-bold">✗</span>
                      <span className="font-bold text-slate-300">{p.politicianName}</span>
                      <span className="text-[10px] text-slate-500">10일 기한 만료</span>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({ name: p.politicianName, party: p.party, district: p.district, title: p.title, bio: '' });
                        setIsModalOpen(true);
                      }}
                      className="text-[10px] text-amber-400 hover:underline font-bold"
                    >
                      재청원하기
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2 text-center">기간 만료된 청원 내역이 없습니다.</p>
            )}
          </div>

        </div>
      </div>

      {/* 4. Create Petition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">신규 국회의원 상장 청원 발의</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>신규 상장 대상 국회의원 선택 (제22대 전체 현직) *</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">검증 DB {UNLISTED_POLITICIAN_CANDIDATES.length}명</span>
                </label>

                {/* Party filter & Search controls */}
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={candidatePartyFilter}
                    onChange={e => setCandidatePartyFilter(e.target.value)}
                    className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="ALL">전체 정당</option>
                    <option value="국민의힘">국민의힘</option>
                    <option value="더불어민주당">더불어민주당</option>
                    <option value="조국혁신당">조국혁신당</option>
                    <option value="개혁신당">개혁신당</option>
                    <option value="진보당">진보당</option>
                  </select>

                  <input
                    type="text"
                    placeholder="의원 이름 또는 지역구 검색..."
                    value={candidateSearchQuery}
                    onChange={e => setCandidateSearchQuery(e.target.value)}
                    className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={selectedCandidateId}
                  onChange={e => handleSelectCandidate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                >
                  {filteredCandidates.map(cand => (
                    <option key={cand.id} value={cand.id}>
                      [{cand.party}] {cand.name} ({cand.district}) - {cand.title}
                    </option>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <option value="" disabled>검색 조건에 해당하는 미상장 의원이 없습니다.</option>
                  )}
                </select>
              </div>

              {/* Auto-filled Politician Info Preview Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>검증된 제22대 현직 국회의원 정보</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-white">{formData.name}</span>
                    <PartyBadge party={formData.party} />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{formData.district}</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">{formData.title}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">상장 청원 이유 (1줄 요약) *</label>
                <textarea
                  rows={2}
                  placeholder="왜 이 의원의 주식이 상장되어야 하는지 이유를 적어주세요..."
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
                <p>💡 청원 등록 시 <strong>10일 카운트다운 타이머</strong>가 즉시 개시됩니다.</p>
                <p>💡 10일 내 <strong>10명 이상 & 회원 10% 동의</strong> 달성 시 자동 상장됩니다.</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  🚀 청원 등록하기 (0P)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
