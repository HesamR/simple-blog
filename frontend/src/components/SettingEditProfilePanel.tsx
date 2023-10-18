import { Alert, Box, Button, Group, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy, IconExclamationCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';

import { EditProfileInput, editProfile } from '../api/api';
import AuthContext from '../context/AuthContext';

function SettingEditProfilePanel() {
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
        <Group justify='end'>
          <Button
            mt='sm'
            variant='outline'
            color='green'
            type='submit'
            leftSection={<IconDeviceFloppy />}
            loading={isPending}
          >
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default SettingEditProfilePanel;
