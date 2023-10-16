import {
  Box,
  Button,
  TextInput,
  Textarea,
  Group,
  Fieldset,
  Alert,
} from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import usePromise from '../hooks/usePromise';
import { editArticle, getCurrentUserArticle } from '../api/api';
import ArticleEditor from '../components/ArticleEditor';

interface FormValue {
  title: string;
  summery: string;
}

function EditArticlePage() {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const [params] = useSearchParams();
  const articleId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;

  if (articleId < 0) {
    navigate('/');
  }

  const form = useForm<FormValue>({
    validate: {
      title: isNotEmpty('this is required'),
      summery: isNotEmpty('this is required'),
    },
  });

  const editArticlePromise = usePromise({
    promiseFn: editArticle,
    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setError(message ? message : error.message);
    },
  });

  const getArticlePromise = usePromise({
    promiseFn: getCurrentUserArticle,
    onError() {
      navigate('/');
    },
    onSuccess(out) {
      form.setFieldValue('title', out.title);
      form.setFieldValue('summery', out.summery);
      setContent(out.content);
    },
  });

  useEffect(() => {
    getArticlePromise.call(articleId);
  }, []);

  const handleForm = ({ title, summery }: FormValue) => {
    const oldArtile = getArticlePromise.output ?? {
      title: '',
      summery: '',
      content: '',
    };

    editArticlePromise.call({
      articleId,
      title: title !== oldArtile.title ? title : undefined,
      summery: summery !== oldArtile.summery ? summery : undefined,
      content: content !== oldArtile.content ? content : undefined,
    });
  };

  return (
    <Group wrap='wrap' gap='md' justify='center' align='flex-start' grow>
      <Box miw={400} maw={400}>
        <Fieldset>
          {editArticlePromise.isError && (
            <Alert
              color='red'
              title='Create Article Failed'
              icon={<IconExclamationCircle />}
            >
              {error}
            </Alert>
          )}
          {editArticlePromise.isSuccess && (
            <Alert color='green' title='article updated' icon={<IconCheck />}>
              your edits have been saved!
            </Alert>
          )}
          <form onSubmit={form.onSubmit(handleForm)}>
            <TextInput label='Title' {...form.getInputProps('title')} />
            <Textarea label='Summery' {...form.getInputProps('summery')} />
            <Button
              mt='sm'
              type='submit'
              loading={editArticlePromise.isLoading}
            >
              Edit
            </Button>
          </form>
        </Fieldset>
      </Box>
      {getArticlePromise.isLoading && <p>Loading..</p>}
      {getArticlePromise.isSuccess && (
        <ArticleEditor
          content={getArticlePromise.output?.content}
          onUpdate={({ editor }) => setContent(editor.getHTML())}
        />
      )}
    </Group>
  );
}

export default EditArticlePage;
