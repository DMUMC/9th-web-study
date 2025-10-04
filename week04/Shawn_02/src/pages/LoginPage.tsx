import googleLogo from '../assets/Google__G__logo.svg'
import { useNavigate } from 'react-router'
import { postLogin } from '../apis/auth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '../constant/key'
import z from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    email: z.string().email({message: '이메일 형식이 올바르지 않습니다.'}),
    password: z.string().min(6, {message: '비밀번호는 6자 이상이어야 합니다.'}).max(20, {message: '비밀번호는 20자 이하이어야 합니다.'})
})

type Formfields = z.infer<typeof schema>

const LoginPage = () => {
    const navigate = useNavigate()
    const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

    const {register, handleSubmit, formState: {errors}, watch}= useForm<Formfields>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(schema),
        mode: 'onBlur'
    })

    const onSubmit:SubmitHandler<Formfields> = async(data) => {
        try{
            await postLogin(data).then((res) =>{
               setItem(res.data.accessToken)
                console.log(res)
            })
        } catch(e) {
            console.log(e)
            alert('로그인에 실패했습니다.')
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const isDisabled = () => {
        const watchedValues = watch()
        return (
            !watchedValues.email ||
            !!errors.email ||
            !watchedValues.password ||
            !!errors.password
        )
    }

    return (
        <div className='flex flex-col gap-4 w-80'>
            <div className='flex justify-between items-center'>
                <button className='text-white w-10' onClick={handleGoBack}>{'<'}</button>
                <p className='text-2xl font-bold text-center'>로그인</p>
                <div className='w-10'></div>
            </div>

            <div className='flex px-4 py-3 border-1 border-gray-300 rounded-md items-center relative hover:cursor-pointer'>
                <img src={googleLogo} alt="googleLogo" />
                <p className='absolute left-1/2 transform -translate-x-1/2'>구글 로그인</p>
            </div>

            <div className='relative text-center my-4'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                    <span className='bg-neutral-900 px-2 w-24'>OR</span>
                </div>
            </div>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder='이메일을 입력해주세요'
                    className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                    {...register('email')}
                />
                {errors?.email && <p className='text-red-500'>{errors.email.message}</p>}
                <input
                    type="password"
                    placeholder='비밀번호를 입력해주세요'
                    className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                    {...register('password')}
                />
                {errors?.password && <p className='text-red-500'>{errors.password.message}</p>}
                <button
                    className='bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed'
                    disabled={isDisabled()}
                    type='submit'
                >
                    로그인
                </button>
            </form>

        </div>
    )
}

export default LoginPage