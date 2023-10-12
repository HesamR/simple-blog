import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Group, PasswordInput } from '@mantine/core';
import { AxiosError } from 'axios';
import { forgetPasswordComplete } from '../api/api';
import { useForm, matches } from '@mantine/form';
import usePromise from '../hooks/usePromise';

interface FormValue {
  newPassword: string;
}

function ForgetPasswordCompletePage() {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<FormValue>({
    validate: {
      newPassword: matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    },
  });

  const fpcPromise = usePromise({
    promiseFn: forgetPasswordComplete,

    onSuccess() {
      navigate('/login');
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  const handleSubmit = ({ newPassword }: FormValue) => {
    const token = searchParam.get('token');
    token ? fpcPromise.call({ token, newPassword }) : navigate('/');
  };

  return (
    <Box maw={340} mx='auto'>
      {fpcPromise.isError && (
        <Alert
          variant='light'
          color='red'
          title='Could not complete password change'
        >
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          withAsterisk
          label='New Password'
          placeholder='Password'
          {...form.getInputProps('newPassword')}
        />
        <Group justify='flex-end' mt='md'>
          <Button loading={fpcPromise.isLoading} type='submit'>
            Send Request
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default ForgetPasswordCompletePage;
