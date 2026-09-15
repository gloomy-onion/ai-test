import { queryOptions } from '@tanstack/react-query';
import { settingsApi } from '../requests/settings';
import { SETTINGS_QUERY_KEY } from './keys';

export const settingsOptions = () =>
  queryOptions({
    queryKey: [SETTINGS_QUERY_KEY],
    queryFn: settingsApi.get,
    staleTime: Infinity,
  });