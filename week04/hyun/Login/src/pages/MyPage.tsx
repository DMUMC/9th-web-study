import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';

const MyPage = () => {
    const [data, setData] = useState([]);
    console.log(getMyInfo());
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            // setData(response.data);
        };

        getData();
    }, []);

    return <div>{}왜 안되는건데</div>;
};

export default MyPage;
