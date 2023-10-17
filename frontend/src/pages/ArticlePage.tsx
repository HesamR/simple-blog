import { Badge, Box, Card, Divider, Group, Text } from '@mantine/core';
import usePromise from '../hooks/usePromise';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getArticleById } from '../api/api';
import { useEffect } from 'react';
import LoadFallback from '../components/LoadFallback';

function ArticlePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const articleId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;

  if (articleId < 0) {
    navigate('/');
  }

  const articlePromise = usePromise({
    promiseFn: getArticleById,
    onError() {
      navigate('/');
    },
  });

  useEffect(() => {
    articlePromise.call(articleId);
  }, []);

  const formatDate = (value?: string): string => {
    const date = new Date(value ?? '');
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <Box maw={700} mx='auto'>
      {articlePromise.isLoading && <LoadFallback />}
      {articlePromise.isSuccess && (
        <Card shadow='md' padding='lg'>
          <Group pb='sm' justify='space-between'>
            <Text fw={500} size='xl'>
              {articlePromise.output?.title}
            </Text>
            <Group gap='xs'>
              <Text size='xs' c='dimmed'>
                Create At:
              </Text>
              <Text size='sm'>
                {formatDate(articlePromise.output?.createAt)}
              </Text>
            </Group>
          </Group>
          <Text pb='md' c='dimmed' size='xs'>
            {articlePromise.output?.summery}
          </Text>
          <Group pb='md' align='center'>
            <Text c='dimmed' size='xs'>
              Author :
            </Text>
            <Badge
              component={Link}
              to={`/user?id=${articlePromise.output?.user.profile.id}`}
            >
              {articlePromise.output?.user.profile.name}
            </Badge>
          </Group>
          <Divider labelPosition='center' />
          <div
            dangerouslySetInnerHTML={{
              __html: articlePromise.output?.content ?? '',
            }}
          ></div>
        </Card>
      )}
    </Box>
  );
}

export default ArticlePage;
