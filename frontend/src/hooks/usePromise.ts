import { useState } from 'react';

export interface PromiseOptions<InT, OutT, ErrT> {
  promiseFn: (input?: InT) => Promise<OutT>;
  onSuccess?: (out: OutT) => void;
  onError?: (err: ErrT) => void;
  onSettled?: () => void;
}

export interface PromiseState<InT, OutT, ErrT> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  output?: OutT;
  error?: ErrT;
  call: (input?: InT) => Promise<void>;
}

function usePromise<InT, OutT, ErrT>(
  options: PromiseOptions<InT, OutT, ErrT>,
): PromiseState<InT, OutT, ErrT> {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [output, setOutput] = useState<OutT | undefined>();
  const [error, setError] = useState<ErrT | undefined>();

  const call = async (input?: InT) => {
    setIsLoading(true);

    setIsSuccess(false);
    setIsError(false);

    setOutput(undefined);
    setError(undefined);

    try {
      const out = await options.promiseFn(input);

      setIsSuccess(true);
      setOutput(out);

      if (options.onSuccess) {
        options.onSuccess(out);
      }
    } catch (err) {
      setIsError(true);
      setError(err as ErrT);

      if (options.onError) {
        options.onError(err as ErrT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    isError,
    output,
    error,
    call,
  };
}

export default usePromise;
