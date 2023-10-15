import {
  Box,
  Button,
  TextInput,
  Textarea,
  Group,
  Fieldset,
  Alert,
} from '@mantine/core';
import { AxiosError } from 'axios';
import usePromise from '../hooks/usePromise';
import { createArticle } from '../api/api';
import { isNotEmpty, useForm } from '@mantine/form';
import { useState } from 'react';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import ArticleEditor from '../components/ArticleEditor';

interface FormValue {
  title: string;
  summery: string;
}

function CreateArticlePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const form = useForm<FormValue>({
    validate: {
      title: isNotEmpty('this is required'),
      summery: isNotEmpty('this is required'),
    },
  });

  const createArticlePromise = usePromise({
    promiseFn: createArticle,
    onSuccess({ id }) {
      navigate(`/edit-article/${id}`);
    },
    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setError(message ? message : error.message);
    },
  });

  const handleForm = ({ title, summery }: FormValue) => {
    createArticlePromise.call({
      title,
      summery,
      content,
    });
  };

  return (
    <Group wrap='wrap' gap='md' justify='center' align='flex-start' grow>
      <Box miw={400} maw={400}>
        {createArticlePromise.isError && (
          <Alert
            color='red'
            title='Create Article Failed'
            icon={<IconExclamationCircle />}
          >
            {error}
          </Alert>
        )}
        <Fieldset>
          <form onSubmit={form.onSubmit(handleForm)}>
            <TextInput label='Title' {...form.getInputProps('title')} />
            <Textarea label='Summery' {...form.getInputProps('summery')} />
            <Button
              mt='sm'
              type='submit'
              loading={createArticlePromise.isLoading}
            >
              Create
            </Button>
          </form>
        </Fieldset>
      </Box>
      <ArticleEditor onUpdate={({ editor }) => setContent(editor.getHTML())} />
    </Group>
  );
}

export default CreateArticlePage;
