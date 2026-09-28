import { queryOptions } from '@tanstack/react-query';
import { communityApi } from '../requests/community';
import { COMMUNITY_QUERY_KEY } from './keys';

export const communityOptions = () =>
  queryOptions({
    queryKey: [COMMUNITY_QUERY_KEY],
    queryFn: communityApi.get,
    staleTime: 60_000,
  });