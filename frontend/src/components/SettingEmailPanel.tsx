import {
  Alert,
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import {
  IconCheck,
  IconExclamationCircle,
  IconPencil,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

import {
  ChangeEmailInput,
  changeEmail,
  isEmailVerified,
  sendVerifyEmail,
} from '../api/api';
import LoadFallback from '../components/LoadFallback';

const EmailVerification = () => {
  const verified = useQuery({
    queryKey: ['current-user', 'is-email-verified'],
    queryFn: isEmailVerified,
  });

  const send = useMutation({
    mutationFn: sendVerifyEmail,
  });

  if (verified.isPending) {
    return <LoadFallback />;
  }

  return (
    <Box mt='lg'>
      <Text size='sm' c='dimmed' fw={500}>
        Email Verification
      </Text>
      <Divider />
      {verified.isError && (
        <Alert
          my='md'
          color='red'
          title='internal error'
          icon={<IconExclamationCircle />}
        >
          failed to get the state of email verification.
        </Alert>
      )}

      {verified.isSuccess && verified.data && (
        <Alert
          my='md'
          title='Email is verified'
          icon={<IconCheck />}
          color='green'
        >
          You can do actions that requires sending email
        </Alert>
      )}

      {verified.isSuccess && !verified.data && (
        <>
          <Alert
            mb='sm'
            title='Email is not verified'
            icon={<IconExclamationCircle />}
            color='red'
          >
            click on button below to send verification email then check your
            email to complete the process
          </Alert>
          <Button onClick={() => send.mutate()} loading={send.isPending}>
            Send verification email
          </Button>
        </>
      )}
    </Box>
  );
};

const ChangeEmail = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const form = useForm<ChangeEmailInput>({
    validate: {
      email: isEmail('Invalid email'),
    },
  });

  const { isError, isSuccess, isPending, mutate } = useMutation({
    mutationFn: changeEmail,

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setError(message ? message : error.message);
    },
  });

  return (
    <Box>
      <Text size='sm' fw={500} c='dimmed'>
        Change Email
      </Text>
      <Divider mb='sm' />
      {isError && (
        <Alert
          title='Changing email failed'
          color='red'
          icon={<IconExclamationCircle />}
        >
          {error}
        </Alert>
      )}
      {isSuccess && (
        <Alert title='email changed' color='green' icon={<IconCheck />}>
          make sure to verify email.
        </Alert>
      )}
      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <TextInput
          label='New Email'
          placeholder='you@email.com'
          {...form.getInputProps('email')}
        />
        <Group justify='end'>
          <Button
            mt='sm'
            type='submit'
            variant='outline'
            color='green'
            leftSection={<IconPencil />}
            loading={isPending}
          >
            Change
          </Button>
        </Group>
      </form>
    </Box>
  );
};

function SettingEmailPanel() {
  return (
    <Stack>
      <EmailVerification />
      <ChangeEmail />
    </Stack>
  );
}

export default SettingEmailPanel;
