import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Group, PasswordInput } from '@mantine/core';
import { AxiosError } from 'axios';

import { forgetPasswordComplete } from '../api/api';
import { useForm, matches } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';

interface FormValue {
  newPassword: string;
}

function ForgetPasswordCompletePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<FormValue>({
    validate: {
      newPassword: matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    },
  });

  const token = params.get('token') ?? '';

  if (token === '') {
    navigate('/');
  }

  const { isError, isPending, mutate } = useMutation({
    mutationFn: forgetPasswordComplete,

    onSuccess() {
      navigate('/login');
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  return (
    <Box maw={340} mx='auto'>
      {isError && (
        <Alert
          variant='light'
          color='red'
          title='Could not complete password change'
        >
          {errorMessage}
        </Alert>
      )}
      <form
        onSubmit={form.onSubmit(({ newPassword }) =>
          mutate({ token, newPassword }),
        )}
      >
        <PasswordInput
          withAsterisk
          label='New Password'
          placeholder='Password'
          {...form.getInputProps('newPassword')}
        />
        <Group justify='flex-end' mt='md'>
          <Button loading={isPending} type='submit'>
            Send Request
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default ForgetPasswordCompletePage;
