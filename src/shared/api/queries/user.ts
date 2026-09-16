import { queryOptions } from '@tanstack/react-query';
import { userApi } from '../requests/user';
import { USER_QUERY_KEY } from './keys';

export const userOptions = () =>
  queryOptions({
    queryKey: [USER_QUERY_KEY],
    queryFn: userApi.get,
    staleTime: Infinity,
  });