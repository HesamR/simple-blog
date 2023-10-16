import { Badge, Button, Card, Divider, Group, Text } from '@mantine/core';
import { ArticlePartial2, deleteArticle } from '../api/api';
import usePromise from '../hooks/usePromise';
import { useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface Props {
  article: ArticlePartial2;
}

function EditArticleCard({ article }: Props) {
  const navigate = useNavigate();
  const deletePromise = usePromise({
    promiseFn: deleteArticle,
    onError() {
      navigate('/');
    },

    onSuccess() {
      navigate(0);
    },
  });

  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <Card shadow='sm' radius='lg' miw={350}>
      <Group pb='sm' justify='space-between'>
        <Text component='a' href={`/article/${article.id}`} size='lg' fw={500}>
          {article.title}
        </Text>
        <Group>
          <Text size='xs' c='dimmed'>
            Created At:
          </Text>
          <Badge variant='light'>{formatDate(article.createAt)}</Badge>
        </Group>
      </Group>
      <Divider />
      <Text size='sm' c='dimmed' pt='sm'>
        {article.summery}
      </Text>
      <Group pt='sm' justify='end'>
        <Button
          variant='outline'
          size='compact-sm'
          rightSection={<IconEdit size={16} />}
          onClick={() => navigate(`/edit-article?id=${article.id}`)}
        >
          Edit
        </Button>
        <Button
          color='red'
          size='compact-sm'
          rightSection={<IconTrash size={16} />}
          loading={deletePromise.isLoading}
          onClick={() => deletePromise.call({ articleId: article.id })}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}
export default EditArticleCard;
