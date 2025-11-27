export interface UserSigninInformation {
  email: string;
  password: string;
}

export interface UserSignupInformation {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: '이메일을 입력해주세요.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '유효하지 않은 이메일 형식입니다.' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: '비밀번호를 입력해주세요.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }
  return { isValid: true };
};

export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
): ValidationResult => {
  if (!passwordConfirm) {
    return { isValid: false, error: '비밀번호를 다시 입력해주세요.' };
  }
  if (password !== passwordConfirm) {
    return { isValid: false, error: '비밀번호가 일치하지 않습니다.' };
  }
  return { isValid: true };
};

export const validateNickname = (nickname: string): ValidationResult => {
  if (!nickname) {
    return { isValid: false, error: '닉네임을 입력해주세요.' };
  }
  if (nickname.length < 2) {
    return { isValid: false, error: '닉네임은 최소 2자 이상이어야 합니다.' };
  }
  return { isValid: true };
};

export const validateSignin = (values: UserSigninInformation): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailResult = validateEmail(values.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error || '';
  }
  
  const passwordResult = validatePassword(values.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error || '';
  }
  
  return errors;
};

export const validateSignup = (values: UserSignupInformation): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailResult = validateEmail(values.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error || '';
  }
  
  const passwordResult = validatePassword(values.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error || '';
  }
  
  const passwordConfirmResult = validatePasswordConfirm(values.password, values.passwordConfirm);
  if (!passwordConfirmResult.isValid) {
    errors.passwordConfirm = passwordConfirmResult.error || '';
  }
  
  const nicknameResult = validateNickname(values.nickname);
  if (!nicknameResult.isValid) {
    errors.nickname = nicknameResult.error || '';
  }
  
  return errors;
};

