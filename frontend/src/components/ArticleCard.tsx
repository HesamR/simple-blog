import { Badge, Card, Group, Text } from '@mantine/core';
import { ArticlePartial, profileById } from '../api/api';
import usePromise from '../hooks/usePromise';
import { useEffect } from 'react';

interface Props {
  article: ArticlePartial;
}

function ArticleCard({ article }: Props) {
  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });
  };

  const profilePromise = usePromise({
    promiseFn: profileById,
  });

  useEffect(() => {
    profilePromise.call(article.userId);
  }, []);

  return (
    <Card shadow='sm' padding='lg' radius='lg' miw={350}>
      <Text component='a' href={`/article/${article.id}`} size='lg' fw={500}>
        {article.title}
      </Text>
      <Text size='sm' c='dimmed' pt='sm'>
        {article.summery}
      </Text>
      <Group justify='end' pt='md' gap='xs'>
        <Text size='xs' c='dimmed'>
          Created At:
        </Text>
        <Badge variant='light'>{formatDate(article.createAt)}</Badge>
        {profilePromise.isLoading && <p>Loading</p>}
        {profilePromise.isSuccess && (
          <>
            <Text size='xs' c='dimmed'>
              Author:
            </Text>
            <Badge component='a' href={`/user/${article.userId}`}>
              {profilePromise.output?.name}
            </Badge>
          </>
        )}
      </Group>
    </Card>
  );
}
export default ArticleCard;
