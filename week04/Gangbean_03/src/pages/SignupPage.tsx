import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import InputField from '../components/InputField';

const schema = z
    .object({
        email: z.email({ message: '올바른 이메일 형식이 아닙니다.' }),
        password: z
            .string()
            .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
            .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
        passwordCheck: z
            .string()
            .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
            .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
        name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: '비밀번호가 일치하지 않습니다.',
        path: ['passwordCheck'],
    });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(schema),
        mode: 'onBlur',
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const { passwordCheck, ...rest } = data;
        const response = await postSignup(rest);
        console.log(response);
    };
    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className='flex flex-col gap-3'>
                <button className='w-10 h-10 flex items-center justify-center cursor-pointer'>
                    &lt;
                </button>
                <InputField
                    register={register}
                    name='email'
                    type='email'
                    placeholder='이메일'
                    errors={errors}
                />
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
                <InputField
                    register={register}
                    name='name'
                    type='text'
                    placeholder='이름'
                    errors={errors}
                />

                <button
                    disabled={isSubmitting}
                    type='button'
                    onClick={handleSubmit(onSubmit)}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                >
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default SignupPage;
