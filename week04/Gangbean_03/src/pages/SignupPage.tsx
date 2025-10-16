import { zodResolver } from '@hookform/resolvers/zod';
import {
    useForm,
    type SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import InputField from '../components/InputField';
import { useState } from 'react';

const schema = z
    .object({
        email: z.email({
            message: '올바른 이메일 형식이 아닙니다.',
        }),
        password: z
            .string()
            .min(8, {
                message:
                    '비밀번호는 8자 이상이어야 합니다.',
            })
            .max(20, {
                message: '비밀번호는 20자 이하여야 합니다.',
            }),
        passwordCheck: z
            .string()
            .min(8, {
                message:
                    '비밀번호는 8자 이상이어야 합니다.',
            })
            .max(20, {
                message: '비밀번호는 20자 이하여야 합니다.',
            }),
        name: z
            .string()
            .min(1, { message: '이름을 입력해주세요.' }),
    })
    .refine(
        (data) => data.password === data.passwordCheck,
        {
            message: '비밀번호가 일치하지 않습니다.',
            path: ['passwordCheck'],
        }
    );

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<FormFields> = async (
        data
    ) => {
        const { passwordCheck, ...rest } = data;
        const response = await postSignup(rest);
        console.log(response);
    };

    const [currentStep, setCurrentStep] = useState(1);

    const goToNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1:
                // 이메일이 있고 유효성 검사 통과했을 때만
                const email = watch('email');
                return (
                    email &&
                    email.trim() !== '' &&
                    !errors.email
                );
            case 2:
                // 비밀번호와 비밀번호 확인이 있고 유효성 검사 통과했을 때만
                const password = watch('password');
                const passwordCheck =
                    watch('passwordCheck');
                return (
                    password &&
                    password.trim() !== '' &&
                    passwordCheck &&
                    passwordCheck.trim() !== '' &&
                    !errors.password &&
                    !errors.passwordCheck
                );
            case 3:
                // 이름이 있고 유효성 검사 통과했을 때만
                const name = watch('name');
                return (
                    name &&
                    name.trim() !== '' &&
                    !errors.name
                );
            default:
                return false;
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between w-full'>
                    <button
                        onClick={goToPrevStep}
                        className='w-10 h-10 flex items-center cursor-pointer'
                    >
                        &lt;
                    </button>
                    <h1 className='text-lg font-medium'>
                        회원가입
                    </h1>
                    <div className='w-10'></div>
                </div>
                {currentStep === 2 && (
                    <div className='text-gray-600 text-sm flex items-center'>
                        <svg
                            className='w-4 h-4 mr-2'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                            <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                        </svg>
                        {watch('email')}
                    </div>
                )}
                {currentStep === 1 && (
                    <InputField
                        register={register}
                        name='email'
                        type='email'
                        placeholder='이메일'
                        errors={errors}
                    />
                )}
                {currentStep === 2 && (
                    <>
                        <InputField
                            register={register}
                            name='password'
                            type='password'
                            placeholder='비밀번호'
                            errors={errors}
                        />
                        <InputField
                            register={register}
                            name='passwordCheck'
                            type='password'
                            placeholder='비밀번호 확인'
                            errors={errors}
                        />
                    </>
                )}
                {currentStep === 3 && (
                    <InputField
                        register={register}
                        name='name'
                        type='text'
                        placeholder='이름'
                        errors={errors}
                    />
                )}
                <button
                    disabled={
                        isSubmitting ||
                        !isCurrentStepValid()
                    }
                    type='button'
                    onClick={
                        currentStep < 3
                            ? goToNextStep
                            : handleSubmit(onSubmit)
                    }
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                >
                    {currentStep < 3 ? '다음' : '회원가입'}
                </button>
            </div>
        </div>
    );
};

export default SignupPage;
