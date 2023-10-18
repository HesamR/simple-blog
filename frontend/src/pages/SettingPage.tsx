import {
  Tabs,
  Box,
  Button,
  Alert,
  Fieldset,
  TextInput,
  PasswordInput,
  Textarea,
} from '@mantine/core';
import {
  IconCheck,
  IconExclamationCircle,
  IconKey,
  IconMail,
  IconUserCircle,
} from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  EditProfileInput,
  changeEmail,
  changePassword,
  editProfile,
  isEmailVerified,
  sendVerifyEmail,
} from '../api/api';
import { isEmail, isNotEmpty, matches, useForm } from '@mantine/form';
import AuthContext from '../context/AuthContext';
import LoadFallback from '../components/LoadFallback';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function SettingPage() {
  return (
    <Box maw={500} mx='auto'>
      <Tabs defaultValue='email'>
        <Tabs.List>
          <Tabs.Tab value='email' leftSection={<IconMail />}>
            Email
          </Tabs.Tab>
          <Tabs.Tab value='password' leftSection={<IconKey />}>
            Change Password
          </Tabs.Tab>
          <Tabs.Tab value='profile' leftSection={<IconUserCircle />}>
            Edit Profile
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='email'>
          <EmailPanel />
        </Tabs.Panel>
        <Tabs.Panel value='password'>
          <ChangePasswordPanel />
        </Tabs.Panel>
        <Tabs.Panel value='profile'>
          <EditProfilePanel />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

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
    <Fieldset mt='md' legend='Email Verification'>
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
    </Fieldset>
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
    <Fieldset mt='sm' legend='Change Email'>
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
          label='Email'
          description='Write your new email here'
          placeholder='you@email.com'
          {...form.getInputProps('email')}
        />
        <Button mt='sm' type='submit' loading={isPending}>
          Change Email
        </Button>
      </form>
    </Fieldset>
  );
};

const EmailPanel = () => {
  return (
    <>
      <EmailVerification />
      <ChangeEmail />
    </>
  );
};

const ChangePasswordPanel = () => {
  const [error, setError] = useState('');
  const form = useForm<ChangePasswordInput>({
    validate: {
      oldPassword: isNotEmpty('required field'),
      newPassword: matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    },
  });

  const { isError, isSuccess, isPending, mutate } = useMutation({
    mutationFn: changePassword,

    onError(err: AxiosError<any>) {
      const message = err.response?.data?.message;
      setError(message ? message : err.message);
    },
  });

  return (
    <Box maw={400} mx='auto' mt='sm'>
      {isError && (
        <Alert
          color='red'
          title='Changing password failed'
          icon={<IconExclamationCircle />}
        >
          {error}
        </Alert>
      )}
      {isSuccess && (
        <Alert
          color='green'
          title='Password changed successfuly'
          icon={<IconCheck />}
        >
          you have to login with new password now
        </Alert>
      )}

      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <PasswordInput
          placeholder='old password'
          label='Old Password'
          {...form.getInputProps('oldPassword')}
        />
        <PasswordInput
          placeholder='new password'
          label='New Password'
          {...form.getInputProps('newPassword')}
        />
        <Button mt='sm' type='submit' loading={isPending}>
          Change Password
        </Button>
      </form>
    </Box>
  );
};

const EditProfilePanel = () => {
  const queryClient = useQueryClient();

  const auth = useContext(AuthContext);
  const [error, setError] = useState('');

  const form = useForm<EditProfileInput>({
    initialValues: {
      name: auth.user?.name ?? '',
      bio: auth.user?.bio ?? '',
    },
  });

  const { isError, isPending, mutate } = useMutation({
    mutationFn: editProfile,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'get-current-user'],
      });
    },

    onError(err: AxiosError<any>) {
      const message = err.response?.data?.message;
      setError(message ? message : err.message);
    },
  });

  return (
    <Box maw={400} mx='auto' mt='sm'>
      {isError && (
        <Alert
          color='red'
          title='Profie changing failed'
          icon={<IconExclamationCircle />}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <TextInput
          label='Name'
          placeholder='Your display name'
          {...form.getInputProps('name')}
        />
        <Textarea
          label='Bio'
          placeholder='A summery about your self'
          {...form.getInputProps('bio')}
        />
        <Button mt='sm' type='submit' loading={isPending}>
          Save
        </Button>
      </form>
    </Box>
  );
};

export default SettingPage;
