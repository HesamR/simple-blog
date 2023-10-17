import { useState } from 'react';
import {
  Box,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Alert,
} from '@mantine/core';
import { useForm, isNotEmpty, isEmail } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import usePromise from '../hooks/usePromise';
import { LoginInput, login } from '../api/api';

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<LoginInput>({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('password can not be empty'),
    },
  });

  const loginPromise = usePromise({
    promiseFn: login,

    onSuccess() {
      navigate('/');
      navigate(0);
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  return (
    <Box maw={340} mx='auto'>
      {loginPromise.isError && (
        <Alert variant='light' color='red' title='Login Failed!'>
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(loginPromise.call)}>
        <TextInput
          withAsterisk
          label='Email'
          placeholder='your@email.com'
          {...form.getInputProps('email')}
        />
        <PasswordInput
          withAsterisk
          label='Password'
          placeholder='Password'
          {...form.getInputProps('password')}
        />
        <Group justify='flex-end' mt='md'>
          <Link to='/forget-password'>Forget password?</Link>
          <Button loading={loginPromise.isLoading} type='submit'>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default LoginPage;
