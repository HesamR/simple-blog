import { Badge, Box, Card, Divider, Group, Text } from '@mantine/core';
import usePromise from '../hooks/usePromise';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, profileById } from '../api/api';
import { useEffect } from 'react';

function ArticlePage() {
  const navigate = useNavigate();
  const params = useParams();
  const articleId = params['id'] ? parseInt(params['id']) : -1;

  if (articleId < 0) {
    navigate('/');
  }

  const articlePromise = usePromise({
    promiseFn: getArticleById,
    onError() {
      navigate('/');
    },
  });

  const profilePromise = usePromise({
    promiseFn: profileById,
  });

  useEffect(() => {
    if (articlePromise.isSuccess) {
      profilePromise.call(articlePromise.output?.userId);
    }
  }, [articlePromise.isSuccess]);

  useEffect(() => {
    articlePromise.call(articleId);
  }, []);

  const formatDate = (value?: string): string => {
    const date = new Date(value ?? '');
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <Box maw={700} mx='auto'>
      {articlePromise.isLoading && <p>Loading...</p>}
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
              Auther :
            </Text>
            {profilePromise.isLoading && <p>Loading...</p>}
            {profilePromise.isSuccess && (
              <Badge
                component='a'
                href={`/user/${articlePromise.output?.userId}`}
              >
                {profilePromise.output?.name}
              </Badge>
            )}
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
