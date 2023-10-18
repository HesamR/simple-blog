import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getUserArticles, getProfileById } from '../api/api';
import LoadFallback from '../components/LoadFallback';
import { Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

function UserPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const userId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;

  if (userId < 0) {
    navigate('/');
  }

  const profile = useQuery({
    queryKey: ['get-profile-by-id', userId],
    queryFn: () => getProfileById(userId),
  });

  const articles = useQuery({
    queryKey: ['get-user-articles', userId],
    queryFn: () => getUserArticles(userId),
  });

  if (profile.isError || articles.isError) {
    navigate('/');
  }

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
        {profile.isPending && <LoadFallback />}
        {profile.isSuccess && (
          <Card radius='lg'>
            <Title order={3}>{profile.data.name}</Title>
            <Text c='dimmed' size='sm'>
              {profile.data.bio}
            </Text>
          </Card>
        )}
      </Box>
      <Box maw={750} mx='auto'>
        {articles.isPending && <LoadFallback />}
        {articles.isSuccess && (
          <Stack justify='center'>
            {articles.data.map((article) => (
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
