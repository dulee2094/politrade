import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { X, Key, Mail, ArrowRight } from 'lucide-react';
import { validatePressEmail } from '../../auth/config/pressDomains';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { updatePressVerification } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = validatePressEmail(emailInput);
    if (!res.isValid) {
      setErrorMsg(res.error || '이메일을 입력하세요.');
      return;
    }

    const finalNickname = nicknameInput.trim() || '여의도취재반장';

    updatePressVerification({
      isVerified: true,
      email: emailInput,
      mediaName: res.mediaName || '시범 언론사',
      verifiedAt: new Date().toLocaleDateString('ko-KR'),
    }, finalNickname);

    alert(`🎉 로그인 성공! (${finalNickname} 님 환영합니다.)`);
    onSuccess();
    onClose();
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
              <h2 className="text-base font-extrabold text-white">회원 간편 로그인</h2>
              <p className="text-xs text-slate-400">인증받은 이메일/아이디로 로그인</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">이메일 주소 또는 아이디</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="test@naver.com, admin, reporter@kbs.co.kr 등"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">닉네임 (선택)</label>
            <input
              type="text"
              placeholder="예: 여의도취재반장"
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
          >
            <span>로그인 및 대시보드 입장</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
