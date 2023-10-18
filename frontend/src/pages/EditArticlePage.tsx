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
import { useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { editArticle, getMyArticleById } from '../api/api';
import ArticleEditor from '../components/ArticleEditor';
import LoadFallback from '../components/LoadFallback';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../context/AuthContext';

interface FormValue {
  title: string;
  summery: string;
}

function EditArticlePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  const auth = useContext(AuthContext);

  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const articleId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;
  if (articleId < 0) {
    navigate('/');
  }

  const userId = auth.user?.id ?? -1;
  if (userId < 0) {
    navigate('/');
  }

  const form = useForm<FormValue>({
    validate: {
      title: isNotEmpty('this is required'),
      summery: isNotEmpty('this is required'),
    },
  });

  const edit = useMutation({
    mutationFn: editArticle,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'get-my-article-by-id', articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'get-my-articles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-user-articles', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-article-by-id', articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-all-articles'],
      });
    },

    onError(error: AxiosError<any>) {
      const message = error.response?.data?.message;
      setError(message ? message : error.message);
    },
  });

  const article = useQuery({
    queryKey: ['current-user', 'get-my-article-by-id', articleId],
    queryFn: () => getMyArticleById(articleId),
    throwOnError: true,
  });

  const handleForm = ({ title, summery }: FormValue) => {
    if (article.isSuccess) {
      const old = article.data;

      edit.mutate({
        articleId,
        title: title !== old.title ? title : undefined,
        summery: summery !== old.summery ? summery : undefined,
        content: content !== old.content ? content : undefined,
      });
    }
  };

  useEffect(() => {
    if (article.isSuccess) {
      form.setFieldValue('title', article.data.title);
      form.setFieldValue('summery', article.data.summery);
      setContent(article.data.content);
    }
  }, [article.isSuccess]);

  return (
    <Group wrap='wrap' gap='md' justify='center' align='flex-start' grow>
      <Box miw={400} maw={400}>
        <Fieldset>
          {edit.isError && (
            <Alert
              color='red'
              title='Create Article Failed'
              icon={<IconExclamationCircle />}
            >
              {error}
            </Alert>
          )}
          {edit.isSuccess && (
            <Alert color='green' title='article updated' icon={<IconCheck />}>
              your edits have been saved!
            </Alert>
          )}
          {article.isPending && <LoadFallback />}
          {article.isSuccess && (
            <form onSubmit={form.onSubmit(handleForm)}>
              <TextInput label='Title' {...form.getInputProps('title')} />
              <Textarea label='Summery' {...form.getInputProps('summery')} />
              <Button mt='sm' type='submit' loading={edit.isPending}>
                Edit
              </Button>
            </form>
          )}
        </Fieldset>
      </Box>
      {article.isLoading && <LoadFallback />}
      {article.isSuccess && (
        <ArticleEditor
          content={article.data.content}
          onUpdate={({ editor }) => setContent(editor.getHTML())}
        />
      )}
    </Group>
  );
}

export default EditArticlePage;
