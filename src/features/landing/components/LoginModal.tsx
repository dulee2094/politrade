import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { X, Key, User, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { validatePressEmail } from '../../auth/config/pressDomains';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { updatePressVerification, setIsSignUpModalOpen } = useStore();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!usernameInput.trim()) {
      setErrorMsg('아이디 또는 이메일을 입력하세요.');
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMsg('비밀번호를 입력하세요.');
      return;
    }

    const res = validatePressEmail(usernameInput);
    const finalNickname = usernameInput.includes('@')
      ? usernameInput.split('@')[0]
      : usernameInput;

    updatePressVerification({
      isVerified: true,
      email: usernameInput.includes('@') ? usernameInput : `${usernameInput}@politrade.io`,
      mediaName: res.mediaName || '일반 회원',
      verifiedAt: new Date().toLocaleDateString('ko-KR'),
    }, finalNickname);

    alert(`🎉 로그인 성공! (${finalNickname} 님 환영합니다.)`);
    onSuccess();
    onClose();
  };

  const handleOpenSignUp = () => {
    onClose();
    setIsSignUpModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">회원 로그인</h2>
              <p className="text-xs text-slate-400">아이디(또는 이메일)와 비밀번호 입력</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* User ID or Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">아이디 또는 이메일</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="아이디 또는 이메일주소 입력"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">비밀번호</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="비밀번호 입력"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Login Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
          >
            <span>로그인 및 대시보드 입장</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-1">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-mono shrink-0">OR</span>
        </div>

        {/* Link to Sign Up */}
        <button
          type="button"
          onClick={handleOpenSignUp}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center space-x-1.5"
        >
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <span>아직 계정이 없으신가요? 회원가입하기</span>
        </button>

      </div>
    </div>
  );
};
