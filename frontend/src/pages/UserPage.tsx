import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import usePromise from '../hooks/usePromise';
import { getArticleByUserId, profileById } from '../api/api';
import { useEffect } from 'react';
import LoadFallback from '../components/LoadFallback';
import { Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core';

function UserPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const userId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;

  if (userId < 0) {
    navigate('/');
  }

  const profilePromise = usePromise({
    promiseFn: profileById,
    onError() {
      navigate('/');
    },
  });

  const articlesPromise = usePromise({
    promiseFn: getArticleByUserId,
    onError() {
      navigate('/');
    },
  });

  useEffect(() => {
    profilePromise.call(userId);
    articlesPromise.call(userId);
  }, []);

  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <div>
      <Box maw={500} mx='auto' pb='sm'>
        {profilePromise.isLoading && <LoadFallback />}
        {profilePromise.isSuccess && (
          <Card radius='lg'>
            <Title order={3}>{profilePromise.output?.name}</Title>
            <Text c='dimmed' size='sm'>
              {profilePromise.output?.bio}
            </Text>
          </Card>
        )}
      </Box>
      <Box maw={750} mx='auto'>
        {articlesPromise.isLoading && <LoadFallback />}
        {articlesPromise.isSuccess && (
          <Stack justify='center'>
            {articlesPromise.output?.map((article) => (
              <Card key={article.id} radius='lg'>
                <Group justify='space-between' pb='sm'>
                  <Text
                    fw={500}
                    size='lg'
                    component={Link}
                    to={`/article?id=${article.id}`}
                  >
                    {article.title}
                  </Text>
                  <Group>
                    <Text size='xs' c='dimmed'>
                      Create At
                    </Text>
                    <Badge variant='light'>
                      {formatDate(article.createAt)}
                    </Badge>
                  </Group>
                </Group>
                <Text c='dimmed' size='sm'>
                  {article.summery}
                </Text>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </div>
  );
}

export default UserPage;
