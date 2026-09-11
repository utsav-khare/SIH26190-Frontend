import { useCallback, useEffect, useRef } from 'react';
import { useApi } from './useApi';

/**
 * Step 11 — reusable "load on mount" data hook built on top of useApi.
 *
 * Encapsulates the consistent API state pattern used across all pages:
 *   loading  -> `loading`  (render <LoadingState />)
 *   error    -> `error`    (render <ErrorState onRetry={reload} />)
 *   empty    -> `data` null/empty (render <EmptyState />)
 *
 * The fetcher is stored in a ref, so inline arrows are safe and the
 * effect only re-runs when `deps` change (defaults to once on mount).
 *
 * @param {() => Promise<any>} fetcher  async function returning the data
 * @param {Array} [deps]               effect dependencies (e.g. [caseId])
 * @returns {{ data: any, loading: boolean, error: string|null, reload: () => void }}
 *
 * @example
 * const { data: cases, loading, error, reload } = useApiData(() => caseService.getCases());
 */
export const useApiData = (fetcher, deps = []) => {
  const { data, loading, error, execute, reset } = useApi();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(() => {
    // execute() re-throws on failure; the error is captured in `error` state.
    // Swallow here so callers/effects don't produce unhandled rejections.
    return execute(() => fetcherRef.current()).catch(() => {});
  }, [execute]);

  useEffect(() => {
    reload();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload };
};
