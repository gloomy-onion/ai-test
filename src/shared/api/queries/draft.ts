import { queryOptions } from '@tanstack/react-query';
import { draftApi } from '../requests/draft';
import { draftQueryKey } from './keys';

export const draftOptions = (taskId: number) =>
  queryOptions({
    queryKey: draftQueryKey(taskId),
    queryFn: () => draftApi.get(taskId),
    enabled: Number.isInteger(taskId) && taskId > 0,
  });