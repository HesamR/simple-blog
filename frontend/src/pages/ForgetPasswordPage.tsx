import { useState } from 'react';
import { AxiosError } from 'axios';
import { ForgetPasswordInput, forgetPassword } from '../api/api';
import { isEmail, useForm } from '@mantine/form';
import { Alert, Box, Button, Group, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';

function ForgetPasswordPage() {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<ForgetPasswordInput>({
    validate: {
      email: isEmail('Invalid email'),
    },
  });

  const { isError, isSuccess, isPending, mutate } = useMutation({
    mutationFn: forgetPassword,

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
          title='Password retrival requeset failed'
        >
          {errorMessage}
        </Alert>
      )}
      {isSuccess && (
        <Alert
          variant='light'
          color='green'
          title='Password retrival requeset succeed'
        >
          check your email to complete the proccess
        </Alert>
      )}
      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <TextInput
          withAsterisk
          label='Email'
          placeholder='your@email.com'
          {...form.getInputProps('email')}
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

export default ForgetPasswordPage;
