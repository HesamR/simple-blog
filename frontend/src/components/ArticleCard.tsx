import { Link } from 'react-router-dom';
import { Badge, Card, Group, Text } from '@mantine/core';
import { ArticlePartial } from '../api/api';

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

  return (
    <Card shadow='sm' padding='lg' radius='lg' miw={350}>
      <Text
        component={Link}
        to={`/article?id=${article.id}`}
        size='lg'
        fw={500}
      >
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
        <Text size='xs' c='dimmed'>
          Author:
        </Text>
        <Badge component={Link} to={`/user?id=${article.user.profile.id}`}>
          {article.user.profile.name}
        </Badge>
      </Group>
    </Card>
  );
}
export default ArticleCard;
