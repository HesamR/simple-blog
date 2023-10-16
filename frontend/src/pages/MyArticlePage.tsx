import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import usePromise from '../hooks/usePromise';
import { getArticleByUserId } from '../api/api';
import { Box, Stack, Title } from '@mantine/core';
import EditArticleCard from '../components/EditArticleCard';
import { useNavigate } from 'react-router-dom';

function MyArticlePage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const articlePromise = usePromise({
    promiseFn: getArticleByUserId,
    onError() {
      navigate('/');
    },
  });

  useEffect(() => {
    articlePromise.call(auth.user?.id);
  }, []);

  return (
    <Box maw={600} mx='auto'>
      <Title pb='md' order={3}>
        My Articles
      </Title>
      <Stack>
        {articlePromise.isLoading && <p>Loading...</p>}
        {articlePromise.isSuccess &&
          articlePromise.output?.map((article) => (
            <EditArticleCard key={article.id} article={article} />
          ))}
      </Stack>
    </Box>
  );
}

export default MyArticlePage;
