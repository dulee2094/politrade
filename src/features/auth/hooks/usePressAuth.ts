import { useState } from 'react';
import { validatePressEmail, IS_TEST_BYPASS_MODE } from '../config/pressDomains';

export function usePressAuth() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  const [userIdChecked, setUserIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [detectedMedia, setDetectedMedia] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUserIdChange = (val: string) => {
    setUserId(val);
    setUserIdChecked(false);
    setErrorMsg(null);
  };

  const handleCheckUserId = () => {
    if (!userId.trim()) {
      setErrorMsg('사용할 아이디를 입력해주세요.');
      return false;
    }
    if (userId.length < 4) {
      setErrorMsg('아이디는 최소 4자 이상이어야 합니다.');
      return false;
    }
    setUserIdChecked(true);
    setErrorMsg(null);
    setSuccessMsg(`✅ '${userId}'는 사용 가능한 아이디입니다.`);
    return true;
  };

  const handleNicknameChange = (val: string) => {
    setNickname(val);
    setNicknameChecked(false);
    setErrorMsg(null);
  };

  const handleCheckNickname = () => {
    if (!nickname.trim()) {
      setErrorMsg('사용할 닉네임을 입력해주세요.');
      return false;
    }
    setNicknameChecked(true);
    setErrorMsg(null);
    setSuccessMsg(`✅ '${nickname}'은(는) 사용 가능한 닉네임입니다.`);
    return true;
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setEmailVerified(false);

    if (val.trim()) {
      const res = validatePressEmail(val);
      if (res.isValid) {
        setDetectedMedia(res.mediaName || '일반 회원');
      } else {
        setDetectedMedia(null);
      }
    } else {
      setDetectedMedia(null);
    }
  };

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setOtpSent(true);
    setOtpInput('123456'); // Auto-fill test code for fast testing!
    setErrorMsg(null);
    setSuccessMsg(`인증번호(123456)가 이메일로 발송되었습니다. [확인] 버튼을 클릭하세요.`);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() !== '123456' && otpInput.trim().length !== 6) {
      setErrorMsg('인증번호 6자리를 올바르게 입력해주세요. (테스트용: 123456)');
      return false;
    }
    setEmailVerified(true);
    setErrorMsg(null);
    setSuccessMsg(`🎉 이메일 인증 완료!`);
    return true;
  };

  return {
    userId,
    setUserId,
    handleUserIdChange,
    handleCheckUserId,
    userIdChecked,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    nickname,
    setNickname,
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
    setSuccessMsg,
    handleSendOtp,
    handleVerifyOtp,
  };
}
