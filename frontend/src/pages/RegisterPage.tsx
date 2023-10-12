import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Group,
  Button,
  TextInput,
  Textarea,
  PasswordInput,
  Alert,
} from '@mantine/core';
import { useForm, isEmail, matches } from '@mantine/form';
import { AxiosError } from 'axios';
import { register, RegisterInput } from '../api/api';
import usePromise from '../hooks/usePromise';

function RegisterPage() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<RegisterInput>({
    validate: {
      email: isEmail('invalid email'),
      password: matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    },
  });

  const registerPromise = usePromise({
    promiseFn: register,

    onSuccess() {
      navigate('/login');
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  return (
    <>
      <Box maw={340} mx='auto'>
        {registerPromise.isError && (
          <Alert variant='light' color='red' title='Register Failed!'>
            {errorMessage}
          </Alert>
        )}{' '}
        <form onSubmit={form.onSubmit(registerPromise.call)}>
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
          <TextInput
            label='Name'
            placeholder='Display name'
            {...form.getInputProps('name')}
          />
          <Textarea
            label='Bio'
            placeholder='A short summery about yourself'
            {...form.getInputProps('bio')}
          />
          <Group justify='flex-end' mt='md'>
            <Button type='submit' loading={registerPromise.isLoading}>
              Register
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}

export default RegisterPage;
