import { Badge, Box, Card, Divider, Group, Text } from '@mantine/core';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getArticleById } from '../api/api';
import LoadFallback from '../components/LoadFallback';
import { useQuery } from '@tanstack/react-query';

function ArticlePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const articleId = params.has('id') ? parseInt(params.get('id') ?? '-1') : -1;

  if (articleId < 0) {
    navigate('/');
  }

  const { isError, isSuccess, isPending, data } = useQuery({
    queryKey: ['get-article-by-id', articleId],
    queryFn: () => getArticleById(articleId),
  });

  if (isError) {
    navigate('/');
  }

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
      {isPending && <LoadFallback />}
      {isSuccess && (
        <Card shadow='md' padding='lg'>
          <Group pb='sm' justify='space-between'>
            <Text fw={500} size='xl'>
              {data.title}
            </Text>
            <Group gap='xs'>
              <Text size='xs' c='dimmed'>
                Create At:
              </Text>
              <Text size='sm'>{formatDate(data.createAt)}</Text>
            </Group>
          </Group>
          <Text pb='md' c='dimmed' size='xs'>
            {data.summery}
          </Text>
          <Group pb='md' align='center'>
            <Text c='dimmed' size='xs'>
              Author :
            </Text>
            <Badge component={Link} to={`/user?id=${data.user.profile.id}`}>
              {data.user.profile.name}
            </Badge>
          </Group>
          <Divider labelPosition='center' />
          <div
            dangerouslySetInnerHTML={{
              __html: data.content ?? '',
            }}
          ></div>
        </Card>
      )}
    </Box>
  );
}

export default ArticlePage;
