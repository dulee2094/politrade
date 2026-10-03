import React from 'react';
import { usePressAuth } from '../hooks/usePressAuth';
import { useStore } from '../../../context/StoreContext';
import { X, User, Lock, Mail, KeyRound, CheckCircle2, AlertCircle, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { updatePressVerification } = useStore();
  const {
    userId,
    handleUserIdChange,
    handleCheckUserId,
    userIdChecked,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    nickname,
    handleNicknameChange,
    handleCheckNickname,
    nicknameChecked,
    email,
    handleEmailChange,
    otpInput,
    setOtpInput,
    emailVerified,
    detectedMedia,
    otpSent,
    errorMsg,
    setErrorMsg,
    successMsg,
    handleSendOtp,
    handleVerifyOtp,
  } = usePressAuth();

  if (!isOpen) return null;

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userId.trim()) {
      setErrorMsg('아이디를 입력해 주세요.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호가 서로 일치하지 않습니다.');
      return;
    }
    if (!nickname.trim()) {
      setErrorMsg('사용할 닉네임을 입력해 주세요.');
      return;
    }
    if (!emailVerified) {
      if (!otpSent) {
        setErrorMsg('이메일 인증을 완료해 주세요. (인증번호 발송 필요)');
        return;
      }
      const verified = handleVerifyOtp();
      if (!verified) return;
    }

    updatePressVerification({
      isVerified: true,
      email,
      mediaName: detectedMedia || '일반 회원',
      verifiedAt: new Date().toLocaleDateString('ko-KR'),
    }, nickname);

    alert(`🎉 회원가입이 완료되었습니다!\n닉네임: ${nickname} 님, 환영합니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>POLITRADE 회원가입</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">PRIVACY PROTECTED</span>
              </h2>
              <p className="text-xs text-slate-400">개인정보 최소 수집 (아이디 / 비밀번호 / 닉네임 / 이메일 인증)</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          
          {/* 1. User ID (아이디) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex justify-between">
              <span>아이디</span>
              <span className="text-slate-500 font-normal">영문/숫자 4~15자</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="아이디 입력 (예: poli_user1)"
                  value={userId}
                  onChange={e => handleUserIdChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckUserId}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                {userIdChecked ? '✓ 확인됨' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 2. Password & Password Confirm (비밀번호 & 확인) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="8자 이상 입력"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">비밀번호 확인</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="비밀번호 다시 입력"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Nickname (닉네임) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex justify-between">
              <span>닉네임</span>
              <span className="text-slate-500 font-normal">서비스 활동용 익명 명칭</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="예: 여의도반장, 정치분석가"
                  value={nickname}
                  onChange={e => handleNicknameChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckNickname}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                {nicknameChecked ? '✓ 확인됨' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 4. Email & Verification (이메일 인증) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex justify-between">
              <span>이메일 주소 (인증용)</span>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 계정 안전 인증
              </span>
            </label>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={emailVerified}
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-60"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={emailVerified}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border border-indigo-500/30"
              >
                {emailVerified ? '인증 완료' : otpSent ? '재발송' : '인증번호 발송'}
              </button>
            </div>
          </div>

          {/* OTP Form Input */}
          {otpSent && !emailVerified && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>이메일 6자리 인증번호</span>
                <span className="text-amber-400 font-mono text-[10px]">테스트용 번호: 123456</span>
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
                  인증 확인
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

          {/* Final Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-1 mt-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>회원가입 완료 (+300,000 P 지급)</span>
          </button>

        </form>

      </div>
    </div>
  );
};
