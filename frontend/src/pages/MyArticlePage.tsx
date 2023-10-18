import { useNavigate } from 'react-router-dom';
import { Box, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import EditArticleCard from '../components/EditArticleCard';
import LoadFallback from '../components/LoadFallback';
import { getMyArticles } from '../api/api';

function MyArticlePage() {
  const navigate = useNavigate();

  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ['current-user', 'get-my-articles'],
    queryFn: getMyArticles,
  });

  if (isError) {
    navigate('/');
  }

  return (
    <Box maw={600} mx='auto'>
      <Title pb='md' order={3}>
        My Articles
      </Title>
      <Stack>
        {isPending && <LoadFallback />}
        {isSuccess &&
          data.map((article) => (
            <EditArticleCard key={article.id} article={article} />
          ))}
      </Stack>
    </Box>
  );
}

export default MyArticlePage;
