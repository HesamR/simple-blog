import { useSearchParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import usePromise from '../hooks/usePromise';
import { verifyEmail } from '../api/api';
import { useEffect, useState } from 'react';
import LoadFallback from '../components/LoadFallback';

function VerifyEmailPage() {
  const [errorMessage, setErrorMessage] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verifyEmailPromise = usePromise({
    promiseFn: verifyEmail,
    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    token ? verifyEmailPromise.call({ token }) : navigate('/');
  }, []);

  return (
    <>
      {verifyEmailPromise.isLoading && <LoadFallback />}
      {verifyEmailPromise.isError && <p>{errorMessage}</p>}
      {verifyEmailPromise.isSuccess && (
        <p>Email verified! you can close this page.</p>
      )}
    </>
  );
}

export default VerifyEmailPage;
