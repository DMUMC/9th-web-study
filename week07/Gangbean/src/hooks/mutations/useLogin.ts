import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import type { RequestSigninDto } from '../../types/auth';
import { postSignin } from '../../apis/auth';

function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestSigninDto) =>
            postSignin(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.login],
            });
        },
    });
}

export default useLogin;
