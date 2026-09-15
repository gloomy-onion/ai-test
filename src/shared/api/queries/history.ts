import { queryOptions } from '@tanstack/react-query';
import { historyApi } from '../requests/history';
import { HISTORY_QUERY_KEY } from './keys';

export const historyOptions = () =>
  queryOptions({
    queryKey: [HISTORY_QUERY_KEY],
    queryFn: historyApi.get,
    staleTime: Infinity,
  });