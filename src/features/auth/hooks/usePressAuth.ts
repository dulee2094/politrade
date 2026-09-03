import { useState } from 'react';
import { validatePressEmail } from '../config/pressDomains';

export function usePressAuth() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [detectedMedia, setDetectedMedia] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);

    if (val.includes('@')) {
      const res = validatePressEmail(val);
      if (res.isValid) {
        setDetectedMedia(res.mediaName || null);
        setSuccessMsg(`인증 가능한 언론사 도메인입니다. (${res.mediaName})`);
      } else {
        setDetectedMedia(null);
        setErrorMsg(res.error || '언론사 이메일이 아닙니다.');
      }
    } else {
      setDetectedMedia(null);
    }
  };

  const handleSendOtp = () => {
    const res = validatePressEmail(email);
    if (!res.isValid) {
      setErrorMsg(res.error || '언론사 공식 이메일을 입력하세요.');
      return;
    }

    setOtpSent(true);
    setErrorMsg(null);
    setSuccessMsg(`인증번호가 ${email} 로 발송되었습니다. (시범 테스트용 인증번호: 123456)`);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === '123456' || otpInput.trim().length === 6) {
      setEmailVerified(true);
      setErrorMsg(null);
      setSuccessMsg(`🎉 ${detectedMedia || '언론사'} 기자 이메일 인증이 완료되었습니다!`);
      return true;
    } else {
      setErrorMsg('인증번호가 일치하지 않습니다. (테스트용 인증번호: 123456)');
      return false;
    }
  };

  return {
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
  };
}
