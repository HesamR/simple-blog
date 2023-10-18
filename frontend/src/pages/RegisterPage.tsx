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
  Card,
  Text,
  Divider,
} from '@mantine/core';
import { useForm, isEmail, matches, isNotEmpty } from '@mantine/form';
import { AxiosError } from 'axios';
import { register, RegisterInput } from '../api/api';
import { useMutation } from '@tanstack/react-query';

function RegisterPage() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<RegisterInput>({
    validate: {
      name: isNotEmpty('it is required'),
      email: isEmail('invalid email'),
      password: matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    },
  });

  const { isError, isPending, mutate } = useMutation({
    mutationFn: register,

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
      <Card shadow='lg' radius='lg'>
        <Group justify='center' mb='sm'>
          <Text size='lg' fw={700} c='dimmed'>
            Register
          </Text>
        </Group>
        <Divider mb='sm' />
        {isError && (
          <Alert variant='light' color='red' title='Register Failed!'>
            {errorMessage}
          </Alert>
        )}{' '}
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
          <TextInput
            withAsterisk
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
            <Button type='submit' loading={isPending}>
              Register
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

export default RegisterPage;
