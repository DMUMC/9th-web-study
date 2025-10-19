export interface UserSigninInformation {
    email: string;
    password: string;
}

export const validateSignin = (values: UserSigninInformation) => {
    const errors: Partial<UserSigninInformation> = {};

    if (!values.email) {
        errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!values.password) {
        errors.password = '비밀번호를 입력해주세요.';
    } else if (values.password.length < 6) {
        errors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    return errors;
};