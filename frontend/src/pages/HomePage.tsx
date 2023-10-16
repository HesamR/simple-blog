import { useEffect } from 'react';
import { getAllArticles } from '../api/api';
import usePromise from '../hooks/usePromise';
import { Box, Group } from '@mantine/core';
import ArticleCard from '../components/ArticleCard';

function HomePage() {
  const getArticlePromise = usePromise({
    promiseFn: getAllArticles,
  });

  useEffect(() => {
    getArticlePromise.call();
  }, []);

  return (
    <Box>
      {getArticlePromise.isLoading && <p>Loading...</p>}
      {getArticlePromise.isSuccess && (
        <Group wrap='wrap' grow justify='center'>
          {getArticlePromise.output?.map((value) => (
            <ArticleCard article={value} key={value.id} />
          ))}
        </Group>
      )}
    </Box>
  );
}

export default HomePage;
