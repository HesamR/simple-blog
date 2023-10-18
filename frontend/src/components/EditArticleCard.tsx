import { Link } from 'react-router-dom';
import { Badge, Button, Card, Divider, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ArticlePartial2, deleteArticle } from '../api/api';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

interface Props {
  article: ArticlePartial2;
}

function EditArticleCard({ article }: Props) {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);

  const userId = auth.user?.id ?? -1;

  const { isPending, mutate } = useMutation({
    mutationFn: deleteArticle,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['get-all-articles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-user-articles', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-article-by-id', article.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'get-my-articles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-user', 'get-my-article-by-id', article.id],
      });
    },
  });

  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <Card shadow='sm' radius='lg' miw={350}>
      <Group pb='sm' justify='space-between'>
        <Text
          component={Link}
          to={`/article?id=${article.id}`}
          size='lg'
          fw={500}
        >
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
          component={Link}
          size='compact-sm'
          rightSection={<IconEdit size={16} />}
          to={`/edit-article?id=${article.id}`}
        >
          Edit
        </Button>
        <Button
          color='red'
          size='compact-sm'
          rightSection={<IconTrash size={16} />}
          loading={isPending}
          onClick={() => mutate({ articleId: article.id })}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}
export default EditArticleCard;
