import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/auth';
import { useAuth } from '../../useAuth';
import type { UserProfileDto } from '../../types/auth';

export const useMyInfoQuery = () => {
  const { token } = useAuth();

  return useQuery<UserProfileDto>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await getMyInfo();
      return response.data;
    },
    enabled: Boolean(token),
    retry: 1,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
