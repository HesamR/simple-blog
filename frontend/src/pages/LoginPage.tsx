import { useState, useContext } from 'react';
import {
  Box,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Alert,
} from '@mantine/core';
import { useForm, isNotEmpty, isEmail } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import AuthContext from '../context/AuthContext';
import usePromise from '../hooks/usePromise';
import { LoginInput, LoginOutput, login } from '../api/api';

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useContext(AuthContext);

  const form = useForm<LoginInput>({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('password can not be empty'),
    },
  });

  const loginPromise = usePromise({
    promiseFn: login,

    onSuccess(output: LoginOutput) {
      auth.setState(output);
      navigate('/');
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
          <a href='/forget-password'>Forget password?</a>
          <Button loading={loginPromise.isLoading} type='submit'>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default LoginPage;
