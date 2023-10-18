import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Alert,
  Card,
  Text,
  Divider,
} from '@mantine/core';
import { useForm, isNotEmpty, isEmail } from '@mantine/form';
import { AxiosError } from 'axios';

import { LoginInput, login } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<LoginInput>({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('password can not be empty'),
    },
  });

  const { mutate, isError, isPending } = useMutation({
    mutationFn: login,

    onSuccess() {
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setErrorMessage(message ? message : error.message);
    },
  });

  return (
    <Box maw={340} mx='auto'>
      <Card shadow='lg' radius='lg'>
        <Group justify='center' mb='sm'>
          <Text size='lg' fw={700} c='dimmed'>
            Login
          </Text>
        </Group>
        <Divider mb='sm' />
        {isError && (
          <Alert variant='light' color='red' title='Login Failed!'>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={form.onSubmit((values) => mutate(values))}>
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
            <Button loading={isPending} type='submit'>
              Login
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

export default LoginPage;
