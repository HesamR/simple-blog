import { useSearchParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { verifyEmail } from '../api/api';
import { useEffect, useState } from 'react';
import LoadFallback from '../components/LoadFallback';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Center } from '@mantine/core';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  const [errorMessage, setErrorMessage] = useState('');

  const token = params.get('token') ?? '';

  if (token === '') {
    navigate('/');
  }

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: verifyEmail,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'is-email-verified'],
      });
    },
    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  useEffect(() => {
    mutate({ token });
  }, []);

  return (
    <Center>
      <Card radius='lg'>
        {isPending && <LoadFallback />}
        {isError && <p>{errorMessage}</p>}
        {isSuccess && <p>Email verified! you can close this page.</p>}
      </Card>
    </Center>
  );
}

export default VerifyEmailPage;
