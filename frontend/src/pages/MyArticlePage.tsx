import usePromise from '../hooks/usePromise';
import { getMyArticles } from '../api/api';
import { Box, Stack, Title } from '@mantine/core';
import EditArticleCard from '../components/EditArticleCard';
import { useNavigate } from 'react-router-dom';
import LoadFallback from '../components/LoadFallback';
import { useEffect } from 'react';

function MyArticlePage() {
  const navigate = useNavigate();

  const articlePromise = usePromise({
    promiseFn: getMyArticles,
    onError() {
      navigate('/');
    },
  });

  useEffect(() => {
    articlePromise.call();
  }, []);

  return (
    <Box maw={600} mx='auto'>
      <Title pb='md' order={3}>
        My Articles
      </Title>
      <Stack>
        {articlePromise.isLoading && <LoadFallback />}
        {articlePromise.isSuccess &&
          articlePromise.output?.map((article) => (
            <EditArticleCard key={article.id} article={article} />
          ))}
      </Stack>
    </Box>
  );
}

export default MyArticlePage;
