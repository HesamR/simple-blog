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
import { useEffect, useState } from 'react';
import usePromise from '../hooks/usePromise';
import { isEmailVerified } from '../api/api';

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
  const ievPromise = usePromise({
    promiseFn: isEmailVerified,
  });

  useEffect(() => {
    ievPromise.call();
  }, []);

  if (ievPromise.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Fieldset mt='md' legend='Email Verification'>
      {ievPromise.isError && (
        <Alert
          my='md'
          color='red'
          title='internal error'
          icon={<IconExclamationCircle />}
        >
          failed to get the state of email verification.
        </Alert>
      )}

      {ievPromise.isSuccess && ievPromise.output && (
        <Alert
          my='md'
          title='Email is verified'
          icon={<IconCheck />}
          color='green'
        >
          You can do actions that requires sending email
        </Alert>
      )}

      {ievPromise.isSuccess && !ievPromise.output && (
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
          <Button>Send verification email</Button>
        </>
      )}
    </Fieldset>
  );
};

const ChangeEmail = () => {
  return (
    <Fieldset mt='sm' legend='Change Email'>
      <form>
        <TextInput
          label='Email'
          description='Write your new email here'
          placeholder='you@email.com'
        />
        <Button mt='sm' type='submit'>
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
  return (
    <Box maw={400} mx='auto' mt='sm'>
      <form>
        <PasswordInput placeholder='old password' label='Old Password' />
        <PasswordInput placeholder='new password' label='New Password' />
        <Button mt='sm' type='submit'>
          Change Password
        </Button>
      </form>
    </Box>
  );
};
const EditProfilePanel = () => {
  return (
    <Box maw={400} mx='auto' mt='sm'>
      <form>
        <TextInput label='Name' placeholder='Your display name' />
        <Textarea label='Bio' placeholder='A summery about your self' />
        <Button mt='sm' type='submit'>
          Save
        </Button>
      </form>
    </Box>
  );
};

export default SettingPage;
