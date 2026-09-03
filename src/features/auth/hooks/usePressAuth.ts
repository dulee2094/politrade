import { useState } from 'react';
import { validatePressEmail, IS_TEST_BYPASS_MODE } from '../config/pressDomains';

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

    if (val.trim()) {
      const res = validatePressEmail(val);
      if (res.isValid) {
        setDetectedMedia(res.mediaName || '시범 언론사');
        if (IS_TEST_BYPASS_MODE) {
          setSuccessMsg(`🧪 [테스트 우회 모드] 임의 이메일 가입이 허용됩니다. (${res.mediaName})`);
        } else {
          setSuccessMsg(`인증 가능한 언론사 도메인입니다. (${res.mediaName})`);
        }
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
      setErrorMsg(res.error || '아이디 또는 이메일을 입력하세요.');
      return;
    }

    setOtpSent(true);
    setOtpInput('123456'); // Auto-fill test code for ultra-fast testing!
    setErrorMsg(null);
    setSuccessMsg(`인증번호(123456)가 자동 생성되었습니다. [확인] 버튼을 클릭하세요.`);
  };

  const handleVerifyOtp = () => {
    setEmailVerified(true);
    setErrorMsg(null);
    setSuccessMsg(`🎉 ${detectedMedia || '시범 언론사'} 기자 인증 완료!`);
    return true;
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
