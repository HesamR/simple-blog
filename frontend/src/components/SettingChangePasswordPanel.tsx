import { Alert, Box, Button, Group, PasswordInput } from '@mantine/core';
import { isNotEmpty, matches, useForm } from '@mantine/form';
import {
  IconCheck,
  IconExclamationCircle,
  IconPencil,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { ChangePasswordInput, changePassword } from '../api/api';

const SettingChangePasswordPanel = () => {
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
        <Group justify='end'>
          <Button
            mt='sm'
            type='submit'
            color='green'
            variant='outline'
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

export default SettingChangePasswordPanel;
