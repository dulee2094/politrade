import React from 'react';
import { usePressAuth } from '../hooks/usePressAuth';
import { useStore } from '../../../context/StoreContext';
import { PRESS_DOMAINS_LIST } from '../config/pressDomains';
import { X, ShieldCheck, Mail, KeyRound, CheckCircle2, AlertCircle, Newspaper, Sparkles } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { updatePressVerification } = useStore();
  const {
    nickname,
    setNickname,
    email,
    handleEmailChange,
    otpInput,
    setOtpInput,
    emailVerified,
    detectedMedia,
    otpSent,
    errorMsg,
    successMsg,
    handleSendOtp,
    handleVerifyOtp,
  } = usePressAuth();

  if (!isOpen) return null;

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('사용할 닉네임을 입력해 주세요.');
      return;
    }
    if (!emailVerified) {
      const verified = handleVerifyOtp();
      if (!verified) return;
    }

    updatePressVerification({
      isVerified: true,
      email,
      mediaName: detectedMedia || '언론사',
      verifiedAt: new Date().toLocaleDateString('ko-KR'),
    }, nickname);

    alert(`🎉 ${detectedMedia || '언론사'} 기자 인증이 완료되었습니다! 익명 닉네임(${nickname})으로 활동을 시작합니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>언론사 기자 전용 회원가입</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30 font-mono">VERIFIED</span>
              </h2>
              <p className="text-xs text-slate-400">공식 기자 이메일 도메인 검증 및 익명 닉네임 설정</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          
          {/* 1. Nickname */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex justify-between">
              <span>자유 닉네임 설정</span>
              <span className="text-slate-500 font-normal">서비스에 공개되는 익명명</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 여의도취재수첩, 국회반장"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* 2. Press Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex justify-between">
              <span>소속 언론사 공식 이메일</span>
              <span className="text-blue-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 비공개 안전 보관
              </span>
            </label>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={emailVerified}
                  placeholder="reporter@kbs.co.kr, chosun.com 등"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono disabled:opacity-60"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!detectedMedia || emailVerified}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border border-blue-500/30"
              >
                인증번호 발송
              </button>
            </div>
          </div>

          {/* Detected Media Badge */}
          {detectedMedia && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 text-xs text-blue-300 flex items-center justify-between">
              <span>감지된 언론사: <strong className="text-white font-bold">{detectedMedia}</strong></span>
              <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 font-mono">가입 대상 승인</span>
            </div>
          )}

          {/* 3. OTP Form */}
          {otpSent && !emailVerified && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>이메일 6자리 인증번호</span>
                <span className="text-amber-400 font-mono text-[10px]">테스트용: 123456</span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="인증번호 6자리 입력"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono font-bold tracking-widest"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* Status Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Supported Media Domains Sample */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">가입 승인 언론사 도메인 예시:</span>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 font-mono">
              {PRESS_DOMAINS_LIST.slice(0, 10).map(p => (
                <span key={p.domain} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  @{p.domain} ({p.name})
                </span>
              ))}
              <span className="text-slate-400">+기타 언론사</span>
            </div>
          </div>

          {/* Final Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>기자 인증 완료 및 서비스 시작 (+1,000,000 P)</span>
          </button>

        </form>

      </div>
    </div>
  );
};
