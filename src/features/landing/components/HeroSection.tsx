import React, { useState } from 'react';
import { TrendingUp, ArrowRight, ShieldCheck, Sparkles, Key, Lock, Mail, UserPlus, Flame } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../../../config/constants';
import { useStore } from '../../../context/StoreContext';
import { validatePressEmail } from '../../auth/config/pressDomains';

interface HeroSectionProps {
  onOpenSignUp: () => void;
  onEnterApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSignUp, onEnterApp }) => {
  const { updatePressVerification } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailInput.trim()) {
      setErrorMsg('아이디 또는 이메일을 입력하세요.');
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMsg('비밀번호를 입력하세요.');
      return;
    }

    const res = validatePressEmail(emailInput);
    const finalNickname = emailInput.includes('@') 
      ? emailInput.split('@')[0] 
      : emailInput;

    updatePressVerification({
      isVerified: true,
      email: emailInput,
      mediaName: res.isValid && res.mediaName ? res.mediaName : '시범 언론사',
      verifiedAt: new Date().toLocaleDateString('ko-KR'),
    }, finalNickname || '여의도취재반장');

    onEnterApp();
  };

  return (
    <div className="relative py-8 sm:py-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column (7/12): Main Pitch & Option A Headlines */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left break-keep">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.3] sm:leading-[1.4] tracking-tight break-keep space-y-2">
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              POLI 주식거래 시스템
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-400 font-mono tracking-wider">
              POLITRADE
            </span>
          </h1>

          {/* Sub Title */}
          <p className="text-base sm:text-lg text-slate-200 font-bold leading-relaxed break-keep">
            재미삼아 하다보면 의미를 발견하게 되는 실시간 정치 시세판
          </p>

          {/* Sub Description */}
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed sm:leading-7 break-keep mx-auto lg:mx-0">
            플레이할수록 여의도 정치의 흐름이 눈에 보이는 신개념 여론 지표! <br className="hidden sm:inline" />
            <strong className="text-amber-300 font-bold">잠재력 높은 차세대 대장주</strong>와 <strong className="text-indigo-300 font-bold">묻혀있는 저평가 우량주</strong>를 직접 발굴해 보세요.
          </p>

          {/* Key Feature Highlights Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-400" /> 상장 의원 (30인+α) 호가창 매매
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm">
              <Flame className="w-4 h-4 text-amber-400" /> 주간 민심 펄스 & 1줄 평
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 개인정보 최소화 (이메일 인증)
            </span>
          </div>
        </div>

        {/* Right Column (5/12): Inline Login & SignUp Form Card with Ambient Glow */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="relative group">
            {/* Ambient Lighting Background Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none" />

            <div className="relative bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
              
              {/* Form Header */}
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold font-mono">
                  <Key className="w-4 h-4" />
                  <span>MEMBER ACCESS</span>
                </div>
                <h2 className="text-xl font-black text-white">회원 로그인</h2>
                <p className="text-xs text-slate-400">인증받은 아이디/이메일로 바로 입장하세요</p>
              </div>

              {/* Login Inputs Form */}
              <form onSubmit={handleInlineLogin} className="space-y-4">
                
                {/* ID / Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>아이디 또는 이메일</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="아이디 또는 이메일 (예: reporter@kbs.co.kr)"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>비밀번호</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="비밀번호를 입력하세요"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* 2-Column Action Buttons: [로그인] vs [회원가입] */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-1.5 border border-indigo-400/30 group"
                  >
                    <Key className="w-4 h-4 text-indigo-200" />
                    <span>로그인</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenSignUp}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-extrabold text-xs py-3.5 rounded-xl transition-all border border-slate-700/80 flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>회원가입</span>
                  </button>
                </div>

              </form>

              {/* Guest Mode Link */}
              <button
                type="button"
                onClick={onEnterApp}
                className="w-full text-center text-xs text-slate-400 hover:text-blue-400 font-bold py-1.5 transition-colors flex items-center justify-center space-x-1 pt-1"
              >
                <span>👀 로그인 없이 시범 서비스 둘러보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
