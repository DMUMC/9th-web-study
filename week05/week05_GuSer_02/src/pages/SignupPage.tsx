import { useNavigate } from "react-router-dom";
import z from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSignup } from "../apis/auth"
import { useState } from "react"
import mail from "../assets/mail.svg"
import eye from "../assets/eye.svg"
import eyeoff from "../assets/eye-off.svg"
import profile from "../assets/profile.svg"

const schema = z.object({
    email: z.string().email({message: '이메일 형식이 올바르지 않습니다.'}),
    password: z.string().min(6, {message: '비밀번호는 6자 이상이어야 합니다.'}).max(20, {message: '비밀번호는 20자 이하이어야 합니다.'}),
    passwordCheck: z.string().min(6, {message: '비밀번호는 6자 이상이어야 합니다.'}).max(20, {message: '비밀번호는 20자 이하이어야 합니다.'}),
    name: z.string().min(1, {message: '이름을 입력해주세요.'})
}).refine((data) => data.password === data.passwordCheck, {message: '비밀번호가 일치하지 않습니다.', path: ['passwordCheck']} )

type Formfields = z.infer<typeof schema>

const SignupPage = () => {
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}, watch, getValues}= useForm<Formfields>({
        defaultValues: {
            email: '',
            password: '',
            passwordCheck: '',
            name: '',
        },
        resolver: zodResolver(schema),
        mode: 'onBlur'
    })
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [showPass, setShowPass] = useState<boolean>(false)
    const [showPassCheck, setShowPassCheck] = useState<boolean>(false)

    const onSubmit:SubmitHandler<Formfields> = async(data) => {
        const {passwordCheck, ...rest} = data

        try{
            await postSignup(rest).then((res) =>{
                console.log(res)
            })
            navigate('/')
        } catch(e) {
            console.log(e)
            alert('회원가입에 실패했습니다.')
        }
    }

    // 현재 단계가 1이면 뒤로가기, 아니면 이전 단계로 이동
    const handleGoBack = () => {
        if(currentStep === 1) {
            navigate(-1)
        } else {
            setCurrentStep(currentStep - 1)
        }
    }

    const isStepValid = () => {
        // 현재 입력값을 실시간으로 감시
        const watchedValues = watch()

        // 해당 단계에서 입력값이 없거나 에러 발생시 true 반환(버튼 비활성화)
        switch(currentStep) {
            case 1:
                return !watchedValues.email || errors.email ? true : false
            case 2:
                return !watchedValues.password || !watchedValues.passwordCheck ||
                       errors.password || errors.passwordCheck ? true : false
            case 3:
                return !watchedValues.name || errors.name ? true : false
        }
    }

    // 단계별로 렌더링 할 입력 폼 반환
    const step = (step: number) => {
        switch(step) {
            case 1:
                return <div>
                    <input
                    type="email"
                    placeholder='이메일을 입력해주세요'
                    className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                    {...register('email')}
                />
                {errors?.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
            case 2:
                return <div className='flex flex-col gap-6'>
                    {/* 이전 단계에 입력한 이메일 표시 */}
                    <div className='flex items-center gap-2'>
                        <img src={mail} alt="mailIcon" />
                        <p>{getValues('email')}</p>
                    </div>
                    <div>
                        <div className='w-full rounded-md border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500 flex items-center justify-between px-4'>
                            <input
                            type={showPass ? "text" : "password"}
                            placeholder='비밀번호를 입력해주세요'
                            className='w-full py-2 focus:outline-none'
                            {...register('password')}
                            />
                            <img src={showPass ? eye : eyeoff} alt="eye" onClick={() => setShowPass(!showPass)} />
                        </div>
                    {errors?.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div>
                        <div className='w-full rounded-md border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500 flex items-center justify-between px-4'>
                            <input
                                type={showPassCheck ? "text" : "password"}
                                placeholder='비밀번호를 확인해주세요'
                                className='w-full py-2 focus:outline-none'
                                {...register('passwordCheck')}
                            />
                            <img src={showPassCheck ? eye : eyeoff} alt="eye" onClick={() => setShowPassCheck(!showPassCheck)} />
                        </div>
                        {errors?.passwordCheck && <p className='text-red-500'>{errors.passwordCheck.message}</p>}
                    </div>
                </div>
            case 3:
                return <div className='flex flex-col gap-4 items-center'>
                    <img src={profile} alt="profile" className='w-24 h-24 rounded-full' />
                    <input
                    type="text"
                    placeholder='이름을 입력해주세요'
                    className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                    {...register('name')}
                />
                {errors?.name && <p className='text-red-500'>{errors.name.message}</p>}
                </div>
        }
    }

    return (
        <div className='flex flex-col gap-4 w-80'>
            <div className='flex justify-between items-center'>
                <button className='text-white w-10' onClick={handleGoBack}>{'<'}</button>
                <p className='text-2xl font-bold text-center'>회원가입</p>
                <div className='w-10'></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

                {/* 현재 단계에 맞는 입력 폼 렌더링 */}
                {step(currentStep)}

                {currentStep < 3 ? (
                    <button
                        type="button"
                        className='bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed'
                        disabled={isStepValid()}
                        onClick={() => setCurrentStep(currentStep + 1)}
                    >
                        다음
                    </button>
                ) : (
                    <button
                        type="submit"
                        className='bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed'
                        disabled={isStepValid()}
                    >
                        회원가입
                    </button>
                )}
            </form>


        </div>
    )
}

export default SignupPage