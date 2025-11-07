import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>([]);
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            setData(response);
        };

        getData();
    }, []);
    const handdleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div>
            <h1>{data.data?.name}님 안녕하세요!</h1>
            <img src={data.data?.avatar as string} alt={'구글로고'} />
            <h1>{data.data?.email}</h1>
            <button
                className="cursor-pointer bg-blue-300 rounded-md p-2 mt-4"
                onClick={handdleLogout}
            >
                로그아웃
            </button>
        </div>
    );
};

export default MyPage;
